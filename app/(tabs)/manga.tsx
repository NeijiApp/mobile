import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import MangaImage from '../../components/MangaImage';

type RootStackParamList = {
  first: undefined;
};

export default function ChapterScreen({ route }: any) {
  // Construire l'URL pour récupérer le bon chapitre
  const apiEndpoint = `http://180.149.197.248:3000/uploads/1732262615479.png`;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  const handleSkip = () => {
    navigation.navigate('first');
    // Ajoutez ici la logique pour passer au chapitre suivant ou toute autre action
  };

  return (
    <View style={styles.container}>
      <MangaImage />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute', // Toujours visible en bas de l'écran
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }], // Centrer horizontalement
    backgroundColor: 'black', // Couleur de fond du bouton
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 100,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
