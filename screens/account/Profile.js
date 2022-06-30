import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import { ListItem} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Profile = ({ navigation }) => {
  const { jwt, logout, userProfile } = useContext(AuthContext);

  const list = [
    {
      title: 'User Profile',
      icon: 'person',
    },
    {
      title: 'Your Address',
      icon: 'home',
    },
    {
      title: 'Purchases',
      icon: 'basket',
    },
    {
      title: 'Your E-Wallet',
      icon: 'wallet',
    },
    {
      title: 'Sign out',
      icon:'log-out',
    },
  ];

  const handleChange = (i) => {
    if (i==4) {
      userProfile.googleId && (
        GoogleSignin.revokeAccess()
      )
      createTwoButtonAlert('Sign Out', () => logout(jwt.refreshToken));
    }

    if (i==0) navigation.navigate('ChangeProfile');
    if (i==1) navigation.navigate('Address');
    if (i==2) navigation.navigate('Purchase');
    if (i==3) navigation.navigate('UserCoin');
  }

  return (
    <View style={styles.container}>
      {list.map((item, i) => (
        <ListItem key={i} bottomDivider onPress={()=>{handleChange(i)}}>
          <Icon style={styles.icon} name={item.icon} />
          <ListItem.Content>
            <ListItem.Title>{item.title}</ListItem.Title>
          </ListItem.Content>
        <ListItem.Chevron />
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      marginTop: 164,
  },
  icon: {
      fontSize: 20,
      marginRight: 3,
  },
});

export default Profile;