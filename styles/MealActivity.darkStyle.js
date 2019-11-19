import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}, 
	backButton: {
		alignItems: 'center',
		width: 100,
		height: 100
	},
	settingButton: {
		alignItems: 'center',
		width: 100,
		height: 100
	},
	button: {
		width: 300,
		height: 100,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a'
	}, 
	activityButton: {
		width: Dimensions.get('window').width * 0.9,
		height: 145,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a',
	},
	mealButton: {
		width: Dimensions.get('window').width * 0.9,
		height: 220,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a',
	},
	foodButton: {
		width: Dimensions.get('window').width * 0.9,
		height: 180,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a',
	},
	foodNavButton: {
		flex: 1,
		margin: 10,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a'
	},
	buttonText: {
		fontSize: 35,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	innerButtonText: {
		fontSize: 30,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center',
		padding: 3
	},
	textStyle: {
		fontSize: 30,
		color: '#1a1a1a',
		textAlign: 'center',
		padding: 5
	},
	textTitle: {
		fontSize: 40,
		color: '#1a1a1a',
		padding: 20,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	textDesc: {
		fontSize: 25,
		color: '#1a1a1a'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	},
	row: {
		flexDirection: 'row'
	}
})