import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <StatusBar style="dark" />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Pound Drop</Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>Build Success Test</Text>
    </View>
  );
}
