import React, { useState, useEffect } from "react";
import List from "./List";
import { listActiveProducts, listSellingProductsByStore } from '../../services/product';
import { getlistStores } from '../../services/store';
import Spinner from "../Other/Spinner";
import Alert from "../Other/Alert";

const initFilters = {
    'product': {
        search: '',
        rating: '',
        categoryId: '',
        storeId: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'sold',
        order: 'desc',
        limit: 6,
        page: 1,
    },
    'store': {
        search: '',
        sortBy: 'rating',
        sortMoreBy: 'point',
        isActive: 'true',
        order: 'desc',
        limit: 6,
        page: 1,
    }
}

const fetchFuncs = {
    'product': listActiveProducts,
    'store': getlistStores,
    'productByStore': listSellingProductsByStore,
}

const ListRecommend = ({ type = 'product', title = 'Best Seller', sortBy = 'sold', categoryId = '', storeId = '', navigation, noEndLink = false }) => {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState(initFilters[type]);

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getItems = () => {
        setError(false);
        setIsLoading(true);
        fetchFuncs[storeId ? 'productByStore' : type](filter, storeId)
            .then(data => {
                setItems(data[type+'s']);
            })
            .catch(error => {
                setError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    useEffect(() => {
        setFilter({
            ...initFilters[type],
            sortBy: sortBy,
            categoryId: categoryId,
            storeId: storeId,
        });
        return () => {
            setFilter(initFilters[type]);
        };
    }, [type, sortBy, categoryId, storeId]);

    useEffect(() => {
        getItems();
        return () => {
            setItems([]);
        };
    }, [filter]);

    return (
        <>
            {!isLoading && !error && (
                <List
                    navigation={navigation}
                    type = {type}
                    title={title}
                    items={items}
                    horizontal={true}
                    border={true}
                    onEndLink={ (!noEndLink && type !== 'productByStore') ? () => navigation.navigate('Search', { option: type }) : null}
                />
            )}
            {isLoading && <Spinner />}
            {error && <Alert />}
        </>
    );
}

export default ListRecommend;