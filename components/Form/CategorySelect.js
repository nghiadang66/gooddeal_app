import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { listActiveCategories } from '../../services/category';
import CategorySelectItem from './CategorySelectItem';
import Colors from '../../themes/Colors';
import Spinner from '../Other/Spinner';
import Alert from '../Other/Alert';

const CategorySelect = ({ 
    defaultValue,
    selectedValue = '',
    onSet = () => {},
}) => {
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);

    const [lv1Categories, setLv1Categories] = useState([]);
    const [lv2Categories, setLv2Categories] = useState([]);
    const [lv3Categories, setLv3Categories] = useState([]);

    const [lv1Filter, setLv1Filter] = useState({
        search: '',
        categoryId: null,
        sortBy: 'name',
        order: 'asc',
        limit: 100,
        page: 1,
    });
    const [lv2Filter, setLv2Filter] = useState({
        search: '',
        categoryId: '',
        sortBy: 'name',
        order: 'asc',
        limit: 100,
        page: 1,
    });
    const [lv3Filter, setLv3Filter] = useState({
        search: '',
        categoryId: '',
        sortBy: 'name',
        order: 'asc',
        limit: 100,
        page: 1,
    });

    const init = () => {
        if (defaultValue) {
            setIsLoading1(true);
            setError1(false);
            listActiveCategories(lv1Filter)
                .then(data => {
                    setLv1Categories(data.categories);
                    setLv2Filter({
                        ...lv2Filter,
                        categoryId: defaultValue.categoryId.categoryId._id,
                    });
                    setLv3Filter({
                        ...lv3Filter,
                        categoryId: defaultValue.categoryId._id,
                    });
                    onSet(defaultValue._id);
                })
                .catch(error => setError1('Server Error'))
                .finally(() => setIsLoading1(false));
        }
        else {
            loadCategories(1);
        }
    }

    const loadCategories = (index) => {
        if (index === 1) {
            setIsLoading1(true);
            setError1('');
            listActiveCategories(lv1Filter)
                .then(data => {
                    setLv1Categories(data.categories);
                    setLv2Filter({
                        ...lv2Filter,
                        categoryId: data.categories[0]._id,
                    });
                })
                .catch(error => setError1('Server Error'))
                .finally(() => setIsLoading1(false));
        }
        else if (index === 2) {
            setIsLoading2(true);
            setError2('');
            listActiveCategories(lv2Filter)
                .then(data => {
                    setLv2Categories(data.categories);
                    setLv3Filter({
                        ...lv3Filter,
                        categoryId: data.categories[0]._id,
                    });
                })
                .catch(error => setError2('Server Error'))
                .finally(() => setIsLoading2(false));
        }
        else if (index === 3) {
            setIsLoading3(true);
            setError3('');
            listActiveCategories(lv3Filter)
                .then(data => {
                    setLv3Categories(data.categories);
                    onSet(data.categories[0]._id);
                })
                .catch(error => setError3('Server Error'))
                .finally(() => setIsLoading3(false));
        }
    };

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        loadCategories(2);
    }, [lv2Filter]);

    useEffect(() => {
        loadCategories(3);
    }, [lv3Filter]);

    const handleChange = (index, value) => {
        if (index === 1) {
            setLv2Filter({
                ...lv2Filter,
                categoryId: value,
            });
        }
        else if (index === 2) {
            setLv3Filter({
                ...lv3Filter,
                categoryId: value,
            });
        }
        else {
            onSet(value);
        }
    }; 

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Level 1</Text>
            {!isLoading1 && !error1 && <CategorySelectItem
                values={lv1Categories}
                selectedValue={lv2Categories.categoryId}
                onChange={(value) => handleChange(1, value)}
            />}
            {isLoading1 && <Spinner />}
            {error1 ? <Alert type='error' content={error1} /> : null}

            <Text style={styles.title}>Level 2</Text>
            {!isLoading2 && !error2 && lv2Categories.length > 0 && (
                <CategorySelectItem 
                    values={lv2Categories}
                    selectedValue={lv3Categories.categoryId}
                    onChange={(value) => handleChange(2, value)}
                />)}
            {isLoading2 && <Spinner />}
            {error2 ? <Alert type='error' content={error2} /> : null}

            <Text style={styles.title}>Level 3</Text>
            {!isLoading3 && lv3Categories.length > 0 &&  (
                <CategorySelectItem
                    values={lv3Categories}
                    selectedValue={selectedValue}
                    onChange={(value) => handleChange(3, value)}
                />)}
            {isLoading3 && <Spinner />}
            {/* {error3 ? <Alert type='error' content={error3} /> : null} */}

            <Text style={styles.title}>Choosed category</Text>
            <Text style={styles.content}>{lv3Categories.find(category => category._id == selectedValue) ?
                `${lv3Categories.find(category => category._id == selectedValue).categoryId.categoryId.name} > ${lv3Categories.find(category => category._id == selectedValue).categoryId.name} > ${lv3Categories.find(category => category._id == selectedValue).name}`:
                'No value choosed'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 6,
        marginBottom: 24,
    },
    title: {
        margin: 6,
    },
    content: {
        margin: 6,
        fontSize: 16,
        color: Colors.black,
    }
});

export default CategorySelect;