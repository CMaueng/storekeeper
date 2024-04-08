import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,TouchableOpacity,StyleSheet,ScrollView } from 'react-native';
import { db } from '../config';
import { ref, get } from 'firebase/database';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const ProductAnalyticsScreen = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [sortAscending, setSortAscending] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const dailyRef = ref(db, 'purchaseHistory/daily');

      try {
        const snapshot = await get(dailyRef);

        if (snapshot.exists()) {
          const dailyData = snapshot.val();
          console.log('Data:', dailyData);

          // Transform the daily data into an array of purchases
          const purchases = [];

          for (const year in dailyData) {
            if (selectedYear === 'All' || year === selectedYear) {
              for (const month in dailyData[year]) {
                if (selectedMonth === 'All' || month === selectedMonth) {
                  for (const day in dailyData[year][month]) {
                    if (selectedDay === 'All' || day === selectedDay) {
                      for (const product in dailyData[year][month][day]) {
                        const productData = dailyData[year][month][day][product];
                        purchases.push({
                          year,
                          month,
                          day,
                          product,
                          ...productData,
                        });
                      }
                    }
                  }
                }
              }
            }
          }

          // Sort purchases by quantity (most purchased first)
          purchases.sort((a, b) => {
            const sortFactor = sortAscending ? 1 : -1;
            return sortFactor * (b.quantity - a.quantity);
          });

          setPurchaseData(purchases);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, selectedDay,sortAscending]);

  const availableYears = ['All', '2022', '2023', '2024', '2025', '2026'];
  const availableMonths = ['All', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const availableDates = ['All', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

  const toggleSorting = () => {
    setSortAscending(!sortAscending);
  };

  const sortingButtonText = `Sort ${sortAscending ? 'Descending' : 'Ascending'}`;
  
  return (
    <View style={{ backgroundColor: '#F8F0E5', flex: 1 }}>
       <Text style={styles.title}> Purchase History </Text>
       <TouchableOpacity onPress={toggleSorting}>
          <Ionicons name="filter" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Current Sorting: {sortingButtonText}</Text>


    <View style={{flexDirection:'row', margin:20 }}>
      <Picker
        style={styles.picker}
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}>
        {availableYears.map((year) => (
          <Picker.Item key={year} label={year} value={year} />
        ))}
      </Picker>

      <Picker
        style={styles.picker}
        selectedValue={selectedMonth}
        onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
        {availableMonths.map((month) => (
          <Picker.Item key={month} label={month} value={month} />
        ))}
      </Picker>

      <Picker
        style={styles.picker}
        selectedValue={selectedDay}
        onValueChange={(itemValue) => setSelectedDay(itemValue)}>
        {availableDates.map((day) => (
          <Picker.Item key={day} label={day} value={day} />
        ))}
      </Picker>
      </View>
      
      <FlatList
        data={purchaseData}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Product: {item.product}</Text>
            <Text style={styles.subtitle}>Cost: {item.cost} ฿</Text>
            <Text style={styles.subtitle}>Product Name: {item.productName}</Text>
            <Text style={styles.subtitle}>Profit or Loss: {item.profitOrLoss}</Text>
            <Text style={styles.subtitle}>Profit or Loss Amount: {item.profitOrLossAmount} ฿</Text>
            <Text style={styles.subtitle}>Quantity: {item.quantity}</Text>
            <Text style={styles.subtitle}>Revenue: {item.revenue} ฿{`\n`}</Text>
            
          </View>
        )}
        keyExtractor={(item) => `${item.year}-${item.month}-${item.day}-${item.product}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title:{
    fontSize: 20, 
    alignSelf:'center',
    color:'#0F2C59',
    marginTop:15
  },
  subtitle:{
    fontSize: 16,
    marginStart: 40, 
    color:'#0F2C59'
  },
  button:{
    width: 200,
    marginTop: 5,
    color:'#F8F0E5',
    alignSelf:'center',
  },
  container:{
    marginLeft:30,
    marginRight:30,
    borderBottomColor:'#DAC0A3',
    paddingVertical:5,
    borderBottomWidth:2,
  },
  icon: {
    fontSize: 40,
    paddingStart:320,
    color:"#DAC0A3",
  },
  picker:{
    height: 50, 
    width: 120, 
    color:'#0F2C59'
  },
  label: {
    fontSize: 20,
    color:'#F8F0E5',
    fontWeight: 'bold',
  },
});


export default ProductAnalyticsScreen;