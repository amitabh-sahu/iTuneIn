import React, { useState } from 'react';
import { View, Modal, TextInput, StyleSheet, Button, Dimensions, TouchableWithoutFeedback } from 'react-native';
import colors from '../misc/colors';

const InputModal = ({ visible, handleClose, handleSubmit }) => {
    const [inputVal, setInputVal] = useState('');

    const onSubmit = () => {
        if (!inputVal.trim()) {
            handleClose();
        }
        else {
            handleSubmit(inputVal);
            setInputVal('');
            handleClose();
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <TextInput placeholder="Enter name of the playlist" style={styles.input} value={inputVal} onChangeText={(val) => setInputVal(val)} />
                    <Button onPress={onSubmit} title="done" color={colors.FONT_MEDIAM} accessibilityLabel="done button" />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.modalBG} />
            </TouchableWithoutFeedback >
        </Modal>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalBG: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.MODAL_BG,
        zIndex: -1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: width - 50,
        height: 150,
        borderRadius: 10,
        backgroundColor: colors.APP_BG,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 25,
    },
    input: {
        width: width - 100,
        borderBottomWidth: 1,
        borderBottomColor: colors.FONT_MEDIAM,
        paddingVertical: 5,
        marginBottom: 20,
    },
});

export default InputModal;