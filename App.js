import React from 'react';
import { View } from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator, StackNavigator} from 'react-navigation-stack';
import Authentication from './screens/Authentication';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Settings from './screens/Settings';
import Profile from './screens/Profile';
import CurrDay from './screens/CurrDay';
import Activities from './screens/Activities';
import ViewActivities from './screens/ViewActivities';
import ViewMeals from './screens/ViewMeals';
import Meals from './screens/Meals';
import ViewFoods from './screens/ViewFoods';
import Foods from './screens/Foods';

const MainNavigator = createStackNavigator(
	{
		Today: {screen: CurrDay},
		Settings: {screen: Settings},
		Profile: {screen: Profile},
		ViewActivities: {screen: ViewActivities},
		Activities: {screen: Activities},
		ViewMeals: {screen: ViewMeals},
		Meals: {screen: Meals},
		ViewFoods: {screen: ViewFoods},
		Foods: {screen: Foods}
	},
	{
		initialRouteName: 'Today',
		headerMode: 'none'
	}
);

const AuthNavigator = createStackNavigator(
	{
		Home: {screen: Authentication},
		Login: {screen: Login},
		Signup: {screen: Signup},
		MainProg: {screen: MainNavigator}
	},
	{
		initialRouteName: 'Home',
		headerMode: 'none'
	}
);

const App = createAppContainer(AuthNavigator);

export default App;