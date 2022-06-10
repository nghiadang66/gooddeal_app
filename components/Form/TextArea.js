import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { regexTest } from '../../helper/test';
import useToggle from '../../hooks/useToggle';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const TextArea = ({
    icon='pencil',
    title='Enter something', 
    value='', 
    isValid=true,
    validator='anything',
    feedback = 'Please provide a valid value.',
    editable=true,
    numberOfLines=6,
    onChange=()=>{}, 
    onValidate=()=>{},
}) => {
    const [hasValueFlag, toggleHasValueFlag] = useToggle(false);

    const onHandleChange = (value) => {
        onChange(value);
    }

    const onHandleEndEditing = (value) => {
        toggleHasValueFlag(value != '');
        const validatorArray = validator.split('|');
        const test = validatorArray
            .map(validatorElm => regexTest(validatorElm, value))
            .reduce((prev, curr) => prev || curr);
        onValidate(test);
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
                    value={value}
                    placeholder={title}
                    editable={editable}
                    selectTextOnFocus={editable}
                    multiline={true}
                    numberOfLines={numberOfLines}
                    onChangeText={value => onHandleChange(value)}
                    onEndEditing={e => onHandleEndEditing(e.nativeEvent.text)}
                    onFocus={() => toggleHasValueFlag(true)}
                />
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

export default TextArea;