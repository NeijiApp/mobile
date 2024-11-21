import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import NeijiLogoOnboarding3 from '../../components/NeijiLogoOnboarding3';

// Define the type for the navigation parameter
type RootStackParamList = {
  explore: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  type RootStackParamList = {
    explore: undefined; // Page sans paramètre
    manga: { id: number; title: string }; // Page avec paramètres
  };
  

  return (
    <LinearGradient
      colors={['#FFD04F', '#FF9D2A']}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('explore')}>
          <NeijiLogoOnboarding3 />
        </TouchableOpacity>
        <Text style={styles.title}>Mon histoire</Text>
        <Text style={styles.subtext}>
          Avant de commencer cette aventure, laisse-moi te raconter mon histoire ...
        </Text>

        {/* Boutons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>  navigation.navigate('manga', { id: 1, title: 'Chapitre 1' })}
          >
            <Text style={styles.buttonText}>C'est par ici</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 40,
    color: '#352E34',
    textAlign: 'center',
  },
  subtext: {
    marginTop: 10,
    fontSize: 24,
    color: '#352E34',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
  },
  button: {
    backgroundColor: '#393939',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
