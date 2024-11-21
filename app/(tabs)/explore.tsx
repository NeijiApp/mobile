import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import NeijiLogoWithoutWord from '../../components/NeijiLogoWithoutWord';

// Define the type for the navigation parameter
type RootStackParamList = {
  explore: undefined;
  onboarding1: undefined;
  audioplayer: undefined;
  manga: undefined;
  first: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={['#FFD04F', '#FF9D2A']}
      style={styles.background}
    >
      <View style={styles.container}>
          <NeijiLogoWithoutWord />
        <Text style={styles.text}>
          Prendre soin de sa santé mentale n’a jamais été aussi simple.
        </Text>

        {/* Buttons in column */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonDark]} onPress={() => {
            navigation.navigate('first');
          }}>
            <Text style={[styles.buttonText, styles.buttonTextWhite ]}>Rejoins-nous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonWhite]} onPress={() => { /* Action pour "Je me connecte" */ }}>
            <Text style={[styles.buttonText, styles.buttonTextDark]}>Je me connecte</Text>
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
    padding: 20,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 24,
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonDark: {
    backgroundColor: '#393939',
  },
  buttonWhite: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextDark: {
    color: '#393939', // Couleur du texte pour le bouton "Je me connecte"
  },
  buttonTextWhite: {
    color: 'white', // Couleur du texte pour le bouton "Rejoins-nous"
  },
});
