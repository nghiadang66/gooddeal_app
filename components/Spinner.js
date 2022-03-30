import React from 'react';
import { ActivityIndicator } from 'react-native';
import Colors from '../themes/Colors';

const Spinner = ({ size="large", color=Colors.primary }) => (
    <ActivityIndicator size={size} color={color} />
);

export default Spinner;