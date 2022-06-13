import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { regexTest, numberTest } from '../../helper/test';
import useToggle from '../../hooks/useToggle';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const Input = ({
    type='text',
    icon='pencil',
    title='Enter something', 
    value='',
    defaultValue = '',
    isValid=true,
    validator='anything',
    feedback = 'Please provide a valid value.',
    editable=true,
    onChange=()=>{}, 
    onValidate=()=>{},
}) => {
    const [showPasswordFlag, togglePasswordFlag] = useToggle(false);
    const [hasValueFlag, toggleHasValueFlag] = useToggle(false);
    const [input, setInput] = useState(value)

    const onHandleChange = (value) => {
        if (type === 'number') {
            if (regexTest('number', value)) {
                onChange(value);
                setInput(value);
            }
        }
        else {
            onChange(value);
            setInput(value);
        }
    }

    const onHandleEndEditing = (value) => {
        toggleHasValueFlag(value != '');

        if (type==='number') {
            const validatorArray = validator.split('|');
            const test = validatorArray
                .map(validatorElm => numberTest(validatorElm, value))
                .reduce((prev, curr) => prev || curr);
            onValidate(test);
        }
        else {
            const validatorArray = validator.split('|');
            const test = validatorArray
                .map(validatorElm => regexTest(validatorElm, value))
                .reduce((prev, curr) => prev || curr);
            onValidate(test);
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.wrapper, hasValueFlag && styles.activeWrapper]}>
                <Icon
                    style={styles.icon}
                    name={icon}
                />

                <TextInput
                    style={styles.input}
                    defaultValue={defaultValue}
                    value={input}
                    placeholder={title}
                    secureTextEntry={type==='password' && !showPasswordFlag}
                    keyboardType={type==='number' ? 'numeric' : 'default'}
                    editable={editable}
                    selectTextOnFocus={editable}
                    onChangeText={value => onHandleChange(value)}
                    onEndEditing={e => onHandleEndEditing(e.nativeEvent.text)}
                    onFocus={() => toggleHasValueFlag(true)}
                />

                {type==='password' && 
                    <Icon
                        style={styles.icon}
                        name={showPasswordFlag ? 'eye-off' : 'eye'}
                        onPress={togglePasswordFlag}
                    />}
            </View>
            
            {!isValid && <Text style={styles.feedback} pointerEvents='none'>{feedback}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // position: 'relative',
        paddingBottom: 24,
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 6,
        paddingHorizontal: 6,
        borderBottomWidth: 2,
        borderBottomColor: Colors.muted,
    },
    activeWrapper : {
        borderBottomColor: Colors.primary,
    },
    icon: {
        fontSize: 24,
        padding: 6,
        color: Colors.muted,
    },
    input: {
        fontSize: 16,
        padding: 6,
        flex: 1,
    },
    feedback: {
        position: 'absolute',
        left: 6,
        top: 48,
        fontSize: 12,
        color: Colors.danger,
        // flex: 1,
    },
});

export default Input;