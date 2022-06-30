import React, { useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { AuthContext } from '../../context/AuthContext';
import { VendorContext } from '../../context/VendorContext';
import { STATIC_URL } from '../../config';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';
import { createTwoButtonAlert } from '../Other/Confirm';

const placeholderImage = require('../../assets/images/placeholder.png');

const CustomDrawer = props => {
  const { userProfile } = useContext(AuthContext);
  const { storeProfile, vendorLogout } = useContext(VendorContext);

  const { navigation } = props;

  const handleBack = () => {
    navigation.navigate('HomeTabNav');
    vendorLogout();
  }

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.contentContainer}>
        <ImageBackground
          source={
            storeProfile.cover  
            ? { uri: STATIC_URL + storeProfile.cover }
            : placeholderImage
          }
          style={styles.cover}>
          <View style={styles.wrapper}>
            <Image
              source={
                storeProfile.avatar  
                ? { uri: STATIC_URL + storeProfile.avatar }
                : placeholderImage
              }
              style={styles.avatar}
            />

            <View style={styles.profile}>
              <Text
                style={[styles.name, styles.mr6]}
              >
                {storeProfile.name}
              </Text>
              <Text
                  style={{ color: storeProfile.isOpen ? Colors.fun : Colors.danger }}
              >
                {storeProfile.isOpen ? 'open' : 'closed'}
              </Text>
            </View>

            <View style={styles.profile}>
              <Text
                style={[{
                  color: storeProfile.ownerId && storeProfile.ownerId._id === userProfile._id ? Colors.fun : Colors.primary,
                  marginRight: 6,
                }, styles.mr6]}>
                {storeProfile.ownerId && storeProfile.ownerId._id === userProfile._id ? 'Owner' : 'Staff'}:
              </Text>
              <Text
                style={{ color: Colors.white }}>
                {userProfile.firstname + ' ' + userProfile.lastname}
              </Text>
            </View>
          </View>
        </ImageBackground>
        
        <View style={styles.itemList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.itemBottom}>
        <TouchableOpacity onPress={() => createTwoButtonAlert('Leave The Dashboard', handleBack)} style={styles.btn}>
          <View style={styles.profile}>
            <Icon name="exit" size={22} />
            
            <Text
              style={styles.textBtn}>
              Back to GoodDeal
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: Colors.primary,
  },
  cover: {
    resizeMode: 'cover',
    height: 160,
  },
  wrapper: {
    flex: 1,
    padding: 18,
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.shadow,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderColor: Colors.white,
    borderWidth: 3,
  },
  profile: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  name: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  mr6: {
    marginRight: 6,
  },
  itemList: {
    flex: 1, 
    backgroundColor: Colors.white, 
    paddingTop: 12,
  },
  itemBottom: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.muted,
  },
  btn: {
    paddingVertical: 12,
  },
  textBtn: {
    fontSize: 15,
    marginLeft: 6,
  },
});

export default CustomDrawer