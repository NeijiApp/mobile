import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text, 
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import NeijiLogoWithoutWord from '../../components/NeijiLogoWithoutWord';

const { width, height } = Dimensions.get('window');

// Define the type for the navigation parameter
type RootStackParamList = {
  onboarding1: undefined;
  audioplayer: undefined;
  login1: undefined;
  register: undefined;
  manga: undefined;
  first: undefined;
};

const FeatureCard = ({ icon, title, description, delay }: {
  icon: string;
  title: string;
  description: string;
  delay: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.featureCard,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={24} color="#FF9D2A" />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

export default function ProLandingScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const features = [
    {
      icon: 'chatbubble-ellipses-outline',
      title: 'AI Assistant',
      description: 'Chat with Neiji to create personalized experiences'
    },
    {
      icon: 'musical-notes-outline',
      title: 'Custom Audio Meditations',
      description: 'AI-generated meditations tailored to your needs'
    },
    {
      icon: 'book-outline',
      title: 'Incredible Manga',
      description: 'Discover an amazing manga story'
    },
    {
      icon: 'trending-up-outline',
      title: 'Wellness & Performance',
      description: 'Boost your wellbeing and performance'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FFD04F" />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#FFD04F', '#FF9D2A', '#FF6B35']}
          style={styles.heroSection}
        >
          <Animated.View style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            <View style={styles.logoContainer}>
              <NeijiLogoWithoutWord />
            </View>
            <Text style={styles.heroTitle}>
              Your Personal AI{'\n'}Wellness Assistant
            </Text>
            <Text style={styles.heroSubtitle}>
              Create custom audio meditations, discover incredible manga, and boost your performance
            </Text>
            
            <View style={styles.ctaContainer}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('login1')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#2C2C2C', '#1A1A1A']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>Ask Neiji Pro</Text>
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
          </Animated.View>
        </LinearGradient>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What Makes Neiji Pro Special?</Text>
          <Text style={styles.sectionSubtitle}>
            AI-powered personalization for your wellness journey
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 150}
              />
            ))}
          </View>
        </View>

        <View style={styles.highlightSection}>
          <LinearGradient
            colors={['#FFF7ED', '#FFFFFF']}
            style={styles.highlightContainer}
          >
            <View style={styles.highlightIcon}>
              <Ionicons name="sparkles" size={32} color="#FF9D2A" />
            </View>
            <Text style={styles.highlightTitle}>Ultra Personalized</Text>
            <Text style={styles.highlightDescription}>
              Every meditation is created just for you based on your conversation with Neiji. 
              No generic content - everything is tailored to your specific needs and goals.
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Powered by AI Innovation</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>∞</Text>
                <Text style={styles.statLabel}>Possibilities</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>100%</Text>
                <Text style={styles.statLabel}>Custom</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomCTA}>
          <Text style={styles.bottomCTATitle}>Ready to Ask Neiji Pro?</Text>
          <Text style={styles.bottomCTASubtitle}>
            Start your personalized wellness journey today
          </Text>
          <TouchableOpacity 
            style={styles.bottomCTAButton}
            onPress={() => navigation.navigate('register')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF9D2A', '#FF6B35']}
              style={styles.buttonGradient}
            >
              <Text style={styles.bottomCTAButtonText}>Upgrade to Pro</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    minHeight: height * 0.70,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 5,
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
    width: '90%',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 52,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
  buttonIcon: {
    marginLeft: 6,
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    minHeight: 44,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#FAFBFC',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  highlightSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  highlightContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  highlightIcon: {
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  highlightDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  statsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF9D2A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  bottomCTA: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  bottomCTATitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  bottomCTASubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  bottomCTAButton: {
    width: '90%',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  bottomCTAButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
}); 