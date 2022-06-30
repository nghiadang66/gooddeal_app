export const totalProducts = (items = [], userLevel = {}) => {
    let totalPrice, totalPromotionalPrice, amountFromUser1;

    try {
        totalPrice = items.reduce(
            (prev, item) =>
                parseFloat(prev) +
                parseFloat(item.productId.price.$numberDecimal) *
                    parseFloat(item.count),
            0,
        );
    } catch (e) {
        totalPrice = 0;
    }

    try {
        totalPromotionalPrice = items.reduce(
            (prev, item) =>
                parseFloat(prev) +
                parseFloat(item.productId.promotionalPrice.$numberDecimal) *
                    parseFloat(item.count),
            0,
        );
    } catch (e) {
        totalPromotionalPrice = 0;
    }

    try {
        amountFromUser1 =
            (totalPromotionalPrice *
                (100 - parseFloat(userLevel.discount.$numberDecimal))) /
            100;
    } catch (e) {
        amountFromUser1 = totalPromotionalPrice;
    }

    return {
        totalPrice,
        totalPromotionalPrice,
        amountFromUser1,
    };
};
export const totalDelivery = (delivery = {}, userLevel = {}) => {
    let deliveryPrice, amountFromUser2;

    try {
        deliveryPrice = delivery.price.$numberDecimal;
    } catch (e) {
        deliveryPrice = 0;
    }

    try {
        amountFromUser2 =
            (deliveryPrice *
                (100 - parseFloat(userLevel.discount.$numberDecimal))) /
            100;
    } catch (e) {
        amountFromUser2 = deliveryPrice;
    }

    return {
        deliveryPrice,
        amountFromUser2,
    };
};

export const totalCommission = (
    items = {},
    storeLevel = {},
    commission = {},
) => {
    let totalPrice, totalPromotionalPrice, amountFromStore, amountToStore;

    try {
        totalPrice = items.reduce(
            (prev, item) =>
                parseFloat(prev) +
                parseFloat(item.productId.price.$numberDecimal) *
                    parseFloat(item.count),
            0,
        );
    } catch (e) {
        totalPrice = 0;
    }

    try {
        totalPromotionalPrice = items.reduce(
            (prev, item) =>
                parseFloat(prev) +
                parseFloat(item.productId.promotionalPrice.$numberDecimal) *
                    parseFloat(item.count),
            0,
        );
    } catch (e) {
        totalPromotionalPrice = 0;
    }

    try {
        amountFromStore =
            (totalPromotionalPrice *
                (parseFloat(commission.cost.$numberDecimal) -
                    parseFloat(storeLevel.discount.$numberDecimal))) /
            100;
    } catch (e) {
        amountFromStore = 0;
    }

    amountToStore = totalPromotionalPrice - amountFromStore;

    return {
        totalPrice,
        totalPromotionalPrice,
        amountFromStore,
        amountToStore,
    };
};