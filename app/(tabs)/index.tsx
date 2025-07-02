import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NeijiLogoWithoutWord from '../../components/NeijiLogoWithoutWord';

const { height } = Dimensions.get('window');

// Define the type for the navigation parameter
type RootStackParamList = {
  onboarding1: undefined;
  audioplayer: undefined;
  login1: undefined;
  register: undefined;
  manga: undefined;
  first: undefined;
  chatbot: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />
              <LinearGradient
          colors={['#fff7ed', '#ffedd5', '#fed7aa']}
          style={styles.background}
        >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.logoContainer}>
            <NeijiLogoWithoutWord />
          </View>
          
          <Text style={styles.title}>
            Your AI Wellness{'\n'}Assistant
          </Text>
          
          <Text style={styles.subtitle}>
            Create personalized meditations through conversation
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('chatbot')}
              activeOpacity={0.8}
            >
                              <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  style={styles.buttonGradient}
                >
                <Text style={styles.buttonText}>Ask Neiji</Text>
                <Ionicons name="chatbubble" size={18} color="white" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {/* Navigate to login */}}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          
                     <View style={[styles.quickFeatures, { paddingBottom: Math.max(20, insets.bottom + 10) }]}>
             <View style={styles.feature}>
               <Ionicons name="musical-notes" size={20} color="#f97316" />
               <Text style={styles.featureText}>Custom Audio</Text>
             </View>
             <View style={styles.feature}>
               <Ionicons name="book" size={20} color="#f97316" />
               <Text style={styles.featureText}>Manga Stories</Text>
             </View>
             <View style={styles.feature}>
               <Ionicons name="trending-up" size={20} color="#f97316" />
               <Text style={styles.featureText}>Performance</Text>
             </View>
           </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 40,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 17,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 45,
    lineHeight: 26,
    paddingHorizontal: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    width: '90%',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 0,
    minHeight: 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  quickFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
