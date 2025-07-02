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
  Keyboard
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { API_CONFIG } from '../../config/api';

// Configuration API sécurisée
const OPENAI_API_KEY = API_CONFIG.OPENAI_API_KEY;

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
}

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
  } else {
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
            {message.content}
          </Text>
        </View>
      </Animated.View>
    );
  }
};

function ChatbotContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meditationMode, setMeditationMode] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Message d'accueil
    const welcomeMessage: Message = {
      id: '0',
      content: "Hey ! What is the one thing you want to improve in your life today ?",
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

  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input.trim(),
        role: 'user',
        timestamp: new Date()
      };

      // Marquer tous les messages précédents comme non-animés
      const updatedMessages = messages.map(msg => ({ ...msg, isAnimating: false }));
      const newMessages = [...updatedMessages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
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
          timestamp: new Date(),
          isAnimating: true // Seul le nouveau message s'anime
        };

        setMessages([...newMessages, botMessage]);
        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

      } catch (error: any) {
        console.error('Erreur API ChatGPT:', error.response?.data || error.message);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Je rencontre une difficulté technique. Pourriez-vous réessayer dans un moment ?",
          role: 'assistant',
          timestamp: new Date(),
          isAnimating: true
        };
        
        setMessages([...newMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

     // Calcul des positions
   const inputWrapperStyle = {
     ...styles.inputWrapper,
     bottom: keyboardHeight > 0 
       ? keyboardHeight + 60 // Ajustement final pour position parfaite
       : Math.max(20, insets.bottom + 10),
   };

     const messagesContainerStyle = {
     ...styles.messagesContainer,
     paddingBottom: keyboardHeight > 0 
       ? keyboardHeight + 180 // Ajusté pour la position finale
       : Math.max(120, insets.bottom + 100),
   };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.keyboardContainer}>
        {/* Messages avec ScrollView au lieu de FlatList */}
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
          
          {/* Indicateur de frappe intégré dans les messages */}
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

        {/* Barre du bas */}
        <View style={inputWrapperStyle}>
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.userButton}
            >
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>

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
      </View>
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
    backgroundColor: '#fff8f0',
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 60,
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
  userButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7043',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
