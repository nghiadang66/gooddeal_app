import React, { useState, useEffect, useContext } from "react";
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { editReview } from "../../services/review";
import TextArea from '../../components/Form/TextArea';
import Button from '../../components/Button/Button';
import Spinner from '../../components/Other/Spinner';
import Alert from '../../components/Other/Alert';
import Colors from '../../themes/Colors';
import { formatPrice } from '../../helper/formatPrice';
import { createTwoButtonAlert } from '../../components/Other/Confirm';
import Image from '../../components/Other/Image';
import Link from '../../components/Other/Link';
import RatingInput from "../../components/Form/RatingInput";
import { numberTest, regexTest } from "../../helper/test";

const UserReviewEdit = ({ navigation, route }) => {
    const { jwt } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const [review, setReview] = useState({
        storeId: route.params.review.storeId,
        orderId: route.params.review.orderId,
        productId: route.params.review.productId,
        rating: route.params.review.rating,
        content: route.params.review.content,
        isValidRating: true,
        isValidContent: true,
    });

    useEffect(() => {
        setReview({
            storeId: route.params.review.storeId,
            orderId: route.params.review.orderId,
            productId: route.params.review.productId,
            rating: route.params.review.rating,
            content: route.params.review.content,
            isValidRating: true,
            isValidContent: true,
        });
    }, [jwt, route.params.review]);

    const handleChange = (name, isValidName, value) => {
        setReview({
            ...review,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setReview({
            ...review,
            [isValidName]: flag,
        });
    };

    const handleSubmit = () => {
        if (
            !review.storeId ||
            !review.orderId ||
            !review.productId ||
            !review.rating
        ) {
            setReview({
                ...review,
                isValidRating: numberTest('oneTo5', review.rating),
                isValidContent: regexTest('nullable', review.content),
            });
            return;
        }

        if (!review.isValidRating || !review.isValidContent) return;

        createTwoButtonAlert('Edit Your Review', onSubmit, `Rating: ${review.rating} stars - Content: "${review.content}"`);
    }

    const onSubmit = () => {
        setSuccess('');
        setError('');
        setIsLoading(true);
        editReview(jwt._id, jwt.accessToken, review, route.params.review._id)
            .then(data => {
                if (data.error) setError(data.error);
                else setSuccess(data.success);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));
    }

    return (
      <ScrollView>
        <View style={styles.container}>
            <View style={styles.p12}>
                <Text style={styles.title}>Rate</Text>
                <RatingInput
                    value={review.rating}
                    isValid={review.isValidRating}
                    onChange={(value) =>
                        handleChange('rating', 'isValidRating', value)
                    }
                />

                <Text style={styles.title}>Content</Text>
                <TextArea
                    title='Content'
                    value={review.content}
                    isValid={review.isValidContent}
                    feedback="Please provide a valid content."
                    validator="nullable"
                    onChange={(value) =>
                        handleChange('content', 'isValidContent', value)
                    }
                    onValidate={(flag) =>
                        handleValidate('isValidContent', flag)
                    }
                />

                {isLoading && <Spinner />}
                {error ? <Alert type='error' content={error} /> : null}
                {success ? <Alert type='success' content={success} /> : null}

                <Button
                    title='Edit'
                    onPress={handleSubmit}
                />
            </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wrapper: {
        backgroundColor: Colors.white,
        padding: 12,
        borderRadius: 3,
        marginBottom: 6,
    },
    title: {
        color: Colors.primary,
        marginLeft: 6,
    },
    content: {
        fontSize: 16,
        paddingVertical: 6,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    m6: {
        margin: 6,
    },
    p12: {
        padding: 12,
    },
    ml6: {
        marginLeft: 6,
    },
    mr6: {
        marginRight: 6,
    }
});

export default UserReviewEdit;