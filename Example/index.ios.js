/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import RNRestart from 'react-native-restart';

export default class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To restart the app, press on this button:
        </Text>
        <TouchableOpacity onPress={() => RNRestart.Restart()}>
          <View style={styles.restartButton}>
            <Text style={{color: '#fff'}}>Restart</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#7d7d7d',
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 10
  }
});

AppRegistry.registerComponent('Example', () => Example);
