import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../themes/Colors";

const Logo = ({ background = true }) => {
    return (
        <View
            style={styles.container}
        >
            <View style={[styles.innerView, !background && styles.noBackgroundInnerView]}>
                <Text
                    style={[styles.innerText, !background && styles.noBackgroundInnerText]}
                >
                    Good
                </Text>
            </View>
            <Text
                style={[styles.baseText, !background && styles.noBackgroundBaseText]}
            >
                Deal!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1,
    },
    innerView: {
        paddingRight: 6,
        paddingLeft: 6,
        paddingTop: 1,
        borderRadius: 6,
        marginRight: 6,
        backgroundColor: Colors.white,
    },
    noBackgroundInnerView: {
        backgroundColor: Colors.primary,
    },
    innerText: {
        fontFamily: 'LuckiestGuyRegular',
        fontSize: 32,
        color: Colors.primary,
    },
    noBackgroundInnerText: {
        color: Colors.white,
    },
    baseText: {
        fontFamily: 'LuckiestGuyRegular',
        fontSize: 32,
        textTransform: 'uppercase',
        color: Colors.white,
    },
    noBackgroundBaseText: {
        color: Colors.primary,
    },
});

export default Logo;