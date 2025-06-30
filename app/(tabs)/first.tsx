import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import TreeConnexion from '../../components/TreeConnexion'; // Import de votre logo

type RootStackParamList = {
    chatbot: undefined;
    manga: undefined;
    audioplayer: undefined;
};

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Liste des étapes du parcours utilisateur
    const steps = [
        { id: '1', title: 'Mon Histoire', completed: true },
        { id: '2', title: '1', completed: true },
        { id: '3', title: '2', completed: false },
        { id: '4', title: '3', completed: false },
    ];

    const handleStepPress = (stepId: string) => {
        if (stepId === '1') {
            navigation.navigate('manga');
        }
        if (stepId === '2') {
            navigation.navigate('audioplayer');
        }
    };

    return (
        <LinearGradient colors={['#FFD04F', '#FF9D2A']} style={styles.background}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.accountLevel}>
                    <Text style={styles.accountLevelText}>105 xp</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('chatbot')}>
                    <FontAwesome name="comments" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Contenu principal */}
            <View style={styles.container}>
                {/* Parcours avec les étapes */}
                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <View
                            key={step.id}
                            style={[
                                styles.stepContainer,
                                index % 2 === 0
                                    ? styles.centeredStep
                                    : index % 2 === 1
                                    ? styles.leftStep
                                    : styles.rightStep,
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    step.id === '1' ? styles.stepButtonMain : styles.stepButton, // Condition pour "Mon Histoire"
                                    step.completed ? styles.stepCompleted : styles.stepPending,
                                ]}
                                onPress={() => handleStepPress(step.id)}
                            >
                                <Text style={styles.stepText}>{step.title}</Text>
                            </TouchableOpacity>

                            {/* Lien entre les étapes */}
                            {index < steps.length - 1 && (
                                <View style={styles.connectorContainer}>
                                    <TreeConnexion
                                        style={[
                                            step.completed ? styles.TreeConnexion : styles.TreeConnexion,
                                        ]}
                                    />
                                    <TreeConnexion
                                        style={[
                                            step.completed ? styles.TreeConnexion : styles.TreeConnexion,
                                        ]}
                                    />
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountLevel: {
        backgroundColor: '#393939',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    accountLevelText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    stepsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    centeredStep: {
        alignItems: 'center',
    },
    leftStep: {
        alignItems: 'flex-start',
        marginLeft: 80, // Augmenté l'espace à gauche
    },
    rightStep: {
        alignItems: 'flex-end',
        marginRight: 80, // Augmenté l'espace à droite
    },
    stepButton: {
        backgroundColor: '#FF9F38',
        paddingVertical: 10,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 100, // Pour que les autres boutons soient ronds
        marginBottom: 10,
    },
    stepButtonMain: {
        backgroundColor: '#FF9F38',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15, // Plus petit rayon pour "Mon Histoire"
        marginBottom: 10,
    },
    stepText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stepCompleted: {
        backgroundColor: '#FDE6B1', // Vert pour les étapes complètes
    },
    stepPending: {
        backgroundColor: '#FF7043', // Orange pour les étapes à venir
    },
    connectorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    completedConnector: {
        backgroundColor: '#FDE6B1', // Vert pour le chemin des étapes complètes
    },
    pendingConnector: {
        backgroundColor: '#FF7043', // Orange pour le chemin des étapes à venir
    },
    TreeConnexion: {
        backgroundColor: 'transparent',
    },
});
