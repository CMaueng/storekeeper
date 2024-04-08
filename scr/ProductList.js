import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';

const ProductList = ({ route, navigation }) => {
  const { selectedItem } = route.params;

  // // Initialize an array to store selected items
  // const [selectedItems, setSelectedItems] = useState([]);

  // // Function to update selectedItems
  // const updateSelectedItems = (newItem) => {
  //   setSelectedItems((prevSelectedItems) => [...prevSelectedItems, newItem]);
  // }


  return (
    <View style={{flex: 1,backgroundColor:'#F8F0E5'}}>
     <View style={styles.container}>
      <Text style={styles.title}> Name: {selectedItem.title} {`\n`} </Text>
      <Text style={styles.title}> Category: {selectedItem.category}{`\n`} </Text> 
      <Text style={styles.title}> Cost: {selectedItem.cost}{`\n`} </Text>
      <Text style={styles.title}> Barcodenumber: {selectedItem.barcodenumber}{`\n`} </Text>
      <Text style={styles.title}> Sellingprice: {selectedItem.sellingprice}{`\n`} </Text>
      <Text style={styles.title}> Productquantity: {selectedItem.productquantity}{`\n`} </Text>
      <Text style={styles.title}> Productsize: {selectedItem.productsize}{`\n`} </Text>
      <Text style={styles.title}> Producttype: {selectedItem.producttype}{`\n`} </Text>
      <Text style={styles.title}> ProductExpenses : {selectedItem.expenses}{`\n`} </Text>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetails', { selectedItem })}
        style={styles.button}
      >
        <Text style={styles.label}>Click to Add</Text>
      </TouchableOpacity> */}
     </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 600,
    marginTop: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor:'#0F2C59',
    backgroundColor: "#EADBC8",
    alignSelf:'center',
  },
  title:{
    fontSize: 18,
    marginTop:5,
    marginLeft: 15,
    color:'#0F2C59',
    alignSelf:'flex-start',
  },
});

export default ProductList;

