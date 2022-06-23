import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { checkReview } from "../../services/review";
import DialogBtn from "./DialogBtn"; 
import Spinner from "../Other/Spinner";

const ReviewAndRatingBtn = ({ orderId = '', storeId = '', productId = '', item = {}, navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);

    const { jwt } = useContext(AuthContext);

    const init = () => {
        setIsLoading(true);
        checkReview(jwt._id, jwt.accessToken, { orderId, productId })
            .then(data => {
                if (data.success) setIsReviewed(true);
                else setIsReviewed(false);
            })
            .catch(error => setIsReviewed(false))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        init();
    }, [jwt, orderId, storeId, productId, item]);

    return (
        <>
            {!isLoading && (
                <DialogBtn 
                    message={isReviewed ? 'You have already reviewed and rate.' : ''}
                    items={isReviewed ? [] : [
                        {
                            title: 'Review & Rate',
                            onPress: () => navigation.navigate('UserReview', {
                                orderId,
                                productId,
                                storeId,
                                item,
                            }),
                        }
                    ]}
                />
            )}
            {isLoading && <Spinner />}
        </>
    );
}

export default ReviewAndRatingBtn;