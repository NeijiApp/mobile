import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import SvgComponent from '../../components/NeijiLogo';

// Define the type for the navigation parameter
type RootStackParamList = {
  explore: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Charger le contenu SVG directement dans le code
  const svgXmlData = require('@/assets/images/neiji_logo.svg');

  return (
    <LinearGradient
      colors={['#FFD04F', '#FF9D2A']}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('explore')}>
          <SvgComponent />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1, // Assure que le gradient prend toute la hauteur et largeur
    justifyContent: 'center', // Centrer le contenu
    alignItems: 'center',
  },
});
