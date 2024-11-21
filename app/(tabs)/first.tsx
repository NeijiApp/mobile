import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import SvgComponent from '../../components/NeijiLogo';

// Define the type for the navigation parameter
type RootStackParamList = {
  explore: undefined;
  chatbot: undefined; // Nouvelle route pour le chatbot
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={['#FFD04F', '#FF9D2A']}
      style={styles.background}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Logo pour le chatbot */}
        <View style={styles.accountLevel}>
          <Text style={styles.accountLevelText}>105 xp</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('chatbot')}>
          <FontAwesome name="comments" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Niveau du compte */}
      </View>

      {/* Contenu principal */}
      <View style={styles.container}>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // Assure que le gradient prend toute la hauteur et largeur
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute', // Fixe le header en haut
    top: 50, // Ajustez selon vos besoins (garde de l'espace pour le SafeArea)
    left: 20,
    right: 20,
    flexDirection: 'row', // Organise les éléments horizontalement
    justifyContent: 'space-between', // Place les éléments aux extrémités
    alignItems: 'center',
  },
  accountLevel: {
    backgroundColor: '#393939', // Fond transparent
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  accountLevelText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
