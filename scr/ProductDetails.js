import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ref, query, orderByChild, equalTo, onValue, get, update,set } from 'firebase/database';
import { db } from '../config';
import { useNavigation } from '@react-navigation/native';
import { useScannedProducts } from '../components/Context/ScannedProductsContext';
import { ScrollView } from 'react-native-gesture-handler';
import { push, serverTimestamp } from 'firebase/database';
import { MaterialIcons,MaterialCommunityIcons  } from '@expo/vector-icons'; 

const ProductDetails = () => {
  const route = useRoute();
  const scannedBarcode = route.params?.scannedBarcode || null;
  const [productData, setProductData] = useState([]);
  const { scannedProducts, setScannedProducts } = useScannedProducts();
  const navigation = useNavigation();
  const [quantityString, setQuantityString] = useState({});
  const [accumulatedQuantity, setAccumulatedQuantity] = useState(0);
  const [customerMoney, setCustomerMoney] = useState(''); // State to store customer's money
  const [change, setChange] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); // State to store the calculated total price
  const [productPrices, setProductPrices] = useState({});
  useEffect(() => {
    const databaseRef = ref(db, 'products/');
    const barcodeQuery = query(
      databaseRef,
      orderByChild('barcodenumber'),
      equalTo(scannedBarcode)
    );

    onValue(barcodeQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const products = Object.values(data);
        setProductData(products);
      } else {
        setProductData([]);
      }
    });
  }, [scannedBarcode]);

  const addNewProduct = async () => {
    try {
      const selectedProduct = productData[0];
      const numericQuantity = Number(quantityString[selectedProduct.title] || 0);

      // Update the product quantity in the database
      const productPath = 'products/' + selectedProduct.title;
      const productRef = ref(db, productPath);

      await update(productRef, {
        productquantity: selectedProduct.productquantity - numericQuantity,
      });

      // Add the scanned product data to the list of scanned products with quantityString
      setScannedProducts((prevScannedProducts) => [
        ...prevScannedProducts,
        { ...selectedProduct, quantityString: quantityString[selectedProduct.title] },
      ]);

      // Clear the quantityString input and recalculate the total price
      setQuantityString({ ...quantityString, [selectedProduct.title]: '' });
      const totalPrice = calculateTotalPrice([
        ...scannedProducts,
        { ...selectedProduct, quantityString: quantityString[selectedProduct.title] },
      ]);
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error adding new product:', error);
    }
  };

  const calculateTotalPrice = (products) => {
    let totalPrice = 0;
    products.forEach((product) => {
      const quantity = Number(product.quantityString) || 0;
      totalPrice += product.sellingprice * quantity;
    });
    return totalPrice;
  };

  const handleQuantityChange = (text, title) => {
    const updatedScannedProducts = scannedProducts.map((product) => {
      if (product.title === title) {
        // Calculate the quantity based on the user input
        const newQuantity = parseFloat(text) / product.sellingprice;
        return { ...product, quantityString: text, quantity: newQuantity };
      } else {
        return product;
      }
    });
    const totalPrice = calculateTotalPrice(updatedScannedProducts);
  
 // Update the state variables
 setQuantityString({ ...quantityString, [title]: text });
  setScannedProducts(updatedScannedProducts);
  setTotalPrice(totalPrice);
  };

  const deleteProduct = (index) => {
    // Remove the selected product from the scannedProducts array
    const updatedScannedProducts = scannedProducts.filter((_, i) => i !== index);
    setScannedProducts(updatedScannedProducts);

    // Recalculate the total price after deleting the product
    const totalPrice = calculateTotalPrice(updatedScannedProducts);
    setTotalPrice(totalPrice);
  };

  const calculateChange = async () => {
    try {
      if (scannedProducts.length > 0) {
        const updates = {}; // Create an object to store all the updates
        const productsToUpdate = [];
  
        for (const selectedProduct of scannedProducts) {
          const productTitle = selectedProduct.title;
          const numericQuantity = Number(quantityString[productTitle] || '');
  
          // Find the database reference for the selected product
          const productPath = 'products/' + productTitle;
          const productRef = ref(db, productPath);
  
          // Get the product data from the database
          const snapshot = await get(productRef);
  
          if (snapshot.exists()) {
            const databaseProduct = snapshot.val();
            const databaseQuantity = databaseProduct.productquantity;
  
            // Calculate the new quantity in the database by subtracting the scanned quantity
            const newQuantity = databaseQuantity - numericQuantity;
  
            // Add the update to the object
            updates[productPath] = { ...databaseProduct, productquantity: newQuantity };
            productsToUpdate.push(selectedProduct);
          }
        }
  
        // Perform a batch update to the database
        await update(ref(db), updates);
  
        const totalPrice = calculateTotalPrice(scannedProducts);
        const moneyReceived = parseFloat(customerMoney);
  
        if (!isNaN(moneyReceived) && moneyReceived >= totalPrice) {
          const calculatedChange = moneyReceived - totalPrice;
  
          if (productsToUpdate.length > 0) {
            const now = new Date();
            const currentDay = now.getDate();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();
  
            for (const selectedProduct of productsToUpdate) {
              // Calculate the new accumulated quantity
              const newAccumulatedQuantity = accumulatedQuantity + Number(quantityString[selectedProduct.title] || 0);
  
              // Calculate the profit for the new accumulated quantity
              const profit = (newAccumulatedQuantity * selectedProduct.sellingprice) - (newAccumulatedQuantity * selectedProduct.cost);
              
              
              // Determine whether it's a profit or loss
              const isProfit = profit >= 0;
              const profitOrLoss = isProfit ? profit : -profit; // Absolute value
  
              // Update the state with the new accumulated quantity
              setAccumulatedQuantity(newAccumulatedQuantity);
  
              // Update the daily purchase history record with the new accumulated quantity and profit/loss
              const dailyPurchaseHistoryRef = ref(
                db,
                `purchaseHistory/daily/${currentYear}/${currentMonth}/${currentDay}`
              );
              
              const dailySnapshot = await get(dailyPurchaseHistoryRef);

              const dailyPurchaseRecord = {
                productName: selectedProduct.title,
                quantity: newAccumulatedQuantity, // Use the new accumulated quantity
                timestamp: serverTimestamp(),
                revenue: newAccumulatedQuantity * selectedProduct.sellingprice,
                cost: selectedProduct.cost,
                profitOrLoss: isProfit ? "Profit" : "Loss", // Indicates whether it's a profit or loss
                profitOrLossAmount: profitOrLoss.toFixed(2), // Display the profit/loss amount
              };
              
              // Update daily data
              if (dailySnapshot.exists()) {
                const existingData = dailySnapshot.val();
                const existingRecord = existingData[selectedProduct.title];
              
                if (existingRecord) {
                  existingRecord.quantity = newAccumulatedQuantity;
                  existingRecord.timestamp = serverTimestamp();
                  existingRecord.revenue = newAccumulatedQuantity * selectedProduct.sellingprice;
                  existingRecord.cost = selectedProduct.cost;
                  existingRecord.profitOrLoss = isProfit ? "Profit" : "Loss";
                  existingRecord.profitOrLossAmount = profitOrLoss.toFixed(2);
              
                  await update(dailyPurchaseHistoryRef, {
                    [selectedProduct.title]: existingRecord,
                  });
                } else {
                  // If the record does not exist, add a new record
                  await update(dailyPurchaseHistoryRef, {
                    [selectedProduct.title]: dailyPurchaseRecord,
                  });
                }
              } else {
                // If no data exists, add a new record
                await update(dailyPurchaseHistoryRef, {
                  [selectedProduct.title]: dailyPurchaseRecord,
                });
              }

              console.log('Purchase records updated in purchase history.');
            }
          } else {
            console.error('No products to update.');
          }
          setChange(calculatedChange);
        } else {
          const deficit = totalPrice - moneyReceived;
          setChange(-deficit);
        }
      } else {
        console.error('No scanned products available.');
      }
    } catch (error) {
      console.error('Error updating product data:', error);
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.productListContainer}>
          <Text style={styles.heading}>Scanned Products:</Text>
          {scannedProducts.length > 0 ? (
            scannedProducts.map((product, index) => (
              <View key={index} style={styles.productContainer}>
                <Text>Title: {product.title}</Text>
                <Text>Barcode: {product.barcodenumber}</Text>
                <Text>Price: {product.sellingprice} ฿</Text>
                <Text>Quantity:</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={quantityString[product.title] || ''}
                  onChangeText={(text) => handleQuantityChange(text, product.title)}
                  keyboardType="numeric"
                />
                
                <TouchableOpacity onPress={() => deleteProduct(index)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={{color:'#0F2C59'}}>No scanned products yet.</Text>
          )}

          {/* Display the calculated total price */}
          <Text style={{color:'#0F2C59'}}>Total Price: {totalPrice}฿</Text>

          <TextInput
            title="Customer money"
            style={styles.quantityInput}
            placeholder="Customer's Money"
            value={customerMoney}
            onChangeText={(text) => setCustomerMoney(text)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.productListContainer}>
          <Text style={styles.heading}>Product Details:</Text>
          {productData.length > 0 ? (
            productData.map((product, index) => (
              <View key={index} style={styles.productContainer}>
                <Text style={{color:'#0F2C59'}}>Title: {product.title}</Text>
                <Text style={{color:'#0F2C59'}}>Barcode: {product.barcodenumber}</Text>
              </View>
            ))
          ) : (
            <Text style={{color:'#0F2C59'}}>No products found for the scanned barcode: {scannedBarcode}</Text>
          )}

          {/* Add button to add the scanned product */}
          <TouchableOpacity style={styles.button} onPress={addNewProduct}>
            <Text style={styles.label}>Add Scanned Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={calculateChange}>
            <Text style={styles.label}>Calculate Change</Text>
          </TouchableOpacity>
          
          {/* Display the calculated change */}
          {change !== null && (
            <Text style={styles.quantityInput}>
              Change: {change === 0 ? '0' : `${Math.abs(change).toFixed(2)}${change < 0 ? ' (Deficit)' : ''}`} ฿
            </Text>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('BarcodeScanner')}
            style={styles.button}
          >
            <MaterialCommunityIcons name="barcode-scan" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ImageSet')}
            style={styles.button}
          >
            <MaterialIcons name="payment" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F8F0E5',
  },
  productListContainer: {
    width: '100%',
    padding: 10,
  },
  productContainer: {
    borderWidth: 2,
    backgroundColor:'#EADBC8',
    borderRadius: 30,
    borderColor: '#0F2C59',
    padding: 10,
    marginBottom: 10,
  },
  quantityInput: {
    borderWidth: 2,
    borderRadius: 30,
    color:'#0F2C59',
    backgroundColor:'#EADBC8',
    borderColor: '#0F2C59',
    padding: 7,
    margin:10,
  },
  heading: {
    fontSize: 25,
    color:'#0F2C59',
    fontWeight: 'bold',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 5,
  },
  button: {
    height: 70,
    backgroundColor: '#DAC0A3',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    margin:10,
  },
  icon: {
    fontSize: 40,
    justifyContent:'space-between',
    color:"#0F2C59",
  },
  label: {
    fontSize: 20,
    color:'black',
    fontWeight: 'bold',
  },
});

export default ProductDetails;
