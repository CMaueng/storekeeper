import { View, Text ,SafeAreaView, StyleSheet, TouchableOpacity,Alert,Image} from 'react-native'
import React, {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import { firebase } from '../config';
import * as FileSystem from 'expo-file-system';

const Upload = () => {
    const [image,setImage] = useState(null);
    const [uploading,setUploading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes : ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality:1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    };
    const uploadMedia = async() => {
        setUploading(true);
    try {
        const { uri } = await FileSystem.getInfoAsync(image);
        const blob = await new Promise((resolve,reject)=>{
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET',uri,true);
            xhr.send(null);
        });
        const filename = image.substring(image.lastIndexOf('/')+1);
        const ref = firebase.storage().ref().child(filename);

        await ref.put(blob);
        setUploading(false);
        Alert.alert('Photo Uploaded!!');
        setImage(null);
    }catch (error) {
        console.error(error);
        setUploading(false);
    }
}

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity> 
        <View style={styles.imageContainer}>
        {image && <Image
            source = {{uri : image}}
            style = {{width: 300, height: 300}}
        />}
            <TouchableOpacity style={styles.selectButton} onPress={uploadMedia}>
        <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity> 
        </View>
    </SafeAreaView>
  )
}

export default Upload

const styles = StyleSheet.create({
    container : { 
        flex : 1,
        backgroundColor: '#F8F0E5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectButton: {
        borderRadius: 5,
        width: 150,
        height: 150,
        backgroundColor: '#DAC0A3',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText :{
        color: '#F8F0E5',
        fontSize: 18,
        fontWeight: 'bold',
    },
    uploadButton : {
        borderRadius: 5,
        width : 150,
        height: 50,
        backgroundColor: ' red',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    imageContainer: {
        marginTop : 30,
        marginBottom: 50,
        alignItems: 'center'
    }
});