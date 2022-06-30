import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getProduct as getProductAPi } from '../../services/product';
import { AuthContext } from '../../context/AuthContext';
import { formatPrice } from '../../helper/formatPrice';
import { BackBtn, CartBtn } from '../../components/Button/HeaderBtn';
import Slider from '../../components/Slider/Slider';
import FollowBtn from '../../components/Button/FollowBtn';
import Followers from '../../components/Label/Followers';
import StarRating from '../../components/Other/StarRating';
import Alert from '../../components/Other/Alert';
import Spinner from '../../components/Other/Spinner';
import Link from '../../components/Other/Link';
import SmallCard from '../../components/Card/SmallCard';
import AddToCart from '../../components/Form/AddToCart';
import ListRecommend from '../../components/List/ListRecommend';
import Colors from '../../themes/Colors';

const Product = ({ navigation, route }) => {
    const [product, setProduct] = useState();
    const [productImages, setProductImages] = useState();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const { jwt } = useContext(AuthContext);

    const getProduct = () => {
        setError(false);
        setIsLoading(true);
        getProductAPi(route.params.productId)
            .then(data => {
                setProduct(data.product);
                setProductImages(data.product.listImages);
            })
            .catch((error) => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        getProduct();
    }, [route.params.productId]);

    const onPressCategory = (category) => navigation.navigate('Category', {
        category: category,
    });

    const onPressViewMoreDescription = (name, description) => navigation.navigate('Description', {
        name: name,
        description: description,
    });

    const onPressViewAllReivews = (productId) => navigation.navigate('ReviewsAndRating', {
        productId: productId,
        storeId: '',
        userId: '',
    });
    
    return (
        <>
            {!isLoading && !error && (
                <ScrollView>
                    {product && (
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <View style={styles.headerItem}>
                                    <BackBtn navigation={navigation} background={true} />
                                </View>

                                {jwt && jwt.accessToken && (
                                    <View style={styles.headerItem}>
                                        <CartBtn navigation={navigation} jwt={jwt} background={true} />
                                    </View>
                                )}
                            </View>

                            {productImages && productImages.length > 0 && (
                                <View style={styles.slider}>
                                    <Slider images={productImages}/>
                                    {jwt && jwt.accessToken && (
                                        <FollowBtn
                                            type='product'
                                            userId={jwt._id}
                                            token={jwt.accessToken}
                                            itemId={product._id}
                                        />
                                    )}
                                </View>
                            )}

                            <View style={styles.wrapper}>
                                <Text style={styles.name}>{product.name}</Text>
                                
                                <View style={styles.price}>
                                    <Text style={styles.oldPrice}>
                                        <Text style={[styles.unit, styles.oldPrice]}>đ</Text>
                                        {product.price && formatPrice(product.price.$numberDecimal)}
                                    </Text>
                                    <Text style={styles.newPrice}>
                                        <Text style={[styles.unit, styles.newPrice]}>đ</Text>
                                        {product.promotionalPrice && formatPrice(product.promotionalPrice.$numberDecimal)}
                                    </Text>
                                </View>

                                <View style={styles.labelWrapper}>
                                    <View style={styles.label}>
                                        <StarRating stars={product.rating} />
                                    </View>

                                    <View style={styles.label}>
                                        <Text>|</Text>
                                    </View>
                                    <View style={styles.label}>
                                        <Followers type='product' id={product._id} />
                                    </View>

                                    <View style={styles.label}>
                                        <Text>|</Text>
                                    </View>
                                    <View style={styles.label}>
                                        <Text style={styles.sold}>Sold {product.sold}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.wrapper}>
                                <Text style={styles.heading}>Add To Cart</Text>
                                <AddToCart product={product} navigation={navigation} />
                            </View>

                            <View style={styles.wrapper}>
                                <Text style={styles.heading}>Description</Text>
                                <View style={styles.category}>
                                    <Link
                                        title={
                                            <>
                                                {product.categoryId &&
                                                    product.categoryId.categoryId &&
                                                    product.categoryId.categoryId.categoryId &&
                                                    product.categoryId.categoryId.categoryId.name + ' > '}
                                                {product.categoryId &&
                                                    product.categoryId.categoryId &&
                                                    product.categoryId.categoryId.name + ' > '}
                                                {product.categoryId &&
                                                    product.categoryId.name}
                                            </>
                                        }
                                        fontSize={18}
                                        onPress={() => onPressCategory(product.categoryId)}
                                    />
                                </View>

                                <View style={styles.description}>
                                    <Text style={styles.descriptionContent} numberOfLines={6}>{product.description}</Text>
                                    <View style={styles.viewMore}>
                                        <Link title='View more' fontSize={16} onPress={() => onPressViewMoreDescription(product.name, product.description)} />
                                    </View>
                                </View>

                                <View style={styles.seller}>
                                    <Text>Your Seller:</Text>
                                    <SmallCard navigation={navigation} type='store' item={product.storeId} />
                                </View>
                            </View>

                            <View style={styles.wrapper}>
                                <Text style={styles.heading}>Reviews {'&'} Rating</Text>
                                <View style={styles.labelWrapper}>
                                    <View style={styles.label}>
                                        <StarRating stars={product.rating} />
                                    </View>
                                    <View style={styles.viewMore}>
                                        <Link title='View all reviews' fontSize={16} onPress={() => onPressViewAllReivews(product._id)} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.recommend}>
                                <ListRecommend
                                    type='product'
                                    title='Similar Products'
                                    sortBy='sold'
                                    categoryId={
                                        product.categoryId &&
                                        product.categoryId.categoryId &&
                                        product.categoryId.categoryId.categoryId &&
                                        product.categoryId.categoryId.categoryId._id
                                    }
                                    navigation={navigation}
                                />
                            </View>

                            <View style={styles.recommend}>
                                <ListRecommend
                                    type='product'
                                    title={
                                        product.storeId &&
                                        product.storeId.name + "'s Products"
                                    }
                                    sortBy='sold'
                                    storeId={
                                        product.storeId &&
                                        product.storeId._id
                                    }
                                    navigation={navigation}
                                />
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}

            {isLoading && <Spinner />}
            {error && <Alert type={'error'} />}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 6,
        left: 6,
        zIndex: 9999,
        flex: 1,
        flexDirection: 'row',
    },
    headerItem: {
        marginRight: 6,
    },
    slider: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    wrapper: {
        flex: 1,
        padding: 12,
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 3,
    },
    recommend: {
        flex: 1,
        marginBottom: 16,
        backgroundColor: Colors.white,
        borderRadius: 3,
    },
    heading: {
        fontSize: 20,
        color: Colors.black,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    name: {
        color: Colors.black,
        fontSize: 20,
        marginBottom: 12,
    },
    price: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap-reverse',
        marginBottom: 12,
    },
    unit: {
        textDecorationLine: 'underline',
    },
    oldPrice: {
        fontSize: 16,
        color: Colors.muted,
        textDecorationLine: 'line-through',
        marginRight: 12,
    },
    newPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    labelWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    label: {
        marginRight: 12,
    },
    sold: {
        fontSize: Colors.muted,
        fontSize: 16,
    },
    category: {
        marginBottom: 12,
    },
    description: {
        marginBottom: 12,
    },
    descriptionContent: {
        fontSize: 16,
        textAlign: 'justify',
    },
    viewMore: {
        alignItems: 'center',
        // padding: 6,
    },
});

export default Product;