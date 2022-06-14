import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { listStyleByCategory } from '../../services/style';
import StyleValueSelect from './StyleValueSelect';
import Colors from '../../themes/Colors';
import Spinner from '../Other/Spinner';
import Alert from '../Other/Alert';
import useToggle from '../../hooks/useToggle';
import Icon from 'react-native-vector-icons/Ionicons';
import { createTwoButtonAlert } from '../Other/Confirm';
import { groupByStyle } from '../../helper/groupBy';

const StyleSelect = ({
    defaultValue,
    selectedValues = [],
    categoryId = '',
    onSet = () => {},
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [styles, setStyles] = useState([]);
    const [select, setSelect] = useState([]);
    const [noChange, toggleNoChange] = useToggle(true);
    const [hasNoChange, setHasNoChange] = useState(true);

    const init = () => {
        if (!categoryId) return;
        setError('');
        setIsLoading(true);
        listStyleByCategory(categoryId)
            .then(data => {
                setStyles(data.styles);
                if (!defaultValue) onSet([]);
                else {
                    for (let si of defaultValue.map(v => v.styleId._id)) {
                        if (data.styles.map(s => s._id).indexOf(si) === -1) {
                            onSet([]);
                            toggleNoChange(false);
                            setHasNoChange(false);
                            return;
                        };
                    }
                }
            })
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        init();
    }, [categoryId, defaultValue]);

    const handleChange = (values) => {
        setSelect(values)
        if (!defaultValue || !noChange) onSet(values);
    }

    const handleNoChange = () => {
        if (!hasNoChange) {
            createTwoButtonAlert('No active', ()=>{}, 'Category was changed, please choose new style values.');
            return;
        }
        
        noChange ? onSet(select) : onSet(defaultValue.map(value => value._id));
        toggleNoChange();
    }
    
    return (
        <View style={styleSheets.container}>
            {!isLoading && (
                <>
                    {styles.length > 0 ? (
                        <>
                            {styles.map((style, index) => (
                                <StyleValueSelect
                                    key={index}
                                    selectedValues={select}
                                    styleId={style._id}
                                    styleName={style.name}
                                    onSet={(values) => handleChange(values)}
                                />
                            ))}
                        </>
                    ) : (
                        <Text style={styleSheets.content}>This category does not have styles.</Text>
                    )}
                </>
            )}
            {isLoading && <Spinner />}
            {error ? <Alert type='error' content={error} /> : null}

            {defaultValue && (
                <View style={styleSheets.container}>
                    <Text style={styleSheets.title}>Undo {'(No change styles)'}</Text>
                    <View style={styleSheets.rowContainer}>
                        <View style={[styleSheets.container, {alignItems: 'flex-start'}]}>
                            {groupByStyle(defaultValue).map((list, index) => 
                                <View key={index} style={[styleSheets.rowContainer, { flexWrap: 'wrap', justifyContent: 'center', }]}>
                                    <Text >{list[0].styleId.name}: </Text>
                                    {list.map((value, index) => <Text style={styleSheets.item} key={index}>{value.name}</Text>)}
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styleSheets.btn}
                            onPress={handleNoChange}
                        >
                            <Icon style={[styleSheets.icon, noChange && { color: Colors.primary }]} name={noChange ? 'checkmark-circle' : 'checkmark-circle-outline'} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styleSheets = StyleSheet.create({
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
    item: {
        fontSize: 16,
        padding: 3,
        marginBottom: 3,
        marginHorizontal: 3,
        borderRadius: 3,
        backgroundColor: Colors.white,
    },
});

export default StyleSelect;