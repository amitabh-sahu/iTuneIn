import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import colors from './app/misc/colors';

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.APP_BG
  }
};

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer theme={myTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}