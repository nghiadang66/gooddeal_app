import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import MainNavigation from './components/Navigation/StackNav';
import { AuthProvider } from './context/AuthContext';
import { VendorProvider } from './context/VendorContext';
import Colors from './themes/Colors';

const App = () => {
  return (
    <AuthProvider>
      <VendorProvider>
        <StatusBar backgroundColor={Colors.primary} />
        <MainNavigation />
      </VendorProvider>
    </AuthProvider>
  );
}

export default App;