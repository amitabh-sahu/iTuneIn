import React, { useContext, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import colors from '../misc/colors';
import { AudioContext } from '../context/AudioProvider';
import { changeAudio, moveAudio, pause, selectAudio } from '../misc/audioController';
import { convertTime } from '../misc/helper';

const Player = () => {
    const [currentPosition, setcurrentPosition] = useState(0);
    const context = useContext(AudioContext);
    const { playbackObj, currentAudio, audioFiles, totalAudioCount, isPlaying, isPlayListRunning, activePlaylist, playbackPosition, playbackDuration } = context;
    const numberrOfAudios = isPlayListRunning ? activePlaylist.audios.length : totalAudioCount;
    const audioIndex = isPlayListRunning ? activePlaylist.audios.findIndex(({ id }) => id === currentAudio.id) : audioFiles.findIndex(({ id }) => id === currentAudio.id);

    const calculateSeekbar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    };

    const handlePlayPause = async () => {
        const audio = currentAudio.uri ? currentAudio : audioFiles[0];
        await selectAudio(audio, context);
    };

    const handlePrev = () => {
        const isFirst = audioIndex === 0
        const index = isFirst ? numberrOfAudios - 1 : audioIndex - 1;
        changeAudio(index, context);
    };

    const handleNext = () => {
        const index = (audioIndex + 1) % numberrOfAudios;
        changeAudio(index, context);
    };

    return (
        <View style={styles.container}>
            {isPlayListRunning && (
                <View style={styles.spaceBetweenContainer}>
                    <Text style={styles.fontColorMediam}><Text style={{ fontWeight: "bold" }}>Playlist: </Text>{activePlaylist.title}</Text>
                    <Text style={styles.fontColorMediam}>{`${(activePlaylist.audios.findIndex(({ id }) => id === currentAudio.id)) + 1}/${activePlaylist.audios.length}`}</Text>
                </View>
            )}
            <Text numberOfLines={1} style={styles.title}>{currentAudio.filename}</Text>
            <MaterialCommunityIcons name="music-box" size={300} color={isPlaying ? colors.ACTIVE_BG : colors.FONT_LIGHT} />
            <View style={styles.spaceBetweenContainer}>
                <Text style={styles.fontColorMediam}>{currentPosition ? currentPosition : convertTime(playbackPosition / 1000) ? convertTime(playbackPosition / 1000) : '00:00'}</Text>
                <Text style={styles.fontColorMediam}>{convertTime(currentAudio.duration - (playbackPosition / 1000))}</Text>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={calculateSeekbar()}
                minimumTrackTintColor={colors.ACTIVE_BG}
                maximumTrackTintColor="#000000"
                onValueChange={(value) => { setcurrentPosition(convertTime(value * currentAudio.duration)) }}
                onSlidingStart={async () => {
                    if (!isPlaying) return;
                    try {
                        await pause(playbackObj);
                    } catch (error) {
                        console.log('errorn inside onSlidingStart', error);
                    }
                }}
                onSlidingComplete={async (value) => {
                    moveAudio(value, context)
                    setcurrentPosition(0);
                }}
            />
            <View style={styles.controler}>
                <Ionicons name="md-play-skip-back" size={30} color={colors.FONT} onPress={handlePrev} />
                <TouchableWithoutFeedback onPress={handlePlayPause}>
                    {!isPlaying ? (
                        <Ionicons name="md-play-circle" size={60} color={colors.FONT} style={{ paddingHorizontal: 20 }} />
                    ) : (
                        <Ionicons name="md-pause-circle" size={60} color={colors.FONT} style={{ paddingHorizontal: 20 }} />
                    )}
                </TouchableWithoutFeedback >
                <Ionicons name="md-play-skip-forward" size={30} color={colors.FONT} onPress={handleNext} />
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    title: {
        fontSize: 20,
        color: colors.FONT,
    },
    spaceBetweenContainer: {
        width: width - 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fontColorMediam: {
        color: colors.FONT_MEDIAM
    },
    slider: {
        height: 30,
        width: width - 50,
    },
    controler: {
        flex: 1,
        width: width - 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Player;