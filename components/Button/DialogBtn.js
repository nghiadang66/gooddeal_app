import React, { useState } from 'react';
import { StyleSheet, Modal, View, Text, TouchableHighlight, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../themes/Colors';

const dimensions = Dimensions.get('screen');

const DialogBtn = ({ icon='ellipsis-vertical', color='primary', background = false, message='', items=[] }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModalVisibility = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={styles.container}>
            <TouchableHighlight
                underlayColor={Colors.highMuted}
                style={[styles.button, background && { backgroundColor: Colors.light }]}
                onPress={toggleModalVisibility}
            >
                <Icon name={icon} style={[styles.icon, { color: Colors[color] }]} />
            </TouchableHighlight>
            
            <Modal 
                animationType="fade" 
                transparent={true}
                visible={isModalVisible} 
                presentationStyle="overFullScreen" 
                onDismiss={toggleModalVisibility}
                onRequestClose={toggleModalVisibility}
            >
                <View style={styles.viewWrapper}>
                <TouchableWithoutFeedback onPress={toggleModalVisibility}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                    <View style={styles.modalView}>
                        {message ? (
                            <View style={styles.option}>
                                <Text style={styles.message}>
                                    {message}
                                </Text>
                            </View>
                        ) : null}

                        {items.map((item, index) => (
                            <TouchableHighlight
                                key={index}
                                underlayColor={Colors.highMuted}
                                style={styles.option}
                                onPress={item.onPress}
                            >
                                <Text style={styles.text}>
                                    {item.title}
                                </Text>
                            </TouchableHighlight>
                        ))}

                        <TouchableHighlight
                            underlayColor={Colors.highMuted}
                            style={styles.option}
                            onPress={toggleModalVisibility}
                        >
                            <Text style={styles.text}>
                                Close
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    viewWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.shadow,
    },
    modalView: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        elevation: 6,
        transform: [{ translateX: -(dimensions.width * 0.4) }, 
                    { translateY: -90 }],
        width: dimensions.width * 0.8,
        backgroundColor: Colors.white,
        borderRadius: 2,
        paddingVertical: 12,
    },
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        fontSize: 24,
    },
    option: {
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
    },
    message: {
        fontSize: 16,
    },
    text: {
        fontSize: 16,
        color: Colors.primary,
    },
});

export default DialogBtn;