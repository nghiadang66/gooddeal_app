import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView, StyleSheet } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import StarRating from '../Other/StarRating';
import Colors from '../../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const dimensions = Dimensions.get('screen');
const filterRadio = {
    rating: [
        {
            label: 'All',
            value: {
                filterName: 'rating',
                filterValue: '',
            },
        },
        {
            label: <StarRating stars={5} />,
            value: {
                filterName: 'rating',
                filterValue: 5,
            },
        },
        {
            label: <StarRating stars={4} />,
            value: {
                filterName: 'rating',
                filterValue: 4,
            },
        },
        {
            label: <StarRating stars={3} />,
            value: {
                filterName: 'rating',
                filterValue: 3,
            },
        },
        {
            label: <StarRating stars={2} />,
            value: {
                filterName: 'rating',
                filterValue: 2,
            },
        },
        {
            label: <StarRating stars={1} />,
            value: {
                filterName: 'rating',
                filterValue: 1,
            },
        },
    ],
}

const RatingFilter = ({ filter = {}, setFilter = () => {} }) => {
    const [isOpening, setIsOpening] = useState(false);
    const firstRenderRef = useRef(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleFilter = ({ name, value }) => {
        setFilter({
            ...filter,
            [name]: value,
            page: 1,
        });
    };

    const animation = () => Animated.timing(fadeAnim, {
        toValue: isOpening ? 1: 0,
        duration: 300,
        useNativeDriver: true,
    }).start();

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        return animation();
    }, [isOpening]);
    
    return (
        <>
            <TouchableOpacity
                style={styles.floatBtn}
                onPress={() => setIsOpening(!isOpening)}
            >
                <Icon name={!isOpening ? 'filter' : 'close'} style={styles.icon} />
            </TouchableOpacity>

            <Animated.View
                pointerEvents={isOpening ? 'auto' : 'none'}
                style={[
                    styles.filter,
                    {
                        opacity: fadeAnim,
                        transform: [
                            {
                                translateX: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [150, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Text style={styles.heading}>Filters</Text>

                <View style={styles.filterContainer}>
                    <ScrollView>
                        <View style={styles.filterWrapper}>
                            <Text style={styles.filterName}>Rating</Text>
                            <RadioForm
                                radio_props={filterRadio.rating}
                                initial={0}
                                formHorizontal={false}
                                labelHorizontal={true}
                                buttonColor={Colors.primary}
                                animation={true}
                                onPress={(value) => handleFilter({
                                    name: value.filterName,
                                    value: value.filterValue,
                                })}
                            />
                        </View>
                    </ScrollView>
                </View>
            </Animated.View>

            <Animated.View
                pointerEvents={isOpening ? 'auto' : 'none'}
                style={[
                    styles.shadow,
                    { opacity: fadeAnim },
                ]}
            ></Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    floatBtn: {
        position: 'absolute',                                   
        bottom: 10,
        right: 10,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,     
        backgroundColor: Colors.primary,
    },
    icon: {
        fontSize: 24,
        color: Colors.white
    },
    filter: {
        position: 'absolute',
        flex: 1,
        top: 0,
        right: 0,
        zIndex: 2,
        width: dimensions.width * 0.8,
        height: dimensions.height - 128,
        backgroundColor: Colors.white,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
        borderBottomColor: Colors.shadow,
        borderBottomWidth: 1,
        padding: 16,
    },
    filterContainer: {
        flex: 1,
    },
    filterWrapper: {
        margin: 16,
    },
    filterName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 12,
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: Colors.shadow,
    },
});

export default RatingFilter;