import React, { useContext, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../misc/colors'
import { AntDesign } from '@expo/vector-icons';
import InputModal from '../components/InputModal';
import { AudioContext } from '../context/AudioProvider';

const AllPlaylists = ({ navigation }) => {
    const { playlist, addToPlaylist, updateState } = useContext(AudioContext);
    const [showInputModal, setshowInputModal] = useState(false);

    const renderPlaylist = async () => {
        const result = await AsyncStorage.getItem('playlist');
        result && updateState({ playlist: JSON.parse(result) });
    };

    useEffect(() => {
        renderPlaylist();
    }, [])

    const handlePlaylistPress = async (item) => {
        if (addToPlaylist) {
            const result = await AsyncStorage.getItem('playlist');
            let updatedPlaylist = [];
            let audioDuplicate = false;
            if (result !== null) {
                const list = JSON.parse(result);
                updatedPlaylist = list.filter((each) => {
                    if (each.id === item.id) {
                        for (const audio of each.audios) {
                            if (audio.id === addToPlaylist.id) {
                                audioDuplicate = true;
                                return;
                            }
                        }
                        each.audios = [...each.audios, addToPlaylist];
                    }
                    return each;
                });
            }
            if (audioDuplicate) {
                Alert.alert(`Audio '${addToPlaylist.filename}' is already present inside the playlist.`);
                audioDuplicate = false;
                return updateState({ addToPlaylist: null });
            }
            updateState({ addToPlaylist: null, playlist: [...updatedPlaylist] });
            return await AsyncStorage.setItem('playlist', JSON.stringify([...updatedPlaylist]));
        }
        else {
            navigation.navigate('PlaylistDetail', item);
        }
    };

    const createPlaylist = async (playlistName) => {
        const audios = [];
        if (addToPlaylist) {
            audios.push(addToPlaylist);
        }
        const newList = {
            id: Date.now(),
            title: playlistName,
            audios: audios,
        }
        const updatedPlaylist = [...playlist, newList];
        updateState({ addToPlaylist: null, playlist: [...updatedPlaylist] });
        await AsyncStorage.setItem('playlist', JSON.stringify([...updatedPlaylist]));
        setshowInputModal(false);
    };

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {playlist.length ? playlist.map((item) => (
                    <TouchableOpacity key={item.id.toString()} style={styles.playlistContainer} onPress={() => handlePlaylistPress(item)}>
                        <Text style={styles.playlistName}>{item.title}</Text>
                        <Text style={styles.playlistCount}>{item.audios.length > 1 ? `${item.audios.length} Songs` : `${item.audios.length} Song`}</Text>
                    </TouchableOpacity>
                )) : (
                    <Text style={styles.playlistCount}>No playlist found. Create new playlist using plus button.</Text>
                )}
            </ScrollView>
            <View style={styles.addBtn}>
                <AntDesign name="pluscircle" size={50} color={colors.FONT} onPress={() => setshowInputModal(true)} />
            </View>
            <InputModal visible={showInputModal} handleClose={() => setshowInputModal(false)} handleSubmit={(inputVal) => createPlaylist(inputVal)} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    playlistContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginVertical: 5,
    },
    playlistName: {
        fontSize: 16,
        color: colors.FONT,
    },
    playlistCount: {
        color: colors.FONT_MEDIAM,
    },
    addBtn: {
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
});

export default AllPlaylists;