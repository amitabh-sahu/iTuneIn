import { useNavigation } from '@react-navigation/core';
import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import colors from '../misc/colors';

const OptionModal = ({ visible, handleClose, item }) => {
    const { updateState } = useContext(AudioContext);
    const navigation = useNavigation();
    const handleAddToPlaylist = () => {
        updateState({ addToPlaylist: item });
        navigation.navigate('Playlist');
    };

    return (
        <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
            <View style={styles.modal}>
                <Text numberOfLines={1} style={styles.title}>{item.filename}</Text>
                <View style={styles.optionsContainer}>
                    <TouchableWithoutFeedback onPress={handleAddToPlaylist}>
                        <Text style={styles.options}>Add to Playlist</Text>
                    </TouchableWithoutFeedback >
                </View>
            </View>
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.MODAL_BG }]} />
            </TouchableWithoutFeedback >
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        padding: 20,
        backgroundColor: colors.APP_BG,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    title: {
        fontSize: 20,
        color: colors.FONT_MEDIAM,
    },
    optionsContainer: {
        paddingVertical: 10,
    },
    options: {
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.FONT_MEDIAM,
    },
});

export default OptionModal;