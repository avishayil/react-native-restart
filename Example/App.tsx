/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import RNRestart from 'react-native-restart';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundColor = isDarkMode ? '#1a1a1a' : '#f5f5f5';
  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const cardBackground = isDarkMode ? '#2d2d2d' : '#ffffff';

  // After a restart, surface the reason that was passed to it (persisted natively).
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    RNRestart.getReason()
      .then(setReason)
      .catch(() => setReason(null));
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: textColor}]}>
            React Native Restart
          </Text>
          <Text style={[styles.subtitle, {color: textColor}]}>
            Example App
          </Text>
        </View>

        <View style={[styles.card, {backgroundColor: cardBackground}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Test Restart Functionality
          </Text>
          <Text style={[styles.description, {color: textColor}]}>
            Press the button below to restart the React Native application.
            This will reload the JavaScript bundle and reinitialize the app.
          </Text>

          <TouchableOpacity
            testID="restart-button"
            accessibilityLabel="Restart App"
            style={styles.restartButton}
            onPress={() => RNRestart.restart('maestro-e2e')}>
            <Text style={styles.buttonText}>↻ Restart App</Text>
          </TouchableOpacity>

          <Text
            testID="restart-reason"
            style={[styles.infoText, {color: textColor}]}>
            Last restart reason: {reason ?? 'none'}
          </Text>
        </View>

        <View style={[styles.card, {backgroundColor: cardBackground}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Platform Info
          </Text>
          <Text style={[styles.infoText, {color: textColor}]}>
            OS: {Platform.OS}
          </Text>
          <Text style={[styles.infoText, {color: textColor}]}>
            Version: {Platform.Version}
          </Text>
        </View>

        <View style={[styles.card, {backgroundColor: cardBackground}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            About
          </Text>
          <Text style={[styles.description, {color: textColor}]}>
            This example app demonstrates the react-native-restart library
            which allows you to programmatically restart your React Native
            application.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    opacity: 0.7,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 4,
  },
  restartButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App;
