import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import AllPlaylists from '../screens/AllPlaylists';
import PlaylistDetail from '../screens/PlaylistDetail';
import colors from '../misc/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const PlaylistScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AllPlaylists" component={AllPlaylists} />
            <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <Tab.Navigator tabBarActiveTintColor>
            <Tab.Screen name="AudioList" component={AudioList} options={{
                tabBarIcon: ({ color, size }) => (<MaterialIcons name="headset" size={size} color={color} />),
                tabBarActiveTintColor: colors.ACTIVE_BG,
            }} />
            <Tab.Screen name="Player" component={Player} options={{
                tabBarIcon: ({ color, size }) => (<MaterialIcons name="equalizer" size={size} color={color} />),
                tabBarActiveTintColor: colors.ACTIVE_BG,
            }} />
            <Tab.Screen name="Playlist" component={PlaylistScreen} options={{
                tabBarIcon: ({ color, size }) => (<MaterialIcons name="library-music" size={size} color={color} />),
                tabBarActiveTintColor: colors.ACTIVE_BG,
            }} />
        </Tab.Navigator>
    );
};

export default AppNavigator;