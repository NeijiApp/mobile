import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  Pressable,
  Keyboard,
  Alert,
  Vibration
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

const { height, width } = Dimensions.get('window');

// Calcul responsive selon les spécifications
const getMaxBubbleWidth = () => {
  if (width < 375) return width * 0.85;
  if (width <= 414) return width * 0.75;
  return width * 0.70;
};

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isAnimating?: boolean;
  isPassword?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong';
  score: number;
  color: string;
  label: string;
}

// Validation Email
const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "Hmm, vous avez oublié de taper votre email !" };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: "Cet email est un peu trop long. Pouvez-vous vérifier ?" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Hmm, cet email ne semble pas valide. Pouvez-vous le retaper ? (exemple: nom@exemple.com)" };
  }
  
  return { isValid: true };
};

// Validation Mot de Passe
const validatePassword = (password: string): ValidationResult => {
  if (password.length < 8) {
    return { 
      isValid: false, 
      error: "Ce mot de passe est trop court. Il doit contenir au moins 8 caractères. Essayez encore !" 
    };
  }
  
  if (password.length > 128) {
    return { 
      isValid: false, 
      error: "Ce mot de passe est trop long. Gardez-le sous 128 caractères !" 
    };
  }
  
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>_+=~`[\]\\';/-]/.test(password);
  
  if (!hasLetters && !hasNumbers) {
    return { 
      isValid: false, 
      error: "Votre mot de passe doit contenir à la fois des lettres et des chiffres pour plus de sécurité. Réessayez !" 
    };
  }
  
  if (!hasLetters) {
    return { 
      isValid: false, 
      error: "Votre mot de passe doit contenir au moins une lettre. Ajoutez quelques lettres !" 
    };
  }
  
  if (!hasNumbers) {
    return { 
      isValid: false, 
      error: "Votre mot de passe doit contenir au moins un chiffre. Ajoutez un ou plusieurs chiffres !" 
    };
  }
  
  return { isValid: true };
};

// Calcul de Force du Mot de Passe
const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  
  // Chaque critère ajoute exactement 1 point
  if (/[a-z]/.test(password)) score += 1;        // Minuscule
  if (/[A-Z]/.test(password)) score += 1;        // Majuscule
  if (/\d/.test(password)) score += 1;           // Chiffre
  if (/[!@#$%^&*(),.?":{}|<>_+=~`[\]\\';/-]/.test(password)) score += 1; // Caractère spécial uniquement
  if (password.length >= 8) score += 1;          // Longueur >= 8
  
  // Déterminer le niveau basé sur le score
  if (score >= 5) {
    return { level: 'strong', score, color: '#10B981', label: 'Fort' };
  } else if (score >= 3) {
    return { level: 'medium', score, color: '#F97316', label: 'Moyen' };
  } else {
    return { level: 'weak', score, color: '#DC2626', label: 'Faible' };
  }
};

// Composant TypewriterText COMPLÈTEMENT ISOLÉ
const TypewriterMessage = ({ message }: { message: Message }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<any>(null);
  const cursorRef = useRef<any>(null);

  useEffect(() => {
    if (!message.isAnimating) {
      setDisplayText(message.content);
      setShowCursor(false);
      setIsComplete(true);
      return;
    }

    let index = 0;
    setDisplayText('');
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      if (index <= message.content.length) {
        setDisplayText(message.content.substring(0, index));
        index++;
      } else {
        clearInterval(intervalRef.current);
        clearInterval(cursorRef.current);
        setShowCursor(false);
        setIsComplete(true);
      }
    }, 18);

    cursorRef.current = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cursorRef.current) clearInterval(cursorRef.current);
    };
  }, [message.id, message.content, message.isAnimating]);

  return (
    <Text style={styles.botMessageText}>
      {displayText}
      {showCursor && !isComplete && message.isAnimating && (
        <Text style={styles.cursor}>|</Text>
      )}
    </Text>
  );
};

