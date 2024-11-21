import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';  // Importer les icônes

type RootStackParamList = {
  explore: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [circleAnimation] = useState(new Animated.Value(0)); // Animation pour le cercle
  const [isLiked, setIsLiked] = useState(false); // État pour savoir si l'icône est likée

  const startCircleAnimation = () => {
    Animated.loop(
      Animated.timing(circleAnimation, {
        toValue: 1,
        duration: 1000, // Durée de l'animation (1 seconde)
        useNativeDriver: true,
      })
    ).start();
  };

  const stopCircleAnimation = () => {
    circleAnimation.stopAnimation();
    circleAnimation.setValue(0); // Réinitialiser l'animation
  };

  // Fonction pour charger et jouer l'audio
  const playAudio = async () => {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      // Demander les permissions pour lire l'audio
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission non accordée pour la lecture audio');
        return;
      }

      // Charger et lire l'audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'http://180.149.197.248:3000/uploads/1732159251318.mp3' },
        { shouldPlay: true }
      );

      setSound(sound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'audio', error);
    }
  };

  // Fonction pour arrêter le son
  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Fonction pour gérer le clic sur l'icône "like"
  const handleLikePress = () => {
    setIsLiked(!isLiked); // Inverser l'état de l'icône likée
  };

  return (
    <LinearGradient colors={['#FFD04F', '#FF9D2A']} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Exercice de Méditation</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.centeredContent}>
            <Animated.View
              style={[ 
                styles.circle,
                {
                  transform: [
                    {
                      scale: circleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2], // Changer la taille du cercle
                      }),
                    },
                  ],
                },
              ]}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={isPlaying ? stopAudio : playAudio}
            >
              <Text style={styles.buttonText}>
                {isPlaying ? 'Stop Audio' : 'Play Audio'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer superposé */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleLikePress}>
            <FontAwesome
              name="heart"
              size={30}
              color={isLiked ? 'red' : '#FFF'} // Change la couleur en fonction de l'état
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    position: 'relative', // Nécessaire pour positionner le footer par rapport à ce conteneur
  },
  header: {
    width: '100%',
    padding: 50,
    alignItems: 'center',
  },
  headerText: {
    marginTop: 20,
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    position: 'relative', // Nécessaire pour superposer le footer
  },
  centeredContent: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 50,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    zIndex: 1, // S'assurer que le contenu principal est au-dessus du footer
  },
  button: {
    backgroundColor: '#FF9D2A',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute', // Positionner le footer par rapport à son parent
    bottom: 0, // Le placer en bas de l'écran
    width: '100%',
    padding: 20,
    height: 100,
    alignItems: 'center',
    zIndex: 3, // Le footer est au-dessous du contenu principal
    backgroundColor: '#FF9D2A',
    borderRadius: 30,
    justifyContent: 'center', // Centrer le contenu
  },
  footerText: {
    color: '#FFF',
    fontSize: 16,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF9D2A',
    marginBottom: 30, // Espacement entre le cercle et le bouton
  },
});
