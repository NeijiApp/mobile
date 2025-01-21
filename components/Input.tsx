import React from 'react';
import { TextInput, StyleSheet, TextInputProps, TextStyle } from 'react-native';

interface InputProps extends TextInputProps {
  width?: number | string;
  height?: number | string;
  opacity?: number;
  placeholderText?: string;
  placeholderTextSize?: number; // Nouvelle propriété pour la taille du texte du placeholder
}

const Input: React.FC<InputProps> = ({
  width = '100%',
  height = 40,
  opacity = 1,
  placeholderText = '',
  placeholderTextSize = 14, // Valeur par défaut de la taille du placeholder
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        { width, height, opacity, fontSize: placeholderTextSize } as TextStyle, // Ajout de la taille du texte
        style,
      ]}
      placeholder={placeholderText}
      placeholderTextColor="gray"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 12,
  },
});

export default Input;
