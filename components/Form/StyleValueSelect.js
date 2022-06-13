import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { listActiveStyleValues } from '../../services/style';
import Colors from '../../themes/Colors';
import Spinner from '../Other/Spinner';
import Alert from '../Other/Alert';
import Icon from 'react-native-vector-icons/Ionicons';

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

    const init = () => {
        setError('');
        setIsLoading(true);
        listActiveStyleValues(styleId)
            .then((data) => {
                const newStyleValues = data.styleValues;
                const newLeft = [];
                const newRight = [];
                for (let sv of newStyleValues) {
                    if (selectedValues.indexOf(sv._id) !== -1) newRight.push(sv);
                    else newLeft.push(sv);
                }
                setStyleValues(newStyleValues);
                setLeft(newLeft);
                setRight(newRight);
            })
            .catch((error) => setError('Server error'))
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        init();
    }, [styleId]);

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

    return (
        <View style={styles.container} key={key || 0}>
            {!isLoading && !error && (
                <>
                    <Text style={styles.title}>{styleName}</Text>
                    <View style={styles.rowContainer}>
                        <View style={[styles.container, styles.wrapper]}>
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

                        <View style={[styles.container, styles.wrapper]}>
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
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 6,
        height: 240,
        padding: 6,
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
});

export default StyleValueSelect;