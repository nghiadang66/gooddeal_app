import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { VendorContext } from '../../context/VendorContext';
import { createProduct } from '../../services/product';
import { regexTest, numberTest } from '../../helper/test';
import { BackBtn } from '../../components/Button/HeaderBtn';
import Input from '../../components/Form/Input';
import TextArea from '../../components/Form/TextArea';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';
import Button from '../../components/Button/Button';
import ImageInput from '../../components/Form/ImageInput';
import CategorySelect from '../../components/Form/CategorySelect';
import StyleSelect from '../../components/Form/StyleSelect';
import Colors from '../../themes/Colors';

const VendorProductAdd = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);
    const { storeProfile } = useContext(VendorContext);

    const [isloading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        categoryId: '',
        image0: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
        description: '',
        quantity: 0,
        price: 0,
        promotionalPrice: 0,
        styleValueIds: [],
        isValidName: true,
        isValidImage0: true,
        isValidImage1: true,
        isValidImage2: true,
        isValidImage3: true,
        isValidImage4: true,
        isValidImage5: true,
        isValidDescription: true,
        isValidQuantity: true,
        isValidPrice: true,
        isValidPromotionalPrice: true,
    });

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
            categoryId,
            image0,
            description,
            quantity,
            price,
            promotionalPrice,
        } = newProduct;

        if (
            !name ||
            !categoryId ||
            !image0 ||
            !description ||
            !quantity ||
            !price ||
            !promotionalPrice
        ) {
            setNewProduct({
                ...newProduct,
                isValidName: regexTest('anything', name),
                isValidImage0: !!image0,
                isValidDescription: regexTest('bio', description),
                isValidQuantity: numberTest('positive|zero', quantity),
                isValidPrice: numberTest('positive|zero', price),
                promotionalPrice: numberTest('positive|zero', promotionalPrice),
            });
            return;
        }

        const {
            isValidName,
            isValidImage0,
            isValidDescription,
            isValidQuantity,
            isValidPrice,
            isValidPromotionalPrice,
        } = newProduct;
        if (
            !isValidName ||
            !isValidImage0 ||
            !isValidDescription ||
            !isValidQuantity ||
            !isValidPrice ||
            !isValidPromotionalPrice
        )
            return;

        createTwoButtonAlert('Add New Product', () => onSubmit());
    }

    const onSubmit = () => {
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('description', newProduct.description);
        formData.append('quantity', newProduct.quantity);
        formData.append('price', newProduct.price);
        formData.append('promotionalPrice', newProduct.promotionalPrice);
        formData.append('image0', newProduct.image0);
        formData.append('categoryId', newProduct.categoryId);
        if (newProduct.styleValueIds && newProduct.styleValueIds.length > 0)
            formData.append('styleValueIds', newProduct.styleValueIds.join('|'));
        if (newProduct.image1) formData.append('image1', newProduct.image1);
        if (newProduct.image2) formData.append('image2', newProduct.image2);
        if (newProduct.image3) formData.append('image3', newProduct.image3);
        if (newProduct.image4) formData.append('image4', newProduct.image4);
        if (newProduct.image5) formData.append('image5', newProduct.image5);

        setError('');
        setSuccess('');
        setIsLoading(true);
        createProduct(jwt._id, jwt.accessToken, formData, storeProfile._id)
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    setTimeout(() => {
                        setError('');
                    }, 3000);
                }
                else {
                    setSuccess(data.success);
                    setTimeout(() => {
                        setSuccess('');
                    }, 3000);
                }
            })
            .catch(error => {
                setError('Sever error');
                setTimeout(() => {
                    setError('');
                }, 3000);
            })
            .finally(() => setIsLoading(false));
    };

    return  (
        <ScrollView style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.backBtn}>
                    <BackBtn navigation={navigation} color='primary' />
                </View>
                <View style={styles.container}>
                    <Text style={styles.heading}>New Product</Text>
                </View>
            </View>
       
            <View style={styles.p12}>
                <Text style={styles.title}>Name</Text>
                <Input
                    type='text'
                    title='Product name'
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

                <Text style={styles.title}>Avatar</Text>
                <ImageInput
                    isValid={newProduct.isValidImage0}
                    isRequired={true}
                    onChange={(value) =>
                        handleChange('image0', 'isValidImage0', value)
                    }
                />

                <Text style={styles.title}>Other Images</Text>
                <View style={[styles.rowContainer, { marginBottom: 12, }]}>
                    {Array.apply(null, Array(5)).map((x, i) => (
                        <ImageInput
                            key={i+1}
                            onChange={(value) =>
                                handleChange(`image${i+1}`, `isValidImage${i+1}`, value)
                            }
                        />
                    ))}
                </View>

                <Text style={styles.title}>Description</Text>
                <TextArea
                    title='Description'
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
                    defaultValue={'0'}
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
                    defaultValue={'0'}
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
                    defaultValue={'0'}
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
                    selectedValue={newProduct.categoryId}
                    onSet={(value) => setNewProduct({
                        ...newProduct,
                        categoryId: value,
                    })}
                />

                <Text style={styles.title}>Styles</Text>
                <StyleSelect
                    selectedValues={newProduct.styleValueIds}
                    categoryId={newProduct.categoryId}
                    onSet={(values) => setNewProduct({
                        ...newProduct,
                        styleValueIds: values,
                   })}
                />
                
                {isloading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

                <Button
                    title='Submit'
                    onPress={handleSubmit}
                />  
            </View>
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
    wrapper: {
        backgroundColor: Colors.white,
        padding: 6,
        borderRadius: 3,
        marginBottom: 3,
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
});

export default VendorProductAdd;