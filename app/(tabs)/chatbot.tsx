import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Image,
  Pressable
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// Utilisation temporaire de la clé API
const OPENAI_API_KEY = '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';

const { height, width } = Dimensions.get('window');

// Calcul responsive selon les spécifications
const getMaxBubbleWidth = () => {
  if (width < 375) return width * 0.85; // Petit écran
  if (width <= 414) return width * 0.75; // Moyen
  return width * 0.70; // Grand écran
};

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

function ChatbotContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [meditationMode, setMeditationMode] = useState<boolean>(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Message d'accueil selon spécifications
    const welcomeMessage: Message = {
      id: '0',
      content: "Hey ! What is the one thing you want to improve in your life today ?",
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input.trim(),
        role: 'user',
        timestamp: new Date()
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { 
                role: 'system', 
                content: 'Tu es Neiji, un assistant bienveillant et sage spécialisé dans le bien-être mental. Réponds avec élégance, profondeur et empathie. Tes réponses doivent être inspirantes et apaisantes, avec un ton raffiné et accessible.' 
              },
              ...newMessages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              }))
            ],
            max_tokens: 500,
            temperature: 0.8,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.data.choices[0].message.content,
          role: 'assistant',
          timestamp: new Date()
        };

        setMessages([...newMessages, botMessage]);
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

      } catch (error: any) {
        console.error('Erreur API ChatGPT:', error.response?.data || error.message);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Je rencontre une difficulté technique. Pourriez-vous réessayer dans un moment ?",
          role: 'assistant',
          timestamp: new Date()
        };
        
        setMessages([...newMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Animation typewriter selon spécifications (15-20ms par caractère)
  const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.substring(0, index));
          setCurrentIndex(index);
          index++;
        } else {
          clearInterval(timer);
          setShowCursor(false);
        }
      }, 18); // 18ms par caractère (dans la fourchette 15-20ms)

      // Animation du curseur clignotant
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => {
        clearInterval(timer);
        clearInterval(cursorTimer);
      };
    }, [text]);

    return (
      <Text style={styles.botMessageText}>
        {displayedText}
        {showCursor && currentIndex <= text.length && (
          <Text style={styles.cursor}>|</Text>
        )}
      </Text>
    );
  };

  // Animation d'apparition selon spécifications (fade-in + slide-up)
  const MessageBubble = ({ item, index }: { item: Message; index: number }) => {
    const isBot = item.role === 'assistant';
    const isLast = index === messages.length - 1;
    const animValue = useRef(new Animated.Value(0)).current;
    const slideValue = useRef(new Animated.Value(10)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Animation d'apparition (fade-in + slide-up 300ms ease-out)
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

    // Animation au tap (scale 0.98)
    const handlePressIn = () => {
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 150,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View 
        style={[
          styles.messageContainer,
          isBot ? styles.botMessageContainer : styles.userMessageContainer,
          {
            opacity: animValue,
            transform: [
              { translateY: slideValue },
              { scale: scaleValue }
            ]
          }
        ]}
      >
        {/* Avatar Neiji selon spécifications (40x40px, 8px d'espacement) */}
        {isBot && (
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
        )}
        
        {/* Bulle avec spécifications exactes */}
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.messageBubble,
            isBot ? styles.botBubble : styles.userBubble,
            { maxWidth: getMaxBubbleWidth() }
          ]}
        >
          {isBot && isLast && !isLoading ? (
            <TypewriterText text={item.content} />
          ) : (
            <Text style={isBot ? styles.botMessageText : styles.userMessageText}>
              {item.content}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  // Calcul dynamique des positions
  const inputWrapperStyle = {
    ...styles.inputWrapper,
    bottom: Math.max(20, insets.bottom + 10),
  };

  const messagesContainerStyle = {
    ...styles.messagesContainer,
    paddingBottom: Math.max(120, insets.bottom + 100),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages avec recyclage optimisé */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <MessageBubble item={item} index={index} />}
          contentContainerStyle={messagesContainerStyle}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          removeClippedSubviews={true} // Performance pour longues conversations
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        {/* Indicateur de frappe avec animation */}
        {isLoading && (
          <Animated.View style={styles.typingContainer}>
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
          </Animated.View>
        )}

        {/* Barre du bas selon spécifications */}
        <View style={inputWrapperStyle}>
          <View style={styles.bottomBar}>
            {/* Bouton User (orange) */}
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.userButton}
            >
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>

            {/* Bouton Paramètres/Méditation */}
            <TouchableOpacity 
              onPress={() => setMeditationMode(!meditationMode)}
              style={[styles.settingsButton, meditationMode && styles.settingsButtonActive]}
            >
              <Ionicons 
                name="settings-outline" 
                size={24} 
                color={meditationMode ? "#FF7043" : "#666"} 
              />
            </TouchableOpacity>

            {/* Input avec bouton send intégré */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                editable={!isLoading}
                multiline={false}
              />
              
              <TouchableOpacity 
                onPress={sendMessage} 
                style={[
                  styles.sendButton,
                  (!input.trim() || isLoading) && styles.sendButtonDisabled
                ]}
                disabled={!input.trim() || isLoading}
              >
                <Ionicons 
                  name={isLoading ? "hourglass" : "send"} 
                  size={20} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function ChatbotScreen() {
  return (
    <SafeAreaProvider>
      <ChatbotContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0', // Beige chaud selon spécifications
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16, // 16px minimum du bord selon spécifications
    paddingTop: 60,
  },
  
  // Container des messages selon spécifications
  messageContainer: {
    marginBottom: 12, // 12px entre bulles
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  
  // Avatar section selon spécifications (40x40px, 8px espacement)
  avatarSection: {
    alignItems: 'center',
    marginHorizontal: 8, // 8px d'espacement
    marginBottom: 4,
  },
  avatarContainer: {
    width: 40, // 40x40px selon spécifications
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
    fontSize: 12, // 12px selon spécifications
    color: '#6B7280', // Gris moyen
    marginTop: 4,
    fontWeight: '500',
  },
  
  // Bulles selon spécifications exactes
  messageBubble: {
    paddingHorizontal: 12, // 12px horizontal selon spécifications
    paddingVertical: 8, // 8px vertical selon spécifications
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // offset Y: 2px selon spécifications
    shadowOpacity: 0.1, // rgba(0,0,0,0.1) selon spécifications
    shadowRadius: 4, // blur: 4px selon spécifications
    elevation: 3,
  },
  
  // Bulle Bot : Orange vif (#FF7043) avec coin bas-gauche carré
  botBubble: {
    backgroundColor: '#FF7043', // Couleur exacte selon spécifications
    borderRadius: 12, // 12px selon spécifications
    borderBottomLeftRadius: 0, // Coin bas-gauche carré selon spécifications
  },
  
  // Bulle User : Blanc avec coin bas-droit carré
  userBubble: {
    backgroundColor: '#FFFFFF', // Blanc selon spécifications
    borderRadius: 12, // 12px selon spécifications
    borderBottomRightRadius: 0, // Coin bas-droit carré selon spécifications
  },
  
  // Textes selon spécifications
  botMessageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: '#FFFFFF', // Blanc pur selon spécifications
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    color: '#374151', // Gris foncé selon spécifications
  },
  
  // Curseur typewriter
  cursor: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  
  // Indicateur de frappe selon spécifications
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
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
  
  // Barre du bas selon spécifications
  inputWrapper: {
    position: 'absolute',
    left: 16, // 16px minimum selon spécifications
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
  
  // Bouton User (orange)
  userButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7043', // Même couleur que les bulles
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Bouton Paramètres
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonActive: {
    backgroundColor: '#ffe6e0',
  },
  
  // Input container
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
});
