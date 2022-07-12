import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { listActiveCategories } from '../../services/category';
import CategorySelectItem from './CategorySelectItem';
import Colors from '../../themes/Colors';
import Spinner from '../Other/Spinner';
import Alert from '../Other/Alert';
import Icon from 'react-native-vector-icons/Ionicons';
import useToggle from '../../hooks/useToggle';
import useUpdateEffect from '../../hooks/useUpdateEffect'

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

    const [select, setSelect] = useState('');
    const [noChange, toggleNoChange] = useToggle(true);

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
                    setSelect(data.categories[0]);
                    if (!defaultValue || !noChange)
                        onSet(data.categories[0]._id);
                })
                .catch(error => setError3('Server Error'))
                .finally(() => setIsLoading3(false));
        }
    };

    useEffect(() => {
        loadCategories(1);
    }, []);

    useUpdateEffect(() => {
        loadCategories(2);
    }, [lv2Filter]);

    useUpdateEffect(() => {
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
            setSelect(lv3Categories.find(category => category._id == value));
            if (!defaultValue || !noChange) onSet(value);
        }
    };
    
    const handleNoChange = () => {
       noChange ? onSet(select._id) : onSet(defaultValue._id);
       toggleNoChange();
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Level 1</Text>
            {!isLoading1 && <CategorySelectItem
                values={lv1Categories}
                selectedValue={lv2Filter.categoryId}
                onChange={(value) => handleChange(1, value)}
            />}
            {isLoading1 && <Spinner />}
            {error1 ? <Alert type='error' content={error1} /> : null}

            <Text style={styles.title}>Level 2</Text>
            {!isLoading2 && lv2Categories.length > 0 && (
                <CategorySelectItem 
                    values={lv2Categories}
                    selectedValue={lv3Filter.categoryId}
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
            <Text style={styles.content}>{select ?
                `${select.categoryId.categoryId.name} > ${select.categoryId.name} > ${select.name}`:
                'No value choosed'}
            </Text>

            {defaultValue ? (
                <>
                    <Text style={styles.title}>Undo {'(No change category)'}</Text>
                    <View style={styles.rowContainer}>
                        <Text style={[styles.content, styles.container]}>{
                            `${defaultValue.categoryId.categoryId.name} > ${defaultValue.categoryId.name} > ${defaultValue.name}`}
                        </Text>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={handleNoChange}
                        >
                            <Icon style={[styles.icon, noChange && { color: Colors.primary }]} name={noChange ? 'checkmark-circle' : 'checkmark-circle-outline'} />
                        </TouchableOpacity>
                    </View>
                </>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 6,
        marginBottom: 24,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        margin: 6,
    },
    content: {
        margin: 6,
        fontSize: 16,
        color: Colors.black,
    },
    btn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
    icon: {
        fontSize: 24,
        color: Colors.black,
    },
});

export default CategorySelect;