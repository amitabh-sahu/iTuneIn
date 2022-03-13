# iTuneIn
The iTuneIn is a basic audio player app build using react-native expo cli.

## Info
- When app launches for the first time it ask for permission to access to media file on the device as shown in the image 1.<br />
- Once app get access to media files on device audio list screen of app shows all of the audio files in the screen as shown in the image 2.<br />
- First click on any of audio file it starts play and second click on same file it pause. Each file also have a more icon which give option to add that file to playlist.<br />
- Using bottom navigation in the bottom of the app you can navigate to other screen of the app like player and playlist screen.<br />
- Player screen of the app has all essential features of a audio player like play/pause, next, previous, and status bar which can be also use to foreword and backward the audio  as shown in the image 3.<br />
- Last screen of the app is playlist screen where all of your playlist are listed. to create new playlist there is a button in right bottom corner of the screen which open a modal to get input for playlist name as shown in the image 4.<br />
- To explore more any playlist you can click on that playlist as shown in the image 5. Here ‘add’ icon use to add audio files to the playlist and red colored ‘bin’ icon use to delete entire playlist. The ‘bin’ icon show with each audio files are use to delete that file from the playlist.<br />

| image: 1 | image: 2 | image: 3 | image: 4 | image: 5 |
|:--:|:--:|:--:|:--:|:--:|
| ![first_launch_popup](https://github.com/amitabh-sahu/iTuneIn/blob/master/assets/app_img/first_launch_popup.jpg) | ![audiolist_screen](https://github.com/amitabh-sahu/iTuneIn/blob/master/assets/app_img/audiolist_screen.jpg) | ![player_screen](https://github.com/amitabh-sahu/iTuneIn/blob/master/assets/app_img/player_screen.jpg) | ![playlist_screen](https://github.com/amitabh-sahu/iTuneIn/blob/master/assets/app_img/playlist_screen.jpg) | ![create_playlist](https://github.com/amitabh-sahu/iTuneIn/blob/master/assets/app_img/create_playlist.jpg) |

## Technologies
* react-native
* expo
* expo-av

## Setup
Open cli and use these commands:
```shell
git clone https://github.com/amitabh-sahu/iTuneIn.git
cd iTuneIn
npm install
npm start
```
Here are several options provided by expo to see app.