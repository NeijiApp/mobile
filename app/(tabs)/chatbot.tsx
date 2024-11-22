import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Si tu veux un bouton avec FontAwesome

const OPENAI_API_KEY = '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'; // Remplace par ta clé API OpenAI
const API_URL = 'https://api.openai.com/v1/completions';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>('');
  const navigation = useNavigation();

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);
      setInput('');
  
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',  // Changement de l'URL
          {
            model: 'gpt-3.5-turbo', // Assurez-vous d'utiliser un modèle valide
            messages: [
              { role: 'system', content: 'Tu es Neiji, un mentor et guide bienveillant spécialisé en santé mentale pour les jeunes. Tu réponds avec chaleur, sagesse et une touche de narration immersive liée à ton lore. Utilise des réponses motivantes, engageantes et adaptées au public Gen-Z.' },
              ...newMessages.map((msg) => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text,
              })),
              { role: 'user', content: input }, // Assurez-vous que le message est correctement ajouté
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
          }
        );
  
        const botResponse = response.data.choices[0].message.content;
        setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
      } catch (error: any) {
        if (error.response) {
          console.error('Erreur API ChatGPT:', error.response.data); // Affiche les détails de l'erreur
        } else {
          console.error('Erreur de la requête:', error.message);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adapte le comportement selon le système d'exploitation
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Neiji Chat Bot</Text>
          </View>

          {/* Liste des messages */}
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.message,
                  item.sender === 'user' ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            contentContainerStyle={styles.messagesContainer}
          />

          {/* Champ de saisie et bouton */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tapez un message..."
              placeholderTextColor={'#888'}
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <FontAwesome name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9F38',
    padding: 40,
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1c4e9',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eeeeee',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#FF9F38',
    padding: 10,
    borderRadius: 20,
  },
});
