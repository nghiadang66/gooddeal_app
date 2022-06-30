import React, { useContext, useState } from 'react';
import { View, ScrollView,Text, StyleSheet, Alert,TouchableWithoutFeedback } from 'react-native';
import Colors from '../themes/Colors';
import Input from '../components/Form/Input';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { ListItem } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay';
import { FAB, Dialog, Button,Card,Image,BottomSheet } from 'react-native-elements';
import InputSpinner from "react-native-input-spinner";
import { TurboModuleRegistry } from 'react-native';

const UserAddress = ({ navigation }) => {
  const { jwt, userProfile, deleteAddress,isLoading } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [deleteAdd, setDeleteAdd] = useState({});

  const [isConfirming, setIsConfirming] = useState(false);
  const showDialog = () => setVisible(true);

  const address = userProfile.addresses
  const openDialog = () => {

    <Dialog

    >
      <Dialog.Title title="Dialog Title" />
      <Text>Dialog body text. Add relevant information here.</Text>
      <Dialog.Actions>
        <Dialog.Button title="ACTION 1" onPress={() => console.log('Primary Action Clicked!')} />
        <Dialog.Button title="ACTION 2" onPress={() => console.log('Secondary Action Clicked!')} />
      </Dialog.Actions>
    </Dialog>

  }
  const handleDeleteAddress = (item, i) => {
    setDeleteAdd({
      index: i,
      address: item,
    });
    
    setIsConfirming(true);
  };
  const onSubmit = () => {
    setIsConfirming(false)
    deleteAddress(deleteAdd.index)

    
  };
  
  return <View style={styles.container}>
    <Spinner visible={isLoading} />
      {isConfirming && (
        Alert.alert(
          "Comfirm",
          "Are you sure you want to delete address?",
          [

            {
              text: "No",
              onPress:()=> setIsConfirming(false)
            },
            {
              text: "Yes",
              onPress:()=> onSubmit()

            }



          ]
        )
      )}

      {

        address.map((item, i) => (

          <ListItem.Swipeable key={i}
            rightContent={
              <Button
                title="Delete"
                icon={<Icon
                  name="trash-outline"
                  size={21}
                  color="white"
                />}
                buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
                onPress={() => {
                  handleDeleteAddress(
                    item,
                    i
                  )
                }}
              />
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron name="edit" color={Colors.black} onPress={() => {  navigation.navigate('EditUserAddress',{oldAddress:item,index:i})}}></ListItem.Chevron>

          </ListItem.Swipeable>

        ))
      }
      

      <FAB

        placement='right'
        color={Colors.primary}
        icon={{ name: 'add', color: 'white' }}
        size="small"
        onPress={() => {
          navigation.navigate('AddUserAddress')

        }}
      />

      {/* <Dialog
            isVisible={visible}
            >
            <Dialog.Title title="Dialog Title"/>
            <View style={styles.form}>
            <Input
                    type='text'
                    icon='person'
                    title='Email address or phone number'
                    value='abc'
                   
                    validator=''
                    feedback='Please provide a valid email address or phone number.'
                    onChange={value => handleChange('username', 'isValidUsername', value)}
                    onValidate={value => handleValidate('isValidUsername', value)}
                />
                </View>
            <Dialog.Actions>
              <Dialog.Button title="ACTION 1" onPress={() => console.log('Primary Action Clicked!')}/>
              <Dialog.Button title="ACTION 2" onPress={() => setVisible(false)}/>
            </Dialog.Actions>
          </Dialog> */}

    </View>



}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.grey,
    padding: 5,
  },
  card: {
     textAlign: 'left',
  },
  bottomView: {
    width: '100%',
    height: 50,
    backgroundColor: '#EE5407',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.shadow,
  },

  profile: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 12,
    borderRadius: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },

});

export default UserAddress;