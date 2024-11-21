import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import NeijiLogoOnboarding1 from '../../components/NeijiLogoOnboarding1';
import { Ionicons } from '@expo/vector-icons'; // Pour le chevron

// Define the type for the navigation parameter
type RootStackParamList = {
    first: undefined;
    onboarding2: undefined;
};

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // State pour gérer l'étape de l'onboarding
    const [currentStep, setCurrentStep] = useState(1);

    // Fonction pour passer à l'étape suivante
    const handleNextStep = () => {
        navigation.navigate('onboarding2');
    };

    return (
        <LinearGradient
            colors={['#FFD04F', '#FF9D2A']}
            style={styles.background}
        >
            <View style={styles.container}>
                <NeijiLogoOnboarding1 />
                <Text style={styles.greetingText}>Salut à toi !</Text>
                <Text style={styles.subText}>Bien arrivé ?</Text>
                <Text style={styles.subText}>Laisse moi te guider pas à pas</Text>

                {/* Conteneur des éléments de navigation et des bullets */}
                <View style={styles.footerContainer}>
                    {/* Button Passer */}
                    <TouchableOpacity onPress={() => navigation.navigate('first')}>
                        <Text style={styles.buttonText}>Passer</Text>
                    </TouchableOpacity>

                    {/* Bullets pour les étapes d'onboarding */}
                    <View style={styles.bulletsContainer}>
                        <View style={[styles.bullet, currentStep >= 1 && styles.activeBullet]} />
                        <View style={[styles.bullet, currentStep >= 2 && styles.activeBullet]} />
                        <View style={[styles.bullet, currentStep >= 3 && styles.activeBullet]} />
                    </View>

                    {/* Chevron pour avancer à l'étape suivante */}
                    <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                        <Ionicons name="chevron-forward" size={30} color="#352E34" />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingText: {
        marginTop: 20,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#352E34',
        textAlign: 'center',
    },
    subText: {
        marginTop: 10,
        fontSize: 24,
        color: '#352E34',
        textAlign: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 0,
        marginBottom: 20,
    },
    bulletsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    bullet: {
        width: 10,
        height: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#D4D4D4',
    },
    activeBullet: {
        backgroundColor: '#393939',
    },
    skipButton: {
        backgroundColor: '#393939',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    nextButton: {
        backgroundColor: '#FF9D2A',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
