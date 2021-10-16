import React, { useContext } from 'react';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import colors from '../misc/colors';
import { convertTime } from '../misc/helper';
import { selectAudio } from '../misc/audioController';
import { AudioContext } from '../context/AudioProvider';

const AudioListItem = ({ item, optionPressHandler, isActive, optionIcon, playlistInfo = {} }) => {
    const context = useContext(AudioContext);

    const handlePlayPause = async () => {
        await selectAudio(item, context, playlistInfo);
    };

    return (
        <View style={[styles.container, { backgroundColor: isActive ? colors.ACTIVE_BG : 'transparent' }]}>
            <TouchableWithoutFeedback onPress={handlePlayPause}>
                <View style={styles.containerLeft}>
                    <View style={[styles.thumbnail, { backgroundColor: !isActive ? colors.FONT_LIGHT : 'transparent' }]}>
                        {isActive ? (
                            context.isPlaying ? (
                                <Ionicons name="pause" size={24} color="black" />
                            ) : (
                                <Ionicons name="play" size={24} color="black" />
                            )
                        ) : (
                            <Text style={styles.thumbnailText}>{item.filename[0].toUpperCase()}</Text>
                        )}
                    </View>
                    <View style={styles.titleContainer}>
                        <Text numberOfLines={1} style={styles.title}>{item.filename}</Text>
                        <Text numberOfLines={1} style={{ color: colors.FONT_MEDIAM }}>{convertTime(item.duration)}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback >
            <View style={styles.containerRight}>
                <MaterialIcons name={optionIcon} size={24} color={colors.FONT_MEDIAM} style={{ paddingHorizontal: 10 }} onPress={optionPressHandler} />
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: colors.FONT_LIGHT,
    },
    containerLeft: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    containerRight: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        borderRadius: 25,
    },
    thumbnailText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.FONT
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        width: width - 150,
    },
    title: {
        fontSize: 16,
        color: colors.FONT,
    }
});

export default AudioListItem;