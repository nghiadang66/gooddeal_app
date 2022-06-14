import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { VendorContext } from '../context/VendorContext';
import { 
    updateProduct,
    getProductByIdForManager,
    addListImages,
    updateListImages,
    removeListImages,
} from '../services/product';
import { regexTest, numberTest } from '../helper/test';
import { BackBtn } from '../components/Button/HeaderBtn';
import Input from '../components/Form/Input';
import TextArea from '../components/Form/TextArea';
import { createTwoButtonAlert } from '../components/Other/Confirm';
import Spinner from '../components/Other/Spinner';
import Alert from '../components/Other/Alert';
import Button from '../components/Button/Button';
import ImageInput from '../components/Form/ImageInput';
import CategorySelect from '../components/Form/CategorySelect';
import StyleSelect from '../components/Form/StyleSelect';
import Colors from '../themes/Colors';

const VendorProductEdit = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);
    const { storeProfile } = useContext(VendorContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isLoading1, setIsLoading1] = useState(false);
    const [error1, setError1] = useState('');
    const [success1, setSuccess1] = useState('');
    const [isLoading2, setIsLoading2] = useState(false);
    const [error2, setError2] = useState('');
    const [success2, setSuccess2] = useState('');

    const [product, setProduct] = useState({});
    const [images, setImages] = useState([]);
    const [newProduct, setNewProduct] = useState({});

    const getProduct = () => {
        setError('');
        setIsLoading(true);
        getProductByIdForManager(jwt._id, jwt.accessToken, route.params.productId, storeProfile._id)
            .then(data => setProduct(data.product))
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));
    };

    const init = () => {
        setImages(product.listImages);
        setNewProduct({
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            price: product.price && product.price.$numberDecimal,
            promotionalPrice:
                product.promotionalPrice &&
                product.promotionalPrice.$numberDecimal,
            categoryId: product.categoryId && product.categoryId._id,
            defaultCategory: product.categoryId,
            styleValueIds:
                product.styleValueIds &&
                product.styleValueIds.map((v) => v._id),
            defaultStyleValues: product.styleValueIds,
            isValidName: true,
            isValidDescription: true,
            isValidQuantity: true,
            isValidPrice: true,
            isValidPromotionalPrice: true,
        });
    };
 
    useEffect(() => {
        getProduct();
    }, [route.params.productId]);

    useEffect(() => {
        init();
    }, [product]);

    const handleAddImage = (value) => {
        if (value==='') return; 
        const formData = new FormData();
        formData.append('photo', value);
        setError1('');
            setSuccess1('');
            setIsLoading1(true);
            addListImages(jwt._id, jwt.accessToken, formData, route.params.productId, storeProfile._id)
                .then(data => {
                    setSuccess1(data.success);
                    setTimeout(() => {
                        setSuccess1('');
                    }, 3000);
                    setProduct(data.product);
                })
                .catch(error => {
                    setError1('Server Error');
                    setTimeout(() => {
                        setError1('');
                    }, 3000);
                })
                .finally(() => setIsLoading1(false));
    }

    const handleChangeImage = (index, value) => {
        if (value !== '') {
            const formData = new FormData();
            formData.append('photo', value);
            setError1('');
            setSuccess1('');
            setIsLoading1(true);
            updateListImages(jwt._id, jwt.accessToken, formData, index, route.params.productId, storeProfile._id)
                .then(data => {
                    setSuccess1(data.success);
                    setTimeout(() => {
                        setSuccess1('');
                    }, 3000);
                    setProduct(data.product);
                })
                .catch(error => {
                    setError1('Server Error');
                    setTimeout(() => {
                        setError1('');
                    }, 3000);
                })
                .finally(() => setIsLoading1(false));
        }
        else {
            setError1('');
            setSuccess1('');
            setIsLoading1(true);
            removeListImages(jwt._id, jwt.accessToken, index, route.params.productId, storeProfile._id)
                .then(data => {
                    setSuccess1(data.success);
                    setTimeout(() => {
                        setSuccess1('');
                    }, 3000);
                    setProduct(data.product);
                })
                .catch((error) => {
                    setError1('Server Error');
                    setTimeout(() => {
                        setError1('');
                    }, 3000);
                })
                .finally(() => setIsLoading1(false));
        }
    }

    const handleChange = (name, isValidName, value) => {
        setNewProduct({
            ...newProduct,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewProduct({
            ...newProduct,
            [isValidName]: flag,
        });
    };

    const handleSubmit = () => {
        const {
            name,
            description,
            quantity,
            price,
            promotionalPrice,
            categoryId,
        } = newProduct;
        if (
            !name ||
            !description ||
            !quantity ||
            !price ||
            !promotionalPrice ||
            !categoryId
        ) {
            setNewProduct({
                ...newProduct,
                isValidName: regexTest('anything', name),
                isValidDescription: regexTest('bio', description),
                isValidQuantity: numberTest('positive|zero', quantity),
                isValidPrice: numberTest('positive|zero', price),
                promotionalPrice: numberTest('positive|zero', promotionalPrice),
            });
            return;
        }

        const {
            isValidName,
            isValidDescription,
            isValidQuantity,
            isValidPrice,
            isValidPromotionalPrice,
        } = newProduct;
        if (
            !isValidName ||
            !isValidDescription ||
            !isValidQuantity ||
            !isValidPrice ||
            !isValidPromotionalPrice
        )
            return;

        createTwoButtonAlert('Edit Product Infomation', () => onSubmit());
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('quantity', newProduct.quantity);
        formData.append('price', newProduct.price);
        formData.append('promotionalPrice', newProduct.promotionalPrice);
        formData.append('categoryId', newProduct.categoryId);
        if (newProduct.styleValueIds && newProduct.styleValueIds.length > 0)
            formData.append('styleValueIds', newProduct.styleValueIds.join('|'));

        setError2('');
        setSuccess2('');
        setIsLoading2(true);
        updateProduct(jwt._id, jwt.accessToken, formData, route.params.productId, storeProfile._id)
            .then(data => {
                if (data.error) {
                    setError2(data.error);
                    setTimeout(() => {
                        setError2('');
                    }, 3000);
                }
                else {
                    setSuccess2(data.success);
                    setTimeout(() => {
                        setSuccess2('');
                    }, 3000);
                    setProduct(data.product);
                }
                
            })
            .catch((error) => {
                setError2('Server Error');
                setTimeout(() => {
                    setError2('');
                }, 3000);
            })
            .finally(() => setIsLoading2(false));
    };


    return  (
        <ScrollView style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.backBtn}>
                    <BackBtn navigation={navigation} color='primary' />
                </View>
                <View style={styles.container}>
                    <Text style={styles.heading}>Edit Product</Text>
                </View>
            </View>

            {!isLoading && !error && (
                <View style={styles.p12}>
                    <Text style={[styles.heading, styles.mb12]}>Images</Text>

                    {isLoading1 && <Spinner />}
                    {error1 ? <Alert type='error' content={error1} /> : null}
                    {success1 ? <Alert type='success' content={success1} /> : null}

                    <Text style={styles.title}>Avatar</Text>
                    <ImageInput
                        defaultSrc={images[0]}
                        isValid={true}
                        isRequired={true}
                        onChange={(value) => handleChangeImage(0, value)}
                    />

                    <Text style={styles.title}>Others</Text>
                    <View style={styles.rowContainer}>
                        {images.length > 1 && images.map((image, index) => {
                            if (index === 0) return null;
                            return (
                                <ImageInput
                                    key={index}
                                    defaultSrc={images[index]}
                                    onChange={(value) => handleChangeImage(index, value)}
                                />
                            );
                        })}
                        {images.length > 0 && images.length < 6 && (
                            <ImageInput
                                key={images.length}
                                onChange={(value) => handleAddImage(value)}
                            />
                        )}
                    </View>

                    <View style={styles.p12}>
                        <Text style={[styles.heading, styles.mb12]}>Information</Text>

                        <Text style={styles.title}>Name</Text>
                        <Input
                            type='text'
                            title='Product name'
                            defaultValue={newProduct.name}
                            value={newProduct.name}
                            isValid={newProduct.isValidName}
                            validator={'anything'}
                            feedback={'Please provide a valid product name.'}
                            onChange={(value) =>
                                handleChange('name', 'isValidName', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidName', flag)
                            }
                        />

                        <Text style={styles.title}>Description</Text>
                        <TextArea
                            title='Description'
                            defaultValue={newProduct.description}
                            value={newProduct.description}
                            isValid={newProduct.isValidDescription}
                            validator={'bio'}
                            feedback={'Please provide a valid product description.'}
                            onChange={(value) =>
                                handleChange(
                                    'description',
                                    'isValidDescription',
                                    value,
                                )
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidDescription', flag)
                            }
                        /> 

                        <Text style={styles.title}>Quantity</Text>
                        <Input
                            type='number'
                            title='Quantity'
                            defaultValue={newProduct.quantity}
                            value={newProduct.quantity}
                            isValid={newProduct.isValidQuantity}
                            feedback="Please provide a valid product quantity."
                            validator="positive|zero"
                            onChange={(value) =>
                                handleChange('quantity', 'isValidQuantity', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidQuantity', flag)
                            }
                        />

                        <Text style={styles.title}>{'Price (VND)'}</Text>
                        <Input
                            type='number'
                            title='Price (VND)'
                            defaultValue={newProduct.price}
                            value={newProduct.price}
                            isValid={newProduct.isValidPrice}
                            feedback="Please provide a valid product price."
                            validator="positive|zero"
                            onChange={(value) =>
                                handleChange('price', 'isValidPrice', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidPrice', flag)
                            }
                        />

                        <Text style={styles.title}>{'Promotional Price (VND)'}</Text>
                        <Input
                            type='number'
                            title='Promotional Price (VND)'
                            defaultValue={newProduct.promotionalPrice}
                            value={newProduct.promotionalPrice}
                            isValid={newProduct.isValidPromotionalPrice}
                            feedback="Please provide a valid product promotional price."
                            validator="positive|zero"
                            onChange={(value) =>
                                handleChange('promotionalPrice', 'isValidPromotionalPrice', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidPromotionalPrice', flag)
                            }
                        />

                        <Text style={styles.title}>Category</Text>
                        <CategorySelect
                            defaultValue={newProduct.defaultCategory}
                            selectedValue={newProduct.categoryId}
                            onSet={(value) => setNewProduct({
                                    ...newProduct,
                                    categoryId: value,
                            })}
                        />

                        <Text style={styles.title}>Styles</Text>
                        <StyleSelect
                            defaultValue={newProduct.defaultStyleValues}
                            selectedValues={newProduct.styleValueIds}
                            categoryId={newProduct.categoryId}
                            onSet={(values) => 
                                setNewProduct({
                                ...newProduct,
                                styleValueIds: values,
                            })}
                        />

                        {isLoading2 && <Spinner />}
                        {error2 ? <Alert type='error' content={error2} /> : null}
                        {success2 ? <Alert type='success' content={success2} /> : null} 

                        <Button
                            title='Edit'
                            onPress={handleSubmit}
                        /> 
                    </View>
                </View>)}
            
            {isLoading && <Spinner />}
            {error ? <Alert type={'error'} content={error} /> : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    backBtn: {
        margin: 6,
    },
    heading: {
        color: Colors.primary,
        fontSize: 20,
    },
    title: {
        color: Colors.primary,
        marginLeft: 12,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
    },
    p12: {
        padding: 12,
    },
    mb12: {
        marginBottom: 12,
    }
});

export default VendorProductEdit;