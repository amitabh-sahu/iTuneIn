import React, { useContext, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioContext } from '../context/AudioProvider';
import AudioListItem from '../components/AudioListItem';
import colors from '../misc/colors';
import { MaterialIcons } from '@expo/vector-icons';
import SelectModal from '../components/SelectModal';

const PlaylistDetail = (props) => {
    const playlist = props.route.params;
    const [visible, setvisible] = useState(false);
    const [allAudios, setallAudios] = useState(playlist.audios);
    const { playbackObj, currentAudio, isPlayListRunning, activePlaylist, selectedAudios, updateState } = useContext(AudioContext);

    const addAudiosToPlaylist = async () => {
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const list = JSON.parse(result);
            const updatedPlaylist = await list.filter((each) => {
                if (each.id === playlist.id) {
                    for (let i = 0; i < selectedAudios?.length; i++) {
                        if (each.audios.findIndex(({ id }) => id === selectedAudios[i].id) == -1) {
                            each.audios.push(selectedAudios[i])
                        }
                    }
                    setallAudios(each.audios);
                }
                return each;
            });
            updateState({ selectedAudios: [], playlist: [...updatedPlaylist] });
            await AsyncStorage.setItem('playlist', JSON.stringify([...updatedPlaylist]));
        }
        setvisible(false);
    };

    const deleteAudioFromPlaylist = async (audio) => {
        if (isPlayListRunning && currentAudio.id === audio.id) {
            await playbackObj.stopAsync();
            await playbackObj.unloadAsync();
            updateState({ isPlayListRunning: false, activePlaylist: [], playbacPosition: 0, isPlaying: false, soundObj: null });
        }

        const updatedAudios = allAudios.filter((item) => item.id !== audio.id);
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const list = JSON.parse(result);
            const updatedPlaylist = list.filter((each) => {
                if (each.id === playlist.id) {
                    each.audios = updatedAudios;
                }
                return each;
            });
            updateState({ playlist: updatedPlaylist });
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
        }
        setallAudios(updatedAudios);
    };

    const deletePlaylist = async () => {
        if (isPlayListRunning && activePlaylist.id === playlist.id) {
            await playbackObj.stopAsync();
            await playbackObj.unloadAsync();
            updateState({ isPlayListRunning: false, activePlaylist: [], playbacPosition: 0, isPlaying: false, soundObj: null });
        }

        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const list = JSON.parse(result);
            const updatedPlaylist = list.filter((each) => each.id !== playlist.id);
            updateState({ playlist: updatedPlaylist });
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist));
        }
        props.navigation.goBack();
    };

    return (
        <View>
            <View style={styles.spaceBetweenContainer}>
                <Text numberOfLines={1} style={styles.heading}>{playlist.title}</Text>
                <View style={styles.flexRow}>
                    <MaterialIcons name="add" size={30} color={colors.FONT_MEDIAM} onPress={() => setvisible(true)} />
                    <Text>  </Text>
                    <MaterialIcons name="delete-forever" size={30} color="red" onPress={deletePlaylist} />
                </View>
            </View>
            {allAudios.length ? (
                <FlatList
                    data={allAudios}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={
                        ({ item }) => (
                            <AudioListItem
                                item={item}
                                optionPressHandler={() => deleteAudioFromPlaylist(item)}
                                isActive={currentAudio.id === item.id}
                                optionIcon="delete-forever"
                                playlistInfo={{ isPlayListRunning: true, activePlaylist: playlist }}
                            />
                        )
                    }
                />
            ) : (
                <Text style={styles.playlistCount}>No audio found inside the playlist. Add songs using plus button.</Text>
            )}
            <SelectModal visible={visible} target={playlist} handleClose={() => setvisible(false)} handleDone={addAudiosToPlaylist} />
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.ACTIVE_BG,
    },
    spaceBetweenContainer: {
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.FONT_MEDIAM,
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    playlistCount: {
        color: colors.FONT_MEDIAM,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default PlaylistDetail;