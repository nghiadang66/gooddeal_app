import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import Button from '../components/Button/Button';


import { ListItem} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


const Profile = ({ navigation }) => {
    const { jwt, logout, userProfile } = useContext(AuthContext);
    const list = [
        {
          title: 'User Profile',
    icon: 'person-outline'
        },
        {
          title: 'Your address',
   icon:'location-outline'
        },
        {
            title: 'Log out',
     icon:'log-out-outline'
          },
          
      ]
      const handleChange=(i)=>{
          if(i==2)
          {
            userProfile.googleId &&(
              GoogleSignin.revokeAccess()
            )
            
            logout(jwt.refreshToken);   
            
          }
          if(i==0)
          {
            navigation.navigate('ChangeProfile');
          }
          if(i==1)
          {
            navigation.navigate('UserAddress');
          }
      }
    return (
        <View style={styles.container}>
             {
    list.map((item, i) => (
      <ListItem key={i} bottomDivider onPress={()=>{handleChange(i)}}>
        <Icon style={styles.icon} name={item.icon} />
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
        
      </ListItem>
    ))
  }
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    
        width:"100%"
    },
    icon: {
        fontSize: 20,
     
        marginRight: 3,
    },
});

export default Profile;