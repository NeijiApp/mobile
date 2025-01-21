import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import NeijiLogoWithoutWord from "../../components/NeijiLogoWithoutWord";
import Input from "../../components/Input";

// Define the type for the navigation parameter
type RootStackParamList = {
  explore: undefined;
  onboarding1: undefined;
  audioplayer: undefined;
  manga: undefined;
  first: undefined;
  login1: undefined;
};

export default function Register() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <LinearGradient colors={["#FFD04F", "#FF9D2A"]} style={styles.background}>
      <View style={styles.container}>
        <NeijiLogoWithoutWord width={150} height={111} />
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.text}>Connectez-vous pour continuer</Text>
        <View style={styles.InputContainer}>
          <Input
            width={348}
            height={60}
            opacity={0.4}
            placeholderTextSize={18}
            placeholderText="Nom d'utilisateur"
          />
          <Input
            width={348}
            height={60}
            opacity={0.4}
            placeholderTextSize={18}
            placeholderText="Adresse email"
          />
          <Input
            width={348}
            height={60}
            placeholderTextSize={18}
            opacity={0.4}
            placeholderText="Mot de passe"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, styles.buttonFull]}
          onPress={() => {
            navigation.navigate("onboarding1");
          }}
        >
        <Text style={[styles.buttonText, styles.buttonText]}>S'inscrire</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Connectez-vous pour continuer</Text>
        <TouchableOpacity
          style={[styles.button, styles.buttonEmpty]}
          onPress={() => {
            navigation.navigate("login1");
          }}
        >
          <Text style={[styles.buttonText, styles.buttonTextEmpty]}>
            Se connecter
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 50,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "black",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  InputContainer: {
    marginTop: 30,
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 100,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
    width: 348,
    height: 55,
    alignItems: "center",
  },
  buttonFull: {
    backgroundColor: "rgba(255, 133, 4, 0.75)",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    justifyContent: "center",
  },
  buttonEmpty: {
    backgroundColor: "rgba(255, 133, 4, 0)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 0, 1)",
  },
  buttonTextEmpty: {
    fontSize: 18,
    fontWeight: "light",
  },
});
