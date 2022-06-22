import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { checkReview } from "../../services/review";
import Button from "./Button";
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
                <Button
                    type="primary"
                    title={"Review & Rate"}
                    onPress={() => navigation.navigate('UserReview', {
                        orderId,
                        productId,
                        storeId,
                        item,
                    })}
                    disabled={isReviewed}
                />
            )}
            {isLoading && <Spinner />}
        </>
    );
}

export default ReviewAndRatingBtn;