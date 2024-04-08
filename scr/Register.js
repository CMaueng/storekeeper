// หน้า register
import { View, Text, TouchableOpacity,TextInput,StyleSheet} from 'react-native'
import React,{useState} from 'react'
import {firebase} from '../config'
import { ScrollView } from 'react-native-gesture-handler'
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';

const Register = () => {
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [firstName, setFirstName] = useState('')
 const [lastName, setLastName] = useState('')
 const [telephone,setTelePhone] = useState('')
 const [address,setAddress] = useState('')


 regUser = async (email,password,firstName,lastName) => {
    await firebase.auth().createUserWithEmailAndPassword(email,password)
    .then(() => {
        firebase.auth().currentUser.sendEmailVerification({

            handleCodeInApp: true,
            url: 'https://test1-480ea.firebaseapp.com',
        })
        .then(()=>{
            alert('Verlification email sent')
        })
        .catch((error) =>{
            alert(error.message)
        })
        .then(()=>{
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
                firstName,
                lastName,
                email,
                telephone,
                address,
            })
        })
        .catch((error) =>{
            alert(error.message)
        })
    })
    .catch((error =>{
        alert(error.message)
    }))
 }
 return (
    <ScrollView>
    <View style = {styles.container}>       
        <Text style={{fontWeight:'bold',fontSize:50, color:'#DAC0A3'}}>
            Register 
        </Text>
        <View style={{marginTop: 40}}>
        <TextInput 
        style={styles.textInput}
        placeholder='First name'
        onChangeText={(firstName)=>setFirstName(firstName)}
        autoCorrect={false}
        
        />
         <TextInput 
        style={styles.textInput}
        placeholder='Last name'
        onChangeText={(lastName)=>setLastName(lastName)}
        autoCorrect={false}
        />
        <TextInput 
        style={styles.textInput}
        placeholder='Email'
        onChangeText={(email)=>setEmail(email)}
        autoCapitalize='none'
        autoCorrect={false}
        keyboardType='email-address'
        />
        <TextInput 
        style={styles.textInput}
        placeholder='Passwords'
        onChangeText={(password)=>setPassword(password)}
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}
        />
        <TextInput 
        style={styles.textInput}
        placeholder='Telephone'
        onChangeText={(telephone)=>setTelePhone(telephone)}
        autoCapitalize='none'
        autoCorrect={false}
        />
         <TextInput 
        style={styles.textInput}
        placeholder='Address'
        onChangeText={(address)=>setAddress(address)}
        autoCapitalize='none'
        autoCorrect={false}
        />
        </View>
        <TouchableOpacity
        onPress={() => regUser(email,password,firstName,lastName,telephone,address)}
        style = {styles.button}
        >
            <AntDesign name="login" style={{fontSize: 28,color:'#F8F0E5',marginRight:5}} />
            <Text style={{fontWeight: 'bold',fontSize: 26,color:'#F8F0E5'}}>Create Account</Text>
        </TouchableOpacity>
        
    </View>
    </ScrollView>
 )
}

export default Register

const styles = StyleSheet.create({
    container :{
        flex :1 ,
        alignItems:'center',
        padding:45,
        backgroundColor:"#F8F0E5",
    },
    textInput : {
        paddingTop : 20,
        paddingBottom:10,
        width:350,
        fontSize:20,
        borderWidth:1,
        borderRadius:20,
        borderColor:'#DAC0A3',
        color:'#0F2C59',
        marginBottom:10,
        textAlign:'center',
    },
    button:{
        marginTop:60,
        height:70,
        width:300,
        flexDirection:'row',
        backgroundColor:'#DAC0A3',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50

    }
})