// Composant Message STABLE
const MessageItem = ({ message, isLast }: { message: Message; isLast: boolean }) => {
  const isBot = message.role === 'assistant';
  const animValue = useRef(new Animated.Value(0)).current;
  const slideValue = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (isBot) {
    return (
      <Animated.View 
        style={[
          styles.messageContainer,
          styles.botMessageContainer,
          {
            opacity: animValue,
            transform: [{ translateY: slideValue }]
          }
        ]}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../../utils/picture/NeijiHeadLogo1.4.png')} 
              style={styles.neijiAvatar}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.neijiName}>Neiji</Text>
        </View>
        
        <View style={[
          styles.messageBubble,
          styles.botBubble,
          { maxWidth: getMaxBubbleWidth() }
        ]}>
          <TypewriterMessage message={message} />
        </View>
      </Animated.View>
    );
  }

  // Message utilisateur - structure différente pour coller à droite
  return (
    <Animated.View 
      style={[
        styles.userMessageWrapper,
        {
          opacity: animValue,
          transform: [{ translateY: slideValue }]
        }
      ]}
    >
      <View style={[
        styles.messageBubble,
        styles.userBubble,
        { maxWidth: getMaxBubbleWidth() }
      ]}>
        <Text style={styles.userMessageText}>
          {message.isPassword ? '••••••••' : message.content}
        </Text>
      </View>
    </Animated.View>
  );
};

function AuthContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [authStep, setAuthStep] = useState<'welcome' | 'email' | 'password' | 'register' | 'success'>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isPasswordField, setIsPasswordField] = useState(false);
  const [inputValidation, setInputValidation] = useState<ValidationResult>({ isValid: true });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Message d'accueil d'authentification
    const welcomeMessage: Message = {
      id: '0',
      content: "Bonjour ! Pour accéder à toutes les fonctionnalités de Neiji, j'ai besoin de vous authentifier. Commençons par votre adresse email.",
      role: 'assistant',
      timestamp: new Date(),
      isAnimating: true
    };
    setMessages([welcomeMessage]);

    // Gestion du clavier
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    
    // Seulement l'indicateur de force pour les mots de passe (pas de validation bloquante)
    if (isPasswordField && text.length > 0) {
      const strength = getPasswordStrength(text);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
    
    // Réinitialiser la validation (pas de validation en temps réel)
    setInputValidation({ isValid: true });
  };

  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input.trim(),
        role: 'user',
        timestamp: new Date(),
        isPassword: isPasswordField
      };

      // Marquer tous les messages précédents comme non-animés
      const updatedMessages = messages.map(msg => ({ ...msg, isAnimating: false }));
      const newMessages = [...updatedMessages, userMessage];
      setMessages(newMessages);
      const currentInput = input.trim();
      setInput('');
      setIsLoading(true);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Simuler le processus d'authentification
      setTimeout(async () => {
        let botResponse = '';
        let nextStep = authStep;

        switch (authStep) {
          case 'welcome':
            const emailValidation = validateEmail(currentInput);
            if (emailValidation.isValid) {
              setUserEmail(currentInput);
              botResponse = `Parfait ! Cet email me va très bien. Maintenant, veuillez saisir votre mot de passe pour ${currentInput}.`;
              nextStep = 'password';
              setIsPasswordField(true);
            } else {
              botResponse = emailValidation.error || "Veuillez saisir une adresse email valide.";
            }
            break;
          
          case 'password':
            // Validation du mot de passe
            const passwordValidation = validatePassword(currentInput);
            if (passwordValidation.isValid) {
              try {
                const success = await login(userEmail, currentInput);
                if (success) {
                  const strength = getPasswordStrength(currentInput);
                  const strengthMessage = strength.level === 'strong' 
                    ? 'Excellent choix ! Ce mot de passe est très sécurisé.'
                    : strength.level === 'medium' 
                    ? 'C\'est bien ! Votre mot de passe est suffisamment sécurisé.'
                    : '';
                  
                  botResponse = `Excellent ! Connexion réussie. ${strengthMessage} Bienvenue dans votre espace personnel, ${userEmail}. Vous pouvez maintenant accéder à toutes les fonctionnalités premium.`;
                  nextStep = 'success';
                  setIsPasswordField(false);
                } else {
                  botResponse = "Email ou mot de passe incorrect. Veuillez réessayer.";
                }
              } catch (error) {
                botResponse = "Erreur de connexion. Veuillez réessayer.";
              }
            } else {
              botResponse = passwordValidation.error || "Le mot de passe ne respecte pas les critères de sécurité.";
            }
            break;
          
          case 'success':
            botResponse = "Vous êtes maintenant connecté ! Vous pouvez retourner au chat principal pour profiter de toutes les fonctionnalités.";
            break;
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          role: 'assistant',
          timestamp: new Date(),
          isAnimating: true
        };

        setMessages([...newMessages, botMessage]);
        setAuthStep(nextStep);
        setIsLoading(false);
        
        // Réinitialiser les validations
        setInputValidation({ isValid: true });
        setPasswordStrength(null);
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Si connexion réussie, retourner au chat après 3 secondes
        if (nextStep === 'success') {
          setTimeout(() => {
            navigation.goBack();
          }, 3000);
        }
      }, 1500);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Calcul des positions
  const inputWrapperStyle = {
    ...styles.inputWrapper,
    bottom: keyboardHeight > 0 
      ? keyboardHeight + 60
      : Math.max(20, insets.bottom + 10),
  };

  const messagesContainerStyle = {
    ...styles.messagesContainer,
    paddingBottom: keyboardHeight > 0 
      ? keyboardHeight + 180
      : Math.max(120, insets.bottom + 100),
  };

  return (
    <LinearGradient 
      colors={['#FFFFFF', '#FFEDD5', '#FED7AA']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Titre optionnel */}
      <View style={[styles.headerTitle, { top: Math.max(50, insets.top + 20) }]}>
        <Text style={styles.titleText}>Connexion</Text>
      </View>

      <View style={styles.keyboardContainer}>
        {/* Messages avec ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={messagesContainerStyle}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isLast={index === messages.length - 1}
            />
          ))}
          
          {/* Indicateur de frappe */}
          {isLoading && (
            <View style={styles.messageContainer}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={require('../../utils/picture/NeijiHeadLogo1.4.png')} 
                    style={styles.neijiAvatar}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.neijiName}>Neiji</Text>
              </View>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <Animated.View style={[styles.typingDot, styles.dot1]} />
                  <Animated.View style={[styles.typingDot, styles.dot2]} />
                  <Animated.View style={[styles.typingDot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Barre du bas modifiée */}
        <View style={inputWrapperStyle}>
          <View style={styles.bottomBar}>
            {/* Bouton retour au lieu du toggle méditation */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Input container */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={isPasswordField ? "Mot de passe..." : "Votre réponse..."}
                placeholderTextColor="#999"
                value={input}
                onChangeText={handleInputChange}
                secureTextEntry={isPasswordField && !showPassword}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              
              {/* Bouton œil pour les mots de passe */}
              {isPasswordField && (
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Indicateur de force du mot de passe */}
            {isPasswordField && passwordStrength && input.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <View
                      key={dot}
                      style={[
                        styles.strengthDot,
                        dot <= passwordStrength.score && {
                          backgroundColor: passwordStrength.color
                        }
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                  Force: {passwordStrength.label}
                </Text>
              </View>
            )}



            {/* Bouton envoi */}
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                (!input.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

export default function AuthScreen() {
  return (
    <SafeAreaProvider>
      <AuthContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerTitle: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  messagesContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 80,
  },
  
  // Container des messages
  messageContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  
  // Wrapper spécial pour messages user collés à droite
  userMessageWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  
  // Avatar section
  avatarSection: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  neijiAvatar: {
    width: 36,
    height: 36,
  },
  neijiName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  
  // Bulles
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botBubble: {
    backgroundColor: '#FF7043',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderBottomRightRadius: 0,
  },
  
  // Textes
  botMessageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: '#FFFFFF',
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: '#374151',
  },
  
  // Curseur
  cursor: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  
  // Indicateur de frappe
  typingBubble: {
    backgroundColor: '#FF7043',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginHorizontal: 2,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
  
  // Barre du bas
  inputWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7043',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF7043',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  
  // Styles de validation
  textInputError: {
    borderColor: '#DC2626',
    borderWidth: 1,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  passwordStrengthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginRight: 4,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  validationErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  validationErrorText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
}); 