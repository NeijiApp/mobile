import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import NeijiLogoOnboarding2 from '../../components/NeijiLogoOnboarding2';
import { Ionicons } from '@expo/vector-icons'; // Pour le chevron


// Define the type for the navigation parameter
type RootStackParamList = {
    explore: undefined;
    onboarding4: undefined;
};

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [currentStep, setCurrentStep] = useState(2);

    const handleNextStep = () => {
        navigation.navigate('onboarding4');
    };


    // Charger le contenu SVG directement dans le code
    const svgXmlData = require('@/assets/images/neiji_logo.svg');

    return (
        <LinearGradient
            colors={['#FFD04F', '#FF9D2A']}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.greetingText}>Chez Neiji </Text>
                <Text style={styles.subText}>On te propose des outils pour travailler sur la gestion du stress, ton anxiété et ta concentration</Text>
                <NeijiLogoOnboarding2 />
                <View style={styles.footerContainer}>
                    {/* Button Passer */}
                    <TouchableOpacity onPress={() => navigation.navigate('explore')}>
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
        marginTop: 20,
        marginBottom: 20,
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
