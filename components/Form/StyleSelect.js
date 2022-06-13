import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { listStyleByCategory } from '../../services/style';
import StyleValueSelect from './StyleValueSelect';
import Colors from '../../themes/Colors';
import Spinner from '../Other/Spinner';
import Alert from '../Other/Alert';

const StyleSelect = ({
    defaultValue,
    selectedValues = [],
    categoryId = '',
    onSet = () => {},
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [styles, setStyles] = useState([]);

    const init = () => {
        if (!categoryId) return;
        setError('');
        setIsLoading(true);
        listStyleByCategory(categoryId)
            .then(data => {
                setStyles(data.styles);
                if (defaultValue && defaultValue[0].styleId.categoryId._id == categoryId) {
                    onSet(defaultValue.map(value => value._id));
                }
                else {
                    onSet([]);
                }
            })
            .catch(error => setError('Server Error'))
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        init();
    }, [categoryId]);
    
    return (
        <View style={styles.container}>
            {!isLoading && !error && (
                <>
                    {styles.length > 0 ? (
                        <>
                            {styles.map((style, index) => (
                                <StyleValueSelect
                                    key={index}
                                    selectedValues={selectedValues}
                                    styleId={style._id}
                                    styleName={style.name}
                                    onSet={(values) => onSet(values)}
                                />
                            ))}
                        </>
                    ) : (
                        <Text style={styles.content}>This category does not have styles.</Text>
                    )}
                </>
            )}
            {isLoading && <Spinner />}
            {error ? <Alert type='error' content={error} /> : null}
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

export default StyleSelect;