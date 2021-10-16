import React, { useContext } from 'react';
import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import colors from '../misc/colors';

const SelectModal = ({ visible, target, handleClose, handleDone }) => {
    const { audioFiles, selectedAudios, updateState } = useContext(AudioContext);

    const didSelectAudio = (item) => {
        const selectedAudiosUpdated = selectedAudios;
        let isItemSelected = selectedAudiosUpdated.filter((ele) => {
            return ele.id.includes(item.id);
        }).length > 0 ? true : false;

        if (isItemSelected) {
            const index = selectedAudiosUpdated.findIndex((obj) => obj.id === item.id);
            selectedAudiosUpdated.splice(index, 1);
        } else {
            selectedAudiosUpdated.push(item);
        }
        updateState({ selectedAudios: selectedAudiosUpdated });
    };

    const renderCell = ({ item }) => {
        let isSelected = selectedAudios.filter(each => {
            return each.id === item.id;
        }).length > 0 ? true : false;

        return (
            <TouchableOpacity onPress={() => didSelectAudio(item)}>
                <Text style={[styles.content, { backgroundColor: isSelected ? colors.ACTIVE_BG : colors.FONT_LIGHT }]} numberOfLines={1}>{item.filename}</Text>
            </TouchableOpacity >
        )
    };

    return (
        <Modal visible={visible} onRequestClose={handleClose}>
            <View style={styles.container}>
                <View style={styles.spaceBetweenContainer}>
                    <Text style={styles.heading} numberOfLines={1}>{selectedAudios.length > 1 ? `${selectedAudios.length} songs selected` : `${selectedAudios.length} song selected`}</Text>
                    <Text style={styles.heading} numberOfLines={1} onPress={handleDone}>Done</Text>
                </View>
                <FlatList
                    data={audioFiles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCell}
                />
            </View>
        </Modal>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
    spaceBetweenContainer: {
        width: width - 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.FONT_MEDIAM,
    },
    heading: {
        fontSize: 18,
        color: colors.FONT_MEDIAM
    },
    content: {
        fontSize: 16,
        color: colors.FONT_MEDIAM,
        borderRadius: 5,
        marginVertical: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
});

export default SelectModal;