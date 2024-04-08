import { View, Text, StyleSheet,TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import FetchData from '../components/FetchData';

export default function Home(){
    return(
    <View style={styles.container}>
        <FetchData/>   
    </View>
    );
}

const styles =StyleSheet.create({
    container :{
        flex :1 ,
        alignItems:'center',
        backgroundColor:"#F8F0E5"
    },
})