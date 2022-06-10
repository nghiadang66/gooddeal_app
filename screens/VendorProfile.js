import React, { useContext, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, FlatList, ScrollView, StyleSheet, } from 'react-native';
import { 
    updateAvatar as updateAvatarApi, 
    updateCover as updateCoverApi, 
    addFeaturedImage as addFeaturedImageApi,
    updateFeaturedImage as updateFeaturedImageApi,
    removeFeaturedImage as removeFeaturedImageApi,
} from '../services/store'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { STATIC_URL } from '../config';
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import { ListItem } from 'react-native-elements';
import Alert from '../components/Other/Alert';
import Colors from '../themes/Colors';
import Image from '../components/Other/Image';
import { createTwoButtonAlert } from '../components/Other/Confirm';

const VendorProfile = ({navigation, route}) => {
    const { jwt } = useContext(AuthContext);
    const { setStoreProfile, storeProfile } = useContext(VendorContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const list = [
        {
            title: 'Shop Name',
            value: storeProfile.name,
        },
        {
            title: 'Shop Bio',
            value: storeProfile.bio && storeProfile.bio.slice(0, 32) + '...',
        },
        {
            title: 'Shop Level',
            value: '(point, rating, orders, followers)',
        },
        {
            title: 'Others',
            value: '(bussiness type, joined date)',
        },
    ];

    const chooseAvatarImage= () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            const formData = new FormData();
            formData.append('photo',{type:'image/jpg',uri:image.path,name:'123.jpg'});
            updateAvatar(formData);
        });
    }
    
    const chooseCoverImage = () => {
        ImagePicker.openPicker({
            width: 500,
            height: 300,
            cropping: true
        }).then(image => {
            const formData = new FormData();
            formData.append('photo',{type:'image/jpg',uri:image.path,name:'123.jpg'})
            updateCover(formData)
        });
    }

    const chooseFeaturedImage = (index) => {
        ImagePicker.openPicker({
            width: 500,
            height: 300,
            cropping: true
        }).then(image => {
            const formData = new FormData();
            formData.append('photo',{type:'image/jpg',uri:image.path,name:'123.jpg'})
            index === -1 ? addFeaturedImage(formData) : updateFeaturedImage(formData, index);
        });
    }
    
    const handleChange= (i) => {
        switch (i) {
            case 2:
                navigation.navigate('VendorLevel');
                break;
            case 3:
                navigation.navigate('VendorJoined');
                break;
            default:
                navigation.navigate('VendorChangeProfile');
          }
    }

    const updateAvatar= (photo)=>{
        setIsLoading(true);
        setError('');
        updateAvatarApi(jwt._id, jwt.accessToken, photo, storeProfile._id)
            .then(data => {
                if (data.success)
                    setStoreProfile(data.store);
                if (data.error)
                    setError(data.error);
            })
            .catch(error => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    }

    const updateCover= (photo)=>{
        setIsLoading(true);
        setError('');
        updateCoverApi(jwt._id, jwt.accessToken, photo, storeProfile._id)
            .then(data => {
                if (data.success)
                    setStoreProfile(data.store);
                if (data.error)
                    setError(data.error);
            })
            .catch(error => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    }

    const addFeaturedImage = (photo) => {
        setIsLoading(true);
        setError('');
        addFeaturedImageApi(jwt._id, jwt.accessToken, photo, storeProfile._id)
            .then(data => {
                if (data.success)
                    setStoreProfile(data.store);
                if (data.error)
                    setError(data.error);
            })
            .catch(error => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    }

    const updateFeaturedImage = (photo, index) => {
        setIsLoading(true);
        setError('');
        updateFeaturedImageApi(jwt._id, jwt.accessToken, photo, index, storeProfile._id)
            .then(data => {
                if (data.success)
                    setStoreProfile(data.store);
                if (data.error)
                    setError(data.error);
            })
            .catch(error => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    }

    const removeFeaturedImage = (index) => {
        setIsLoading(true);
        setError('');
        removeFeaturedImageApi(jwt._id, jwt.accessToken, index, storeProfile._id)
            .then(data => {
                if (data.success)
                    setStoreProfile(data.store);
                if (data.error)
                    setError(data.error);
            })
            .catch(error => {
                setError('Server Error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    }
 
    return  (
        <ScrollView>
            <ImageBackground 
                source={{uri: STATIC_URL + storeProfile.cover }} 
                style={styles.cover}
            >
                <View style={styles.wrapper}>
                    <Avatar
                        rounded
                        size="large"
                        source={{
                            uri:
                            STATIC_URL + storeProfile.avatar
                        }}
                    >
                        <Avatar.Accessory iconProps={'camera'} size={23} onPress={()=>chooseAvatarImage()} />
                    </Avatar>
                    <TouchableOpacity
                        style={styles.cover_icon}
                        onPress={()=>chooseCoverImage()}
                    >
                        <Icon style={styles.icon} name={'camera'} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.slider}>
                <View style={styles.rowContainer}>
                    <Text style={styles.title}>Featured Images</Text>
                    <TouchableOpacity
                        style={styles.feature_icon} 
                        onPress={
                            storeProfile.featured_images && storeProfile.featured_images.length >= 6 ?
                            ()=>createTwoButtonAlert('Not Active', () => {}, 'The limit is 6 images.') : 
                            ()=>chooseFeaturedImage(-1)
                        }
                    >
                        <Icon style={styles.icon} name={'add-circle'} />
                    </TouchableOpacity>
                </View>
                {storeProfile.featured_images && storeProfile.featured_images.length > 0 &&
                    <FlatList
                        initialNumToRender={1}
                        horizontal={true}
                        numColumns={1}
                        data={storeProfile.featured_images}
                        renderItem={({ item, index }) => (
                            <View style={[styles.slider_item, index == 0 && {marginLeft: 0}, index == storeProfile.featured_images.length - 1 && {marginRight: 0}]}>
                                <Image image={item} size={'cover'} type={'store'} />
                                <TouchableOpacity
                                    style={styles.cover_icon}
                                    onPress={()=>chooseFeaturedImage(index)}
                                >
                                    <Icon style={styles.icon} name={'camera'} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.cover_icon, { top: 6 }]}
                                    onPress={()=>createTwoButtonAlert('Delete Featured Image', ()=>removeFeaturedImage(index))}
                                >
                                    <Icon style={styles.icon} name={'close-circle'} />
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={(item, index) => index}
                    /> 
                }
            </View>

            {error ? <Alert type='error' content={error} /> : null}
                
            <View style={styles.list_info}>
                {list.map((item, i) => (
                    <ListItem key={i} bottomDivider onPress={()=>{handleChange(i)}} >
                        <ListItem.Content>
                            <ListItem.Title>{item.title}</ListItem.Title>
                        </ListItem.Content>
                        <Text>{item.value}</Text>
                        <ListItem.Chevron  />
                    </ListItem>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 12,
        backgroundColor: Colors.shadow,
    },
    cover: {
        resizeMode: 'cover',
        width: '100%',
        height: 200,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: Colors.white,
        borderWidth: 3,
        opacity: 1,
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
    level: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        color: Colors.white,
    },
    point: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
        marginRight: 6,
    },
    cover_icon: {
        position: 'absolute',
        bottom: 6,
        right: 4,
        backgroundColor: Colors.muted,
        width: 32,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    feature_icon: {
        backgroundColor: Colors.muted,
        width: 32,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        margin: 6,
    },
    slider: {
        marginVertical: 12,
        marginHorizontal: 3,
    },
    slider_item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 3,
    },
    title: {
        color: Colors.black,
        fontSize: 16,
    },
    list_info: {
        flex: 1,
        marginBottom: 12,
    }
});

export default VendorProfile;