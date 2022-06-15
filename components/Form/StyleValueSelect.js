import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { listActiveStyleValues, createStyleValue } from '../../services/style';
import { AuthContext } from "../../context/AuthContext";
import Colors from '../../themes/Colors';
import Spinner from '../Other/Spinner';
import Alert from '../Other/Alert';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from "./Input";
import { regexTest } from '../../helper/test';
import { createTwoButtonAlert } from "../Other/Confirm";

const StyleValueSelect = ({
    key,
    selectedValues=[],
    styleId='',
    styleName='',
    onSet=()=>{},
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [styleValues, setStyleValues] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const [isLoading1, setIsLoading1] = useState(false);
    const [error1, setError1] = useState('');
    const [success1, setSuccess1] = useState('');
    const [newValue, setNewValue] = useState({
        name: '',
        styleId,
        styleName,
        isValidName: true,
    });

    const { jwt } = useContext(AuthContext);

    const init = () => {
        setError('');
        setIsLoading(true);
        listActiveStyleValues(styleId)
            .then((data) => {
                setStyleValues(data.styleValues);
            })
            .catch((error) => setError('Server error'))
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        init();
    }, [styleId]);

    useEffect(() => {
        const newStyleValues = styleValues;
        const newLeft = [];
        const newRight = [];
        for (let sv of newStyleValues) {
            if (selectedValues.indexOf(sv._id) !== -1) newRight.push(sv);
            else newLeft.push(sv);
        }
        setLeft(newLeft);
        setRight(newRight); 
    }, [styleValues]);

    const handleAdd = (styleValue, index) => {
        const newLeft = [...left.slice(0, index), ...left.slice(index+1)];
        const newRight = [...right, styleValue];
        setLeft(newLeft);
        setRight(newRight);
        handleSet(newLeft, newRight);
    }
    
    const handleRemove = (styleValue, index) => {
        const newLeft = [...left, styleValue];
        const newRight = [...right.slice(0, index), ...right.slice(index+1)];
        setLeft(newLeft);
        setRight(newRight);
        handleSet(newLeft, newRight);
    }

    const handleSet = (left, right) => {
        for (let sv of left) {
            const index = selectedValues.indexOf(sv._id);
            if (index !== -1) {
                selectedValues = [...selectedValues.slice(0, index), ...selectedValues.slice(index+1)];
            }
        }
        for (let sv of right) {
            const index = selectedValues.indexOf(sv._id);
            if (index === -1) {
                selectedValues.push(sv._id)
            }
        }
        
        onSet(selectedValues);
    }

    const handleChange = (name, isValidName, value) => {
        setNewValue({
            ...newValue,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewValue({
            ...newValue,
            [isValidName]: flag,
        });
    };

    const handleSubmit = () => {
        const { name, styleId } = newValue;
        if (!name || !styleId) {
            setNewValue({
                ...newValue,
                isValidName: regexTest('anything', name),
            });
            return;
        }

        const { isValidName } = newValue;
        if (!isValidName) return;

        createTwoButtonAlert(`Add New Value For ${styleName}`, onSubmit, newValue.name);
    };

    const onSubmit = () => {
        setError1('');
        setSuccess1('');
        setIsLoading1(true);
        createStyleValue(jwt._id, jwt.accessToken, newValue)
            .then((data) => {
                if (data.success){
                    setStyleValues([...styleValues, data.styleValue]);
                    setSuccess1(data.success);
                    setTimeout(() => {
                        setSuccess1('');
                    }, 3000);
                }
                else {
                    setError1(data.error);
                    setTimeout(() => {
                        setError1('');
                    }, 3000);
                }
            })
            .catch((error) => {
                setError1('Sever error');
                setTimeout(() => {
                    setError1('');
                }, 3000);
            })
            .finally(() => setIsLoading1(false));
    };

    return (
        <View style={styles.container} key={key || 0}>
            {!isLoading && !error && (
                <>
                    <Text style={styles.title}>{styleName}</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.wrapper}>
                            <FlatList
                                nestedScrollEnabled
                                numColumns={1}
                                data={left}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => handleAdd(item, index)}
                                    >
                                        <Text style={styles.content}>{item.name}</Text>
                                        <Icon name='chevron-forward' style={styles.icon} />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item._id}
                            />
                        </View>

                        <View style={styles.wrapper}>
                            <FlatList
                                nestedScrollEnabled
                                numColumns={1}
                                data={right}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => handleRemove(item, index)}
                                    >
                                        <Text style={styles.content}>{item.name}</Text>
                                        <Icon name='close' style={styles.icon} />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item._id}
                            />
                        </View>
                    </View>

                    <View style={styles.container}>
                        {isLoading1 && <Spinner />}
                        {error1 ? <Alert type='error' content={error1} /> : null}
                        {success1 ? <Alert type='success' content={success1} /> : null}
                    </View>

                    <View style={styles.rowContainer}>
                        <View style={{flex: 1,}}>
                            <Input
                                title={`Add New Value For ${styleName}`}
                                value={newValue.name}
                                isValid={newValue.isValidName}
                                feedback="Please provide a valid value."
                                validator="nullable"
                                onChange={(value) =>
                                    handleChange('name', 'isValidName', value)
                                }
                                onValidate={(flag) =>
                                    handleValidate('isValidName', flag)
                                }
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.btn}
                            onPress={handleSubmit}
                        >
                            <Icon name='add-circle' style={[styles.icon, { color: Colors.primary, fontSize: 20 }]} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {isLoading && <Spinner />}
            {error ? <Alert type="error" /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 6,
        marginBottom: 12,
    },
    rowContainer :{
        flexDirection: 'row',
    },
    wrapper: {
        flex: 1,
        margin: 6,
        marginBottom: 12,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 6,
        height: 240,
        padding: 6,
    },
    form: {

    },
    item :{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 1,
        margin: 1,
        backgroundColor: Colors.white,
    },
    title: {
        margin: 6,
    },
    content: {
        margin: 6,
        fontSize: 16,
        color: Colors.black,
    },
    icon: {
        fontSize: 16,
        color: Colors.black,
        margin: 3,
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
});

export default StyleValueSelect;