import React from "react";
import { StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const Search = ({ placeholder='Search...', onChangeText=()=>{}, value='' }) => (
    <SearchBar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        searchIcon={<Icon name={'search'} style={styles.iconSearch} />}
    />
);

const styles = StyleSheet.create({
    searchBarContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 12,
    },
    inputContainer: {
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.white,
    },
    iconSearch: {
        fontSize: 24,
        color: Colors.primary,
    },
    input: {
        height: 32,
        marginLeft: 0,
    },
});

export default Search;