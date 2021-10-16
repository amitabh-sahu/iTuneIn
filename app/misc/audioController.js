export const play = async (obj, uri) => {
    try {
        return (await obj.loadAsync({ uri }, { shouldPlay: true, progressUpdateIntervalMillis: 1000 }));
    } catch (error) {
        console.log('Play helper func: ', error);
    }
};

export const pause = async (obj) => {
    try {
        return (await obj.setStatusAsync({ shouldPlay: false }));
    } catch (error) {
        console.log('Pause helper func: ', error);
    }
};

export const resume = async (obj) => {
    try {
        return (await obj.playAsync());
    } catch (error) {
        console.log('Resume helper func: ', error);
    }
};

export const anotherAudio = async (obj, uri) => {
    try {
        await obj.stopAsync();
        await obj.unloadAsync();
        return (await play(obj, uri));
    } catch (error) {
        console.log('Another audio helper func: ', error);
    }
};

export const changeAudio = async (index, context) => {
    try {
        const { audioFiles, playbackObj, soundObj, isPlayListRunning, activePlaylist, updateState, playbackStatusUpdate } = context;
        const audio = isPlayListRunning ? activePlaylist.audios[index] : audioFiles[index];
        let status = null;
        if (soundObj === null) {
            status = await play(playbackObj, audio.uri);
            playbackObj.setOnPlaybackStatusUpdate(playbackStatusUpdate);
        }
        if (soundObj) {
            status = await anotherAudio(playbackObj, audio.uri);
        }
        updateState({ currentAudio: audio, soundObj: status, isPlaying: true, currentAudioIndex: audioFiles.findIndex(({ id }) => id === audio.id) });
    } catch (error) {
        console.log('Change audio helper func: ', error);
    }
};

export const selectAudio = async (item, context, playlistInfo = {}) => {
    try {
        const { audioFiles, playbackObj, soundObj, currentAudio, updateState, playbackStatusUpdate } = context;
        if (soundObj === null) {
            const status = await play(playbackObj, item.uri);
            const index = audioFiles.findIndex(({ id }) => id === item.id);
            updateState({ currentAudio: item, soundObj: status, isPlaying: true, currentAudioIndex: index, isPlayListRunning: false, activePlaylist: [], ...playlistInfo });
            return playbackObj.setOnPlaybackStatusUpdate(playbackStatusUpdate);
        }
        if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === item.id) {
            const status = await pause(playbackObj);
            return updateState({ soundObj: status, isPlaying: false, playbackPosition: status.positionMillis });
        }
        if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === item.id) {
            const status = await resume(playbackObj);
            return updateState({ soundObj: status, isPlaying: true, playbackPosition: status.positionMillis });
        }
        if (soundObj.isLoaded && currentAudio.id !== item.id) {
            const status = await anotherAudio(playbackObj, item.uri);
            const index = audioFiles.findIndex(({ id }) => id === item.id);
            return updateState({ currentAudio: item, soundObj: status, isPlaying: true, currentAudioIndex: index, isPlayListRunning: false, activePlaylist: [], ...playlistInfo });
        }
    } catch (error) {
        console.log('Select audio helper func: ', error);
    }
};

export const moveAudio = async (value, context) => {
    const { playbackObj, soundObj, isPlaying, updateState } = context;
    if (soundObj === null) return;
    try {
        await playbackObj.setPositionAsync(Math.round(soundObj.durationMillis * value));
        if (isPlaying) {
            await resume(playbackObj);
        }
    } catch (error) {
        console.log('errorn inside onSlidingComplete', error);
    }
};