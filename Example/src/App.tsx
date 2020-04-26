import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import RNRestart from 'react-native-restart';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step One</Text>
      <Text style={styles.description}>
        To restart the app, press on this button:
      </Text>
      <TouchableOpacity onPress={() => RNRestart.Restart()}>
        <View style={styles.restartButton}>
          <Text>Restart</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  restartButton: {
    backgroundColor: '#7d7d7d',
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginTop: 10,
    borderRadius: 10,
  },
});
