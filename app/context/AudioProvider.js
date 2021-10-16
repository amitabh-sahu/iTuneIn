import React, { Component, createContext } from 'react';
import { Alert, Text, View } from 'react-native';
import { getAssetsAsync, getPermissionsAsync, requestPermissionsAsync } from 'expo-media-library';
import { Audio } from 'expo-av';
import { anotherAudio } from '../misc/audioController';

export const AudioContext = createContext();

export class AudioProvider extends Component {
    constructor(prop) {
        super(prop)
        this.state = {
            audioFiles: [],
            playlist: [],
            addToPlaylist: null,
            permissionError: false,
            playbackObj: new Audio.Sound(),
            soundObj: null,
            currentAudio: {},
            currentAudioIndex: null,
            totalAudioCount: null,
            isPlaying: false,
            isPlayListRunning: false,
            activePlaylist: [],
            selectedAudios: [],
            playbackPosition: null,
            playbackDuration: null,
        }
    }

    updateState = (newState = {}) => {
        this.setState({ ...this.state, ...newState });
    }

    permissionAlert = () => {
        Alert.alert('Permission Required', 'This app needs to read audio files!', [{
            text: 'Ok',
            onPress: () => this.getPermission()
        }, {
            text: 'Cancle',
            onPress: () => {
                this.permissionAlert()
            }
        }])
    }

    getAudioFiles = async () => {
        const { audioFiles, dataProvider } = this.state;
        let media = await getAssetsAsync({ mediaType: 'audio' });
        media = await getAssetsAsync({ mediaType: 'audio', first: media.totalCount });
        this.setState({ ...this.state, totalAudioCount: media.totalCount, audioFiles: [...audioFiles, ...media.assets] });
    }

    getPermission = async () => {
        const permission = await getPermissionsAsync();
        if (permission.granted) {
            this.getAudioFiles();
        }
        else {
            if (permission.canAskAgain) {
                const { status, canAskAgain } = await requestPermissionsAsync();
                if (status === 'denied') {
                    if (canAskAgain) {
                        this.permissionAlert();
                    }
                    else {
                        this.setState({ ...this.state, permissionError: true });
                    }
                }
                if (status === 'granted') {
                    this.getAudioFiles();
                }
            }
            else {
                this.setState({ ...this.state, permissionError: true });
            }
        }
    }

    playbackStatusUpdate = async (playbackStatus) => {
        const { audioFiles, playbackObj, currentAudio, currentAudioIndex, isPlayListRunning, activePlaylist } = this.state;
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            this.updateState({ playbackPosition: playbackStatus.positionMillis, playbackDuration: playbackStatus.durationMillis });
        }
        if (playbackStatus.didJustFinish) {
            let nextAudioIndex = currentAudioIndex + 1;
            let nextAudio = audioFiles[nextAudioIndex];
            if (isPlayListRunning) {
                const indexOnPlaylist = activePlaylist.audios.findIndex(({ id }) => id === currentAudio.id);
                nextAudioIndex = indexOnPlaylist + 1;
                nextAudio = activePlaylist.audios[nextAudioIndex];
            }
            if (nextAudio) {
                const status = await anotherAudio(playbackObj, nextAudio.uri);
                this.updateState({ currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: audioFiles.findIndex(({ id }) => id === nextAudio.id) });
            }
            else {
                await playbackObj.unloadAsync();
                this.updateState({ currentAudio: audioFiles[0], soundObj: null, isPlaying: false, currentAudioIndex: 0, playbackPosition: null, playbackDuration: null });
            }
        }
    };

    componentDidMount() {
        this.getPermission();
    }

    render() {
        const {
            audioFiles,
            playlist,
            addToPlaylist,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            currentAudioIndex,
            totalAudioCount,
            isPlaying,
            isPlayListRunning,
            activePlaylist,
            selectedAudios,
            playbackPosition,
            playbackDuration
        } = this.state;
        if (permissionError) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 25, textAlign: 'center' }}>It looks like you have't accept the permission.</Text>
                </View>
            );
        }
        else {
            return (
                <AudioContext.Provider value={{
                    audioFiles,
                    playlist,
                    addToPlaylist,
                    playbackObj,
                    soundObj,
                    currentAudio,
                    currentAudioIndex,
                    totalAudioCount,
                    isPlaying,
                    isPlayListRunning,
                    activePlaylist,
                    selectedAudios,
                    playbackPosition,
                    playbackDuration,
                    updateState: this.updateState,
                    playbackStatusUpdate: this.playbackStatusUpdate
                }}>
                    {this.props.children}
                </AudioContext.Provider>
            );
        }
    }
}

export default AudioProvider;