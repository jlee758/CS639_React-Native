import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	backButtonContainer: {
		position: 'absolute',
		top: 70,
		left: 10
	},
	backButton: {
		alignItems: 'center',
		width: 50,
		height: 50
	},
	settingsContainer: {
		position: 'absolute',
		top: 70,
		right: 10
	},
	settingButton: {
		alignItems: 'center',
		width: 50,
		height: 50
	},
	textTitle: {
		fontSize: 30,
		color: '#27ADA0',
		padding: 7,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	textStyle: {
		fontSize: 25,
		color: '#27ADA0',
		padding: 2
	},
	textDesc: {
		fontSize: 18,
		color: '#6327AD'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	},
	graphContainer: {
		height: 300,
		padding: 20,
		flexDirection: 'row',
	}
});