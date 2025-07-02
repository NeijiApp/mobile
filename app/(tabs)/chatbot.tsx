import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { OPENAI_API_KEY } from '@env';

// Utilisation temporaire de la clé API (à remplacer par la variable d'environnement)
const OPENAI_API_KEY = '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';

const { height, width } = Dimensions.get('window');

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
  
  // Hook pour les zones sûres
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Message d'accueil élégant
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

  const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
      let currentIndex = 0;
      const timer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(timer);
        }
      }, 25);

      return () => clearInterval(timer);
    }, [text]);

    return <Text style={[styles.messageText, styles.botMessageText]}>{displayedText}</Text>;
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isBot = item.role === 'assistant';
    const isLast = index === messages.length - 1;
    
    return (
      <Animated.View 
        style={[
          styles.messageWrapper,
          isBot ? styles.botMessageWrapper : styles.userMessageWrapper,
          { opacity: fadeAnim }
        ]}
      >
        {isBot && (
          <View style={styles.botAvatarContainer}>
            <View style={styles.botAvatar}>
              <Image 
                source={require('../../assets/images/neiji_logo.svg')} 
                style={styles.botAvatarImage}
                resizeMode="contain"
              />
            </View>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isBot ? styles.botBubble : styles.userBubble
        ]}>
          {isBot && isLast && !isLoading ? (
            <TypewriterText text={item.content} />
          ) : (
            <Text style={[
              styles.messageText,
              isBot ? styles.botMessageText : styles.userMessageText
            ]}>{item.content}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  // Calcul dynamique de la position de la barre d'input
  const inputWrapperStyle = {
    ...styles.inputWrapper,
    bottom: Math.max(20, insets.bottom + 10), // Au moins 20px, ou insets.bottom + 10px
  };

  // Calcul dynamique du padding bottom pour les messages
  const messagesContainerStyle = {
    ...styles.messagesContainer,
    paddingBottom: Math.max(140, insets.bottom + 120), // Ajuste selon la zone sûre
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Arrière-plan dégradé orange pastel */}
      <LinearGradient
        colors={['#fff8f0', '#ffede0', '#ffe0cc']}
        style={styles.backgroundGradient}
      />

      {/* Header simple sans le point vert */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ff7043" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Neiji</Text>
          <Text style={styles.headerSubtitle}>Votre compagnon bien-être</Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages avec padding dynamique */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={messagesContainerStyle}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Indicateur de frappe */}
        {isLoading && (
          <View style={styles.typingContainer}>
            <View style={styles.typingBubble}>
              <View style={styles.typingDots}>
                <Animated.View style={[styles.typingDot, styles.dot1]} />
                <Animated.View style={[styles.typingDot, styles.dot2]} />
                <Animated.View style={[styles.typingDot, styles.dot3]} />
              </View>
            </View>
          </View>
        )}

        {/* Barre d'input avec position dynamique */}
        <View style={inputWrapperStyle}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 237, 224, 0.95)']}
            style={styles.inputGradient}
          >
            <View style={styles.inputContainer}>
              {/* Bouton User */}
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={['#ff7043', '#ff8a65']}
                  style={styles.actionButtonGradient}
                >
                  <Ionicons name="person" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>

              {/* Bouton Méditation */}
              <TouchableOpacity 
                onPress={() => setMeditationMode(!meditationMode)}
                style={styles.actionButton}
              >
                <LinearGradient
                  colors={meditationMode 
                    ? ['#ff7043', '#ff8a65'] 
                    : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 237, 224, 0.9)']
                  }
                  style={[styles.actionButtonGradient, styles.meditationButton]}
                >
                  <Ionicons 
                    name="flower" 
                    size={20} 
                    color={meditationMode ? "white" : "#ff7043"} 
                  />
                </LinearGradient>
                {meditationMode && (
                  <View style={styles.meditationIndicator}>
                    <View style={styles.meditationIndicatorInner} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Input réduit en hauteur */}
              <View style={styles.inputFieldContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={meditationMode ? "Describe your ideal meditation..." : "Ask me anything..."}
                  placeholderTextColor="rgba(255, 112, 67, 0.6)"
                  value={input}
                  onChangeText={setInput}
                  editable={!isLoading}
                  multiline={false}
                />
                
                {/* Bouton d'envoi intégré */}
                <TouchableOpacity 
                  onPress={sendMessage} 
                  style={[
                    styles.sendButtonIntegrated,
                    (!input.trim() || isLoading) && styles.sendButtonDisabled
                  ]}
                  disabled={!input.trim() || isLoading}
                >
                  <LinearGradient
                    colors={(!input.trim() || isLoading) 
                      ? ['rgba(255, 112, 67, 0.3)', 'rgba(255, 138, 101, 0.3)'] 
                      : ['#ff7043', '#ff8a65']
                    }
                    style={styles.sendButtonIntegratedGradient}
                  >
                    <Ionicons 
                      name={isLoading ? "hourglass" : (meditationMode ? "sparkles" : "send")} 
                      size={16} 
                      color="white" 
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
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
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ff7043',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#ff8a65',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    // paddingBottom sera défini dynamiquement
  },
  messageWrapper: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botAvatarContainer: {
    marginRight: 12,
    marginBottom: 4,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  botAvatarImage: {
    width: 28,
    height: 28,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 8,
  },
  userBubble: {
    backgroundColor: '#ff7043',
    borderBottomRightRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  botMessageText: {
    color: '#2d3748',
  },
  userMessageText: {
    color: 'white',
  },
  typingContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignSelf: 'flex-start',
    marginLeft: 48,
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff7043',
    marginHorizontal: 2,
  },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
  
  // Barre d'input avec position dynamique
  inputWrapper: {
    position: 'absolute',
    // bottom sera défini dynamiquement
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#ff7043',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGradient: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  actionButtonGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meditationButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 112, 67, 0.2)',
  },
  meditationIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#ff7043',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  meditationIndicatorInner: {
    width: 4,
    height: 4,
    backgroundColor: '#ff8a65',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 1,
  },
  inputFieldContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 112, 67, 0.2)',
    paddingHorizontal: 16,
    height: 48,
  },
  textInput: {
    flex: 1,
    color: '#2d3748',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 0,
  },
  sendButtonIntegrated: {
    borderRadius: 18,
    overflow: 'hidden',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonIntegratedGradient: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
