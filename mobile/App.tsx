import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SimulationScreen } from './src/screens/SimulationScreen';
import { AIScenario } from './src/types/simulation';
import { UserProfile } from './src/types/auth';
import { getCurrentUser, logoutUser } from './src/services/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuth, setShowAuth] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<AIScenario | null>(null);
  const [language, setLanguage] = useState<string>('uz');
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Check initial user
    getCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        setShowAuth(false);
      }
      setInitializing(false);
    });
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleSkipGuest = () => {
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setShowAuth(true);
  };

  const handleStartSimulation = (scenario: AIScenario, selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setActiveScenario(scenario);
  };

  const handleExitSimulation = () => {
    setActiveScenario(null);
  };

  if (initializing) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        {showAuth && !currentUser ? (
          <AuthScreen
            onAuthSuccess={handleAuthSuccess}
            onSkipGuest={handleSkipGuest}
          />
        ) : activeScenario ? (
          <SimulationScreen
            scenario={activeScenario}
            language={language}
            onExit={handleExitSimulation}
          />
        ) : (
          <HomeScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuth={() => setShowAuth(true)}
            onStartSimulation={handleStartSimulation}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
