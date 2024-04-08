// หน้า login
import { View, Text,TouchableOpacity,TextInput,StyleSheet } from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import {firebase} from '../config';
import { AntDesign } from '@expo/vector-icons';


const Login = () => {
    const navigation = useNavigation()
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    loginUser = async (email,password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email,password)
        }catch (error){
            alert("Maybe your Email or Passwords is worng")
        }
        
    }

    // forget passwords
    const forgetPassword = () => {
        firebase.auth().sendPasswordResetEmail(email)
        .then(()=> {
            alert(error)
        }).catch((error) => {
            alert("Password reset email sent")
        })
    }
 return (
    <View style={styles.container}>
        <Text style={{marginRight: 8,fontWeight : 'bold',fontSize:50,fontStyle:'italic',color :'#DAC0A3'}}>
            StoreKeeper
        </Text>
        <View style={{marginTop:40}}>
        <TextInput 
        style={styles.textInput}
        placeholder='Email'
        onChangeText={(email)=>setEmail(email)}
        autoCapitalize='none'
        autoCorrect={false}
        />
        <TextInput 
        style={styles.textInput}
        placeholder='Passwords'
        onChangeText={(password)=>setPassword(password)}
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => forgetPassword()} style = {{marginTop:20}}>
            <Text style={{fontWeight: 'bold',fontSize: 16,  textAlign:'right', color:'#0F2C59'}}>
                Forget password?
                </Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => loginUser(email,password)} style = {styles.button}>   
            <AntDesign name="login" style={{fontSize: 28,color:'#F8F0E5',marginRight:5}} />
            <Text style={{fontWeight: 'bold',fontSize: 26,color:'#F8F0E5'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style = {{marginTop:40}}>
            <Text style={{fontSize: 16 ,textAlign:'center', color:'#DAC0A3'}}>
                Don't have an account?  
                <Text style={{fontWeight: 'bold',fontSize: 16, textAlign:'center', color:'#0F2C59'}}>
                    Register now
                </Text>
                </Text>
        </TouchableOpacity>
    </View>
 )
}

export default Login

const styles = StyleSheet.create({
    container :{
        flex :1 ,
        alignItems:'center',
        backgroundColor:"#F8F0E5",
        paddingTop:170
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
        marginBottom:15,
        textAlign:'center',
    },
    button:{
        marginTop:50,
        height:70,
        width:250,
        flexDirection:'row',
        backgroundColor:'#DAC0A3',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50
    }
})