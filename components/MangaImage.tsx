import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width, // Prendre toute la largeur de l'écran
    resizeMode: 'contain', // Maintient les proportions de l'image
  },
});

const DisplayAnImage = () => {
  const [imageHeight, setImageHeight] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Calculer automatiquement la hauteur de l'image pour respecter ses proportions
    Image.getSize(
      'http://180.149.197.248:3000/uploads/1732159622840.png',
      (width, height) => {
        const calculatedHeight = (screenWidth / width) * height;
        setImageHeight(calculatedHeight);
      },
      () => console.error('Erreur de chargement de l\'image'),
    );
  }, [screenWidth]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Image
            style={[styles.image, {height: imageHeight}]}
            source={{
              uri: 'http://180.149.197.248:3000/uploads/1732159622840.png',
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DisplayAnImage;
