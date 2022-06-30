
import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet,Alert,ActivityIndicator, } from 'react-native';
import Colors from '../../themes/Colors';
import { formatPrice } from '../../helper/formatPrice';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import Spinner from '../../components/Other/Spinner';
import Input from '../../components/Form/Input';
import { Button } from 'react-native-elements';
import { listActiveDeliveries } from '../../services/delivery';
import { getStoreLevel } from '../../services/level';
import { createOrder } from '../../services/order';
import { getCommissionByStore } from '../../services/commission';
import {
  totalDelivery,
  totalProducts,
  totalCommission,
} from '../../helper/total';
import UserLevelLabel from '../../components/Label/UserLevelLabel';
import ListItems from '../../components/List/ListItems';
import Alert1 from '../../components/Other/Alert';
import Select from '../../components/Form/Select';
import SelectDelivery from '../../components/Form/SelectDelivery';
import { regexTest } from '../../helper/test';
import { convertVNDtoUSD } from '../../helper/formatPrice';
import { PAYPAL_CLIENT_ID,PAYPAL_SECRET_ID } from '../../config';
import base64 from 'react-native-base64'
import axios from "axios";
import qs from "qs";
import { WebView } from 'react-native-webview';

const Checkout = ({ navigation, route }) => {
  const { jwt, userProfile, level } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  
  const addresses = userProfile.addresses
  const phone = userProfile.phone
  const lists = [
   
    addresses.map((item, index) => 
    (
      {_id:index,name:item}
    )

  

    )
   
  ]
  const [deliveries, setDeliveries] = useState([]);
  const [order, setOrder] = useState({});
  const [isWebViewLoading, SetIsWebViewLoading] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState('');
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (!global.btoa) {
      global.btoa = base64.encode;
    }

    if (!global.atob) {
      global.atob = base64.decode;
    }
  }, [])


  //When loading paypal page it refirects lots of times. This prop to control start loading only first time
  const [shouldShowWebViewLoading, setShouldShowWebviewLoading] = useState(true)

  
  
  const init = async () => {
    try {
      const res = await listActiveDeliveries();
      const res1 = await getStoreLevel(route.params.storeId);
      const res2 = await getCommissionByStore(route.params.storeId);

      setDeliveries([res.deliveries]);
      const { deliveryPrice, amountFromUser2 } = totalDelivery(
        res.deliveries[0],
        level,
      );
      const { totalPrice, totalPromotionalPrice, amountFromUser1 } =
        totalProducts(route.params.items, level);
      const { amountFromStore, amountToStore } = totalCommission(
        route.params.items,
        res1.level,
        res2.commission,
      );

      setOrder({
        phone,
        address: addresses[0],
        isValidPhone: true,
        cartId:route.params.cartId,
        delivery: res.deliveries[0],
        deliveryId: res.deliveries[0]._id,
        deliveryPrice,
        amountFromUser2,
        totalPrice,
        totalPromotionalPrice,
        amountFromUser1,
        amountFromUser: amountFromUser1 + amountFromUser2,
        amountFromStore,
        amountToStore,
        commissionId: res2.commission._id,
        amountToGD: amountFromUser1 + amountFromUser2 - amountToStore,
      });
    } catch (e) {
      setError('Server Error');
    }
  };

  useEffect(() => {
    init();
  }, [route.params.cartId, route.params.userId, route.params.storeId, route.params.items, addresses, phone, level]);
  const buyPayPal = async () => {

    //Check out https://developer.paypal.com/docs/integration/direct/payments/paypal-payments/# for more detail paypal checkout
    const dataDetail = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": convertVNDtoUSD(order.amountFromUser),
         
        },
        "description": "This is the payment transaction description",
        "payment_options": {
          "allowed_payment_method": "IMMEDIATE_PAY"
        }
      }],
      "redirect_urls": {
        "return_url": "https://example.com/",
        "cancel_url": "https://example.com/"
      }
    }

    const url = `https://api.sandbox.paypal.com/v1/oauth2/token`;

    const data = {
      grant_type: 'client_credentials'

    };

    const auth = {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET_ID


    };

    const options = {

      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Credentials': true
      },

      //Make sure you use the qs.stringify for data
      data: qs.stringify(data),
      auth: auth,
      url,
    };

    // Authorise with seller app information (clientId and secret key)
    axios(options).then(response => {
      setAccessToken(response.data.access_token)

      //Resquest payal payment (It will load login page payment detail on the way)
      axios.post(`https://api.sandbox.paypal.com/v1/payments/payment`, dataDetail,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.data.access_token}`
          }
        }
      )
        .then(response => {
          const { id, links } = response.data
          const approvalUrl = links.find(data => data.rel == "approval_url").href

          setPaypalUrl(approvalUrl)
        }).catch(err => {
          console.log({ ...err })
        })
    }).catch(err => {
      console.log(err)
    })
  };
  const onWebviewLoadStart = () => {
    if (shouldShowWebViewLoading) {
      SetIsWebViewLoading(true)
    }
  }

  const _onNavigationStateChange = (webViewState) => {


    //When the webViewState.title is empty this mean it's in process loading the first paypal page so there is no paypal's loading icon
    //We show our loading icon then. After that we don't want to show our icon we need to set setShouldShowWebviewLoading to limit it
    if (webViewState.title == "") {
      //When the webview get here Don't need our loading anymore because there is one from paypal
      setShouldShowWebviewLoading(false)
    }

    if (webViewState.url.includes('https://example.com/')) {

      setPaypalUrl(null)
      const urlArr = webViewState.url.split(/(=|&)/);

      const paymentId = urlArr[2];
      const payerId = urlArr[10];

      axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, { payer_id: payerId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
        .then(response => {
          setShouldShowWebviewLoading(true)
          const {
            phone,
            address,
            deliveryId,
            commissionId,
            amountFromUser,
            amountFromStore,
            amountToStore,
            amountToGD,
        } = order;
      
        const orderBody = {
            phone,
            address,
            deliveryId,
            commissionId,
            amountFromUser,
            amountFromStore,
            amountToStore,
            amountToGD,
            isPaidBefore: false,
        };
      
        setError('');
        setIsLoading(true);
        createOrder(jwt._id, jwt.accessToken, route.params.cartId, orderBody)
            .then((data) => {
                if (data.error) setError(data.error);
                else {
                  navigation.navigate('Purchase');
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
                setIsLoading(false);
            });

        }).catch(err => {
          setShouldShowWebviewLoading(true)
          console.log({ ...err })
        })

    }
  }
  const handleChange = (name, isValidName, value) => {
    setOrder({
      ...order,
      [name]: value,
      [isValidName]: true,
    });
  };
  const addressChange = (oldId, newId) => {
 
    setOrder({
      ...order,
      address: addresses[newId],
  })
}
const deliveryChange = (oldId, newId) => {
  let i=0
  deliveries[0].map((item,index)=>{
    if(item._id==newId)
    i=index
  }   
  )

  const {
    deliveryPrice,
    amountFromUser2,
} = totalDelivery(deliveries[0][i], level);
setOrder({
    ...order,
    delivery:deliveries[0][i],
    deliveryId: deliveries[0][i]._id,
    deliveryPrice,
    amountFromUser2,
    amountFromUser:
        order.amountFromUser1 +
        amountFromUser2,
    amountToGD:
        order.amountFromUser1 +
        amountFromUser2 -
        order.amountToStore,
});
}
  const handleValidate = (isValidName, flag) => {
    setOrder({
        ...order,
        [isValidName]: flag,
    });
};
const handleSubmit = () => {

  const {
      cartId,
      deliveryId,
      commissionId,
      address,
      phone,
      amountFromUser,
      amountFromStore,
      amountToStore,
      amountToGD,
  } = order;

  if (
      !cartId ||
      !deliveryId ||
      !commissionId ||
      !address ||
      !phone ||
      !amountFromUser ||
      !amountFromStore ||
      !amountToStore ||
      !amountToGD
  ) {
      setOrder({
          ...order,
          isValidPhone: regexTest('phone', order.phone),
      });
      return;
  }

  if (!order.isValidPhone) return;

  setIsConfirming(true);
};
const onSubmit = () => {
  setIsConfirming(false)
  const {
      phone,
      address,
      deliveryId,
      commissionId,
      amountFromUser,
      amountFromStore,
      amountToStore,
      amountToGD,
  } = order;

  const orderBody = {
      phone,
      address,
      deliveryId,
      commissionId,
      amountFromUser,
      amountFromStore,
      amountToStore,
      amountToGD,
      isPaidBefore: false,
  };

  setError('');
  setIsLoading(true);
  createOrder(jwt._id, jwt.accessToken, route.params.cartId, orderBody)
      .then((data) => {
          if (data.error) setError(data.error);
          else {
            navigation.navigate('Purchase');
          }
          setIsLoading(false);
      })
      .catch((error) => {
          setError('Server Error');
          setTimeout(() => {
              setError('');
          }, 3000);
          setIsLoading(false);
      });
};
  return <View style={styles.container}>
    <ScrollView >

      {isLoading && <Spinner />}
      
      {isConfirming && (
                Alert.alert(
                    "Comfirm",
                    "Only order",
                    [

                        {
                            text: "No",
                            onPress: () => setIsConfirming(false)
                        },
                        {
                            text: "Yes",
                            onPress: () => onSubmit()
                              
                            
                        }



                    ]
                )
            )}
      <View style={{ margin: 10,marginBottom:100 }}>
        <Text style={styles.text}>Phone</Text>
        <Input
          type='text'
          title='Phone'
          icon='call-outline'
          value={phone}
          isValid={order.isValidPhone}
          validator='phone'
          feedback='Please provide a valid phone'
          onChange={(value) =>
            handleChange(
                'phone',
                'isValidPhone',
                value,
            )
        }
        onValidate={(flag) =>
            handleValidate('isValidPhone', flag)
        }
        />
        <View style={styles.order}>
          <Text style={styles.text}>Address</Text>
          <Button
            icon={
              <Icon
                name="add"
                size={17}
                color="white"
              />
            }
            onPress={() => {
              navigation.navigate('AddAddress')
    
            }}
          />
        </View>

        {
          addresses && addresses.length > 0 && lists.map((styleList, index) => (
            <View key={index} style={styles.select}>
              <Select
                values={styleList}
                selectedValue={styleList[0]._id}
                onChange={(o, n) => addressChange(o, n)}
              />
            </View>
          ))
        }
        {addresses && addresses.length <= 0 && (
          <Alert1 type='error' content="No address to choose, please add your address first!" />

        )}
        <Text style={styles.text}>Delivery Unit</Text>
        {deliveries && deliveries.length > 0 &&
          deliveries.map((styleList, index) => (
            <View key={index} style={styles.select}>
              <SelectDelivery
                values={styleList}
                selectedValue={styleList[0]._id}
              onChange={(o, n) => deliveryChange(o, n)}
              />
            </View>
          ))
        }
        <ListItems

          cartId={route.params.cartId}
          storeId={route.params.storeId}
          userId={route.params.userId}

        />
        <View style={styles.order}>
          <Text style={{fontSize:17}}>Product's total</Text>
        <View>
                                            <Text style={styles.oldPrice}>
                                                <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                                                {formatPrice(order.totalPrice)}
                                            </Text>
                                            <Text style={styles.newPrice}>
                                                <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                                {formatPrice(order.totalPromotionalPrice)}
                                            </Text>
                                        </View>
                <View>
                <UserLevelLabel level={level} />
                <Text style={styles.total}>
                    <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                    {formatPrice(order.amountFromUser1)}
                </Text>
                </View>
        </View>
        <View style={styles.order}>
          <Text style={{fontSize:17}}>Delivery's total</Text>
        <View>
                                            <Text style={styles.oldPrice}>
                                                <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                                                {formatPrice(order.deliveryPrice)}
                                            </Text>
                                            <Text style={styles.newPrice}>
                                                <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                                {formatPrice(order.deliveryPrice)}
                                            </Text>
                                        </View>
                <View>
                <UserLevelLabel level={level} />
                <Text style={styles.total}>
                    <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                    {formatPrice(order.amountFromUser2)}
                </Text>
                </View>
        </View>
        <View style={styles.order}>
          <Text style={{fontSize:17}}>Final total</Text>
        
                <Text style={styles.total}>
                    <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                    {formatPrice(order.amountFromUser)}
                </Text>
               
        </View>
        {error ? <Alert1 type='error' content={error} /> : null}
      </View>

    
    </ScrollView >

<View style={styles.bottomView}>
  <View>
   
  
  <Button title='Only order' buttonStyle={{backgroundColor:Colors.primary}} 
onPress={() => {

   handleSubmit()
  
}}
/>
  

<Button title='PayPal' buttonStyle={{backgroundColor:Colors.gold}} onPress={() => {

buyPayPal()

}}/>
  </View>

  

</View>
{paypalUrl ? (
        <View style={styles.webview}>
          <WebView
            style={{ height: "100%", width: "100%" }}
            source={{ uri: paypalUrl }}
            onNavigationStateChange={_onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            onLoadStart={onWebviewLoadStart}
            onLoadEnd={() => SetIsWebViewLoading(false)}
          />
        </View>
      ) : null}
      {isWebViewLoading ? (
        <View style={{ ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
          <ActivityIndicator size="small" color="#A02AE0" />
        </View>
      ) : null}
  </View>





}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    height: '100%',
    backgroundColor: Colors.white,

  },
  order: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:10
  },
  bottomView: {
    width: '100%',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  unit: {
    textDecorationLine: 'underline',
},
oldPrice: {
    fontSize: 15,
    color: Colors.muted,
    textDecorationLine: 'line-through',
    marginRight: 12,
},
newPrice: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.primary,
},
total: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 10
},
select: {
  marginBottom: 12,
},
text:{
  color:Colors.primary,
  paddingLeft:10,
  fontSize: 16
},
  webview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Checkout;
