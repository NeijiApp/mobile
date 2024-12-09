import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';  // Importer les icônes
import Slider from '@react-native-community/slider';  // Importer Slider de la bibliothèque
import NeijiLogoWithoutWord from '../../components/NeijiLogoWithoutWord';


type RootStackParamList = {
  explore: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [circleAnimation] = useState(new Animated.Value(1)); // Valeur initiale de l'échelle
  const [isLiked, setIsLiked] = useState(false); // État pour savoir si l'icône est likée
  const [audioDuration, setAudioDuration] = useState(0); // Durée totale de l'audio
  const [audioPosition, setAudioPosition] = useState(0); // Position actuelle de la lecture

  // Démarre l'animation de respiration
  const startCircleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(circleAnimation, {
          toValue: 1.2, // Agrandissement
          duration: 1500, // Durée pour atteindre la taille maximale
          useNativeDriver: true,
        }),
        Animated.timing(circleAnimation, {
          toValue: 1, // Rétrogradation
          duration: 1500, // Durée pour revenir à la taille initiale
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    // Cette fonction sera appelée lorsque le composant sera démonté
    return () => {
      if (sound) {
        sound.pauseAsync(); // Met en pause l'audio
        sound.unloadAsync(); // Décharge le son pour libérer la mémoire
      }
    };
  }, [sound]);

  const stopCircleAnimation = () => {
    circleAnimation.stopAnimation();
    circleAnimation.setValue(1); // Réinitialiser à la taille initiale
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
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.durationMillis !== undefined) {
              setAudioDuration(status.durationMillis / 1000); // Durée totale de l'audio en secondes
            }
            if (status.positionMillis !== undefined) {
              setAudioPosition(status.positionMillis / 1000); // Position actuelle en secondes
            }
          }
        }
      );

      setSound(sound);
      setIsPlaying(true);

      // Démarrer l'animation quand l'audio commence à jouer
      startCircleAnimation();
    } catch (error) {
      console.error('Erreur lors de la lecture de l\'audio', error);
    }
  };

  // Fonction pour arrêter le son
  const stopAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      stopCircleAnimation(); // Arrêter l'animation lorsque l'audio s'arrête
    }
  };

  // Fonction pour gérer le clic sur l'icône "like"
  const handleLikePress = () => {
    setIsLiked(!isLiked); // Inverser l'état de l'icône likée
  };

  // Fonction pour gérer la progression du slider
  const handleSliderChange = (value: number) => {
    if (sound) {
      sound.setPositionAsync(value * 1000); // Convertir la valeur du slider en millisecondes
      setAudioPosition(value); // Mettre à jour la position du slider
    }
  };

  return (
    <LinearGradient colors={['#FFD04F', '#FF9D2A']} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.chevron}>
            <FontAwesome name="chevron-left" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Exercice de Méditation</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.centeredContent}>
            <NeijiLogoWithoutWord />

            {/* <Animated.View
              style={[
                styles.circle,
                {
                  transform: [
                    {
                      scale: circleAnimation, // Utilise l'animation continue pour le cercle
                    },
                  ],
                },
              ]}
            /> */}
            <TouchableOpacity
              style={styles.button}
              onPress={isPlaying ? stopAudio : playAudio}
            >
              <FontAwesome
                name={isPlaying ? 'stop' : 'play'}
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>

            {/* Slider pour la durée de l'audio */}
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={audioDuration}
              value={audioPosition}
              onValueChange={handleSliderChange}
              thumbTintColor="#FF9D2A"
              minimumTrackTintColor="#FF9D2A"
              maximumTrackTintColor="gray"
            />
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
    // center text and icon in a row
  },
  chevron: {
    position: 'absolute',
    left: 20,
    top: 57, // Ajuster en fonction de la taille du header
    padding: 10,
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
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    zIndex: 1, // S'assurer que le contenu principal est au-dessus du footer
  },
  button: {
    backgroundColor: 'black',
    padding: 25,
    borderRadius: 100,
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
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#FF9D2A',
    marginBottom: 40,
  },
  slider: {
    width: '80%',
    marginTop: 20,
  },
});