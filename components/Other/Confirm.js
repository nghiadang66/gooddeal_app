import React from "react";
import { Alert } from "react-native";

export const createTwoButtonAlert = (
    title = 'Confirm Dialog', 
    onConfirm = () => console.log("OK Pressed"),
    message = 'Are you sure about that?',
    onCancel = () => console.log("Cancel Pressed"), 
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