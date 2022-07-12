import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import MainNavigation from './components/Navigation/StackNav';
import { AuthProvider } from './context/AuthContext';
import { VendorProvider } from './context/VendorContext';
import Colors from './themes/Colors';

LogBox.ignoreAllLogs();

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