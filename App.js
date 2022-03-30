import React from 'react';
import { StatusBar } from 'react-native';
// import 'react-native-gesture-handler';
import MainNavigation from './components/StackNav';
import { AuthProvider } from './context/AuthContext';
import Colors from './themes/Colors';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={Colors.primary} />
      <MainNavigation />
    </AuthProvider>
  );
}

export default App;