import { View, Text } from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState,useEffect} from "react";
import Scans from '../../scr/Scans'
import ProductList from "../../scr/ProductList";
import Tabs from "../tab";
import BarcodeScanner from '../../scr/BarcodeScanner';
import ImageSet from '../../components/Imgset';

const Stack = createStackNavigator();
const Routes = () => {

   // Initialize an array to store selected items from different ProductList components
   const [selectedItems, setSelectedItems] = React.useState([]);

   // Function to update selectedItems
   const updateSelectedItems = (newItem) => {
  setSelectedItems((prevSelectedItems) => ({
    ...prevSelectedItems,
    ...newItem,
  }));
}
  return (
    <Stack.Navigator screenOptions={{headerTitleAlign:'center',headerTintColor:'#F8F0E5' ,headerStyle: {backgroundColor: '#DAC0A3'}}}>
      <Stack.Screen name="Tabs"  component={Tabs} options={{ headerShown: false }}/>
      <Stack.Screen name ="Scans" component={Scans}  />
      <Stack.Screen name ="BarcodeScanner" component={BarcodeScanner} />
      <Stack.Screen name ="ProductList" component={ProductList}  />
      <Stack.Screen name ="ImageSet" component={ImageSet} />
  </Stack.Navigator>
  )
}

export default Routes