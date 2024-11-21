import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MangaImage from '../../components/MangaImage';

export default function ChapterScreen({ route }: any) {
  const { chapterNumber, title } = route.params;

  // Construire l'URL pour récupérer le bon chapitre
  const apiEndpoint = `https://api.example.com/manga/chapter/${chapterNumber}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <MangaImage apiEndpoint={apiEndpoint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});
