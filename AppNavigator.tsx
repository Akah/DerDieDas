import 'react-native-gesture-handler';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';

import { SearchScreen } from './screens/SearchScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MoreScreen } from './screens/MoreScreen';

const { Screen, Navigator } = createBottomTabNavigator();

const Navigation: React.FC = () => {
    return (
	<Navigator>
	    <Screen
		name="Search"
		component={SearchScreen}
		options={{ tabBarIcon: ({ color, size }) => <Icon source={"magnify"} size={size} color={color} /> }}
	    />
	    <Screen
		name="Home"
		component={HomeScreen}
		options={{ tabBarIcon: ({ color, size }) => <Icon source={"home"} size={size} color={color} /> }}
	    />
	    <Screen
		name="More"
		component={MoreScreen}
		options={{ tabBarIcon: ({ color, size }) => <Icon source={"menu"} size={size} color={color} /> }}
	    />
	</Navigator>
    );
}

export default Navigation;
