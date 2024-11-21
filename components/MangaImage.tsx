import React, { useEffect, useState } from 'react';
import { ScrollView, Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface MangaImageProps {
  apiEndpoint: string; // L'endpoint spécifique pour récupérer l'image
}

const MangaImage: React.FC<MangaImageProps> = ({ apiEndpoint }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setImageUri(response.data.image); // Assumes the API returns an object with an `image` URL
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [apiEndpoint]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFD04F" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 9 / 16, // Ajuste selon tes images
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default MangaImage;
