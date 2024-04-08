import { View,Text,StyleSheet,TextInput,Button,ScrollView,TouchableOpacity,Alert } from "react-native";
import React, { useState,useEffect } from "react";
import {db} from '../config';
import {ref,set,remove,serverTimestamp,push,get } from 'firebase/database'
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

const Add = ({navigation,route})=> {
    
    const [category,setCategory] = useState('')
    const [title, setTitle] = useState('');
    const [cost,setCost] = useState('');
    const [sellingprice, setSellingPrice] = useState('');
    const [producttype,setProductType] = useState('');
    const [productquantity,setProductQuantity] = useState('');
    const [productsize,setProductSize] = useState('');
    const [barcodenumber, setBarcodeNumber] = useState('');
    const [barcodeData, setBarcodeData] = useState(route.params?.barcodeData || ""); // Initialize with route.params.barcodeData
    const expenses = cost*productquantity;
    
    useEffect(() => {
      // Update barcodeData whenever route.params.barcodeData changes
      if (route.params?.barcodeData !== barcodeData) {
        setBarcodeData(route.params?.barcodeData || "");
      }
    }, [route.params?.barcodeData]);
    
    //funtion เพิ่ม data ลงใน db realtime
    

    const dataAddon = () => {
        
        set(ref(db,'products/'+title),{
            category:category,
            title : title,
            cost : cost,
            barcodenumber: barcodeData,
            sellingprice : sellingprice,
            productquantity : productquantity,
            productsize :  productsize,
            producttype :  producttype,
            timestamp: serverTimestamp(),
            expenses:  expenses,
            
            
        });
        setCategory('')
        setTitle('')
        setCost('')
        setBarcodeNumber('')
        setProductType('')
        setSellingPrice('')
        setProductQuantity('')
        setProductSize('')
    }
    
    const deleteData = () => {
        // Proceed with the deletion.
        remove(ref(db, 'products/' + title))
            .then(() => {
                console.log('Remove Succeeded!!');
            })
            .catch((error) => {
                console.log('Remove Failed!! ' + error.message);
            });
    }
    
    const confirmDelete = () => {
        Alert.alert(
            // Title
            'Confirm Delete',
            // Body
            'Are you sure you want to delete it?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        deleteData(); // Call the deleteData function here
                    },
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: false }
            // Clicking outside of the alert will not cancel
        );
    }
    
    return (
        
        <View style={styles.container}>      
            <ScrollView>  
            <TextInput
            placeholder = 'Name'
            value={title}
            onChangeText = {(text)=> setTitle(text)}
            style={styles.input}
            />
            <TextInput
            placeholder = 'Category'
            value={category}
            onChangeText = {(text)=> setCategory(text)}
            style={styles.input}
            />
            <TextInput
            placeholder = 'Product Size'
            value={productsize}
            onChangeText = {(text)=> setProductSize(text)}
            style={styles.input}
            />
            <TextInput
            placeholder = 'Product Type'
            value={producttype}
            onChangeText = {(text)=> setProductType(text)}
            style={styles.input}
            />
            <TextInput
            placeholder = 'Cost'
            value={cost}
            keyboardType="numeric"
            onChangeText = {(text)=> setCost(text)}
            style={styles.input}
            />
            <TextInput
            placeholder = 'Selling Price'
            value={sellingprice}
            keyboardType="numeric"
            onChangeText = {(text)=> setSellingPrice(text)}
            style={styles.input}
            />
             <TextInput
            placeholder="Barcode Number"
            value={barcodeData}
            keyboardType="numeric"
            onChangeText={(text) => {
            setBarcodeNumber(text);
            setBarcodeData(text); // Set barcodeData to the same value as barcodenumber
            }}
            editable={false}
            style={styles.input}
            />
            <TextInput
            placeholder = 'Product Quantity'
            value={productquantity}
            keyboardType="numeric"
            onChangeText = {(text)=> setProductQuantity(text)}
            style={styles.input}
            />
            <View style={styles.newcontainer}>
            <TouchableOpacity
            onPress = {dataAddon}
            style={styles.button}
            >
            <Entypo name="add-to-list" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
            onPress = {()=>navigation.navigate('Scans')}
            style={styles.button}
            >
            <MaterialCommunityIcons name="barcode-scan" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
            onPress = {confirmDelete}
            style={styles.button}
            >
            <FontAwesome5 name="trash-alt" style={styles.icon} />
            </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container :{
        flex :1 ,
        paddingTop:30,
        backgroundColor:"#F8F0E5",
        paddingLeft:10,
        paddingRight:10,
        
    },
    newcontainer :{
        padding:10,
        justifyContent:'space-between',
        flexDirection:'row',
        
    },
    input : { 
        width:372,
        borderWidth:2,
        borderRadius: 30,
        color:'#0F2C59',
        backgroundColor:'#EADBC8',
        borderColor:"#0F2C59",
        padding:17,
        marginBottom:10,
        fontStyle:'italic'
    },
    icon : { 
        fontSize: 40,
        justifyContent:'space-between',
        color:"#0F2C59",
    },
    camera: {
        flex: 1,
        aspectRatio: 1,
      },
    button: {
        marginTop: 10,
        width: 90,
        height: 60,
        backgroundColor: "#DAC0A3",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
      },
    barcodeText: {
        marginTop: 10,
        fontSize: 16,
      },
});

export default Add