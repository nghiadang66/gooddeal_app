import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView, StyleSheet } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import StarRating from './StarRating';
import Colors from '../themes/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const dimensions = Dimensions.get('screen');
const filterRadio = {
    sortBy: [
        {
            label: 'Best seller',
            value: {
                filterName: 'sortBy',
                filterValue: 'sold',
            },
        },
        {
            label: 'New product',
            value: {
                filterName: 'sortBy',
                filterValue: 'createdAt',
            },
        },
    ],
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
            label: <>
                <StarRating stars={4} />
                <Text>{' '}up</Text>
            </>,
            value: {
                filterName: 'rating',
                filterValue: 4,
            },
        },
        {
            label: <>
                <StarRating stars={3} />
                <Text>{' '}up</Text>
            </>,
            value: {
                filterName: 'rating',
                filterValue: 3,
            },
        },
        {
            label: <>
                <StarRating stars={2} />
                <Text>{' '}up</Text>
            </>,
            value: {
                filterName: 'rating',
                filterValue: 2,
            },
        },
        {
            label: <>
                <StarRating stars={1} />
                <Text>{' '}up</Text>
            </>,
            value: {
                filterName: 'rating',
                filterValue: 1,
            },
        },
    ],
    price: [
        {
            label: 'All',
            value: {
                min: 0,
                max: '',
            },
        },
        {
            label: '0 - 500,000',
            value: {
                min: 0,
                max: 500000,
            },
        },
        {
            label: '500,000 - 1,000,000',
            value: {
                min: 500000,
                max: 1000000,
            },
        },
        {
            label: '1,000,000 - 3,000,000',
            value: {
                min: 1000000,
                max: 300000,
            },
        },
        {
            label: '3,000,000 - 5,000,000',
            value: {
                min: 3000000,
                max: 5000000,
            },
        },
        {
            label: '5,000,000 up',
            value: {
                min: 5000000,
                max: '',
            },
        },
    ],
}

const Filter = ({ filter = {}, setFilter = () => {} }) => {
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

    const handleSetPrice = ({ min, max }) => {
        setFilter({
            ...filter,
            minPrice: min,
            maxPrice: max,
            page: 1,
        });
    }

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
                            <Text style={styles.filterName}>Sort by</Text>
                            <RadioForm
                                radio_props={filterRadio.sortBy}
                                initial={filterRadio.sortBy.findIndex(
                                    elm => elm.value.filterValue === filter.sortBy
                                )}
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

                        <View style={styles.filterWrapper}>
                            <Text style={styles.filterName}>Rating</Text>
                            <RadioForm
                                radio_props={filterRadio.rating}
                                initial={filterRadio.rating.findIndex(
                                    elm => elm.value.filterValue === filter.rating
                                )}
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

                        <View style={styles.filterWrapper}>
                            <Text style={styles.filterName}>Price</Text>
                            <RadioForm
                                radio_props={filterRadio.price}
                                initial={filterRadio.price.findIndex(
                                    elm => elm.value.min === filter.minPrice
                                        && elm.value.max === filter.maxPrice
                                )}
                                formHorizontal={false}
                                labelHorizontal={true}
                                buttonColor={Colors.primary}
                                animation={true}
                                onPress={(value) => handleSetPrice({
                                    min: value.min,
                                    max: value.max,
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

export default Filter;