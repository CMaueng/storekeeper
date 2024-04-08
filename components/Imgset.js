import { View, StyleSheet, Image, Text } from 'react-native';
import React from 'react';


const ImageSet = () => {
  return (
      <View style={styles.container}>     
          <Image 
          style={styles.image} 
          source={require('../assets/Image/QR.jpg')} 
          /> 
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F8F0E5',
    alignItems: 'center',
    justifyContent: 'center',
    padding:10
  },
  image : {
    width : 300,
    height : 450,
  },
});

export default ImageSet