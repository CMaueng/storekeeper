// หน้า profile
import {Text,StyleSheet,SafeAreaView,TouchableOpacity,View } from 'react-native';
import React, { useState,useEffect} from "react";
import {firebase} from "../config";
import { useNavigation } from '@react-navigation/native';


const Profile = () => {
    const navigation = useNavigation()
    const [name,setName] = useState('')

    //change the passwords
    const changePassword = () => {
        firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email)
        .then(()=> {
            alert("Password reset email sent")
        }).catch((error) => {
            alert(error)
        })
    }

    useEffect(() => {
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid).get()
        .then((snapshot) => {
            if(snapshot.exists){
                setName(snapshot.data())
            }
            else {
                console.log('User does not exist')
            }
        })
    },[])
    return (
        <SafeAreaView style={styles.container}>  
            <Text style={{fontSize:20,fontWeight:'bold',color:'#0F2C59'}}>
                Welcome👋
                    {'\n'} Name : {name.firstName} {name.lastName} 
                    {'\n'} Email: {name.email}
                    {'\n'} Telephone: {name.telephone}
                    {'\n'} Address: {name.address}
            </Text>
            <TouchableOpacity 
            onPress={() => {changePassword()}}
            style = {styles.button}
            >
                <Text style={{fontSize:23,fontWeight:'bold',color:'#0F2C59'}}>
                    Change Password
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={() => {firebase.auth().signOut()}}
            style = {styles.button}
            >
                <Text style={{fontSize:23,fontWeight:'bold',color:'#0F2C59'}}>
                    Sign Out
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
        
    )
    
}

export default Profile

const styles = StyleSheet.create({
    container :{
        flex :1 ,
        alignItems:'center',
        paddingTop:100,
        backgroundColor:"#F8F0E5"
    },
    button:{
        marginTop:50,
        height:70,
        width:250,
        backgroundColor:'#DAC0A3',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50
    }
})
