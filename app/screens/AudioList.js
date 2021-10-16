import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import AudioListItem from '../components/AudioListItem';
import OptionModal from '../components/OptionModal';
import { AudioContext } from '../context/AudioProvider';
import colors from '../misc/colors';

const AudioList = () => {
    const [visible, setVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const { audioFiles, currentAudioIndex } = useContext(AudioContext);

    return (
        <>
            {audioFiles.length ? (
                <FlatList
                    data={audioFiles}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <AudioListItem
                            item={item}
                            optionPressHandler={() => {
                                setCurrentItem(item);
                                setVisible(true);
                            }}
                            isActive={currentAudioIndex === index}
                            optionIcon="more-vert"
                        />
                    )}
                />
            ) : (
                <Text style={styles.audioFilesCount}>No audio found on this device.</Text>
            )}
            <OptionModal visible={visible} handleClose={() => setVisible(false)} item={currentItem} />
        </>
    );
};

const styles = StyleSheet.create({
    audioFilesCount: {
        color: colors.FONT_MEDIAM,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default AudioList;