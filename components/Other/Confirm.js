import React from "react";
import { Alert } from "react-native";

export const createTwoButtonAlert = (
    title = 'Confirm Dialog', 
    onConfirm = () => {},
    message = 'Are you sure about that?',
    onCancel = () => {}, 
) => Alert.alert(
        title,
        message,
        [
            {
                text: "Cancel",
                onPress: onCancel,
                style: "cancel",
            },
            { 
                text: "OK", 
                onPress: onConfirm,
            }
        ]
    );