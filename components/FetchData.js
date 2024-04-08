
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { db } from '../config'; // Replace with your Firebase configuration
import { ref, onValue } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const FetchData = () => {
  const [todoData, setTodoData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Replace 'db' with your Firebase database reference
    const databaseRef = ref(db, 'products/');

    onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTodoData(dataArray);
      } else {
        console.log('No data found.');
        setTodoData([]);
      }
    });

  }, []);

  const navigateToProductList = (selectedItem) => {
    navigation.navigate('ProductList', { selectedItem });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={todoData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToProductList(item)}>
            <View style={styles.row}>
              <Text style=
              {{
                fontSize: 15,
                marginStart:5,
                margin: 10,
                color:'#0F2C59',
              }}>
                Name : {item.title} {'\n'}
                Category: {item.category} {'\n'}
                Sellingprice: {item.sellingprice} {'\n'}
                Productquantity: {item.productquantity} {'\n'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    width: 370,
    height: 130,
    padding:10,
    margin: 5,
    flexDirection:'row',
    borderRadius: 30,
    borderWidth: 2,
    borderColor:'#0F2C59',
    backgroundColor: "#EADBC8",
    alignSelf:'center',
    justifyContent: 'space-between',
  },
});

export default FetchData;
