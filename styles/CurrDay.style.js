import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
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
	prevDateContainer: {
		position: 'absolute',
		top: Dimensions.get('window').height * 0.5,
		left: 10
	},
	nextDateContainer: {
		position: 'absolute',
		top: Dimensions.get('window').height * 0.5,
		right: 10
	},
	innerText: {
		position: 'absolute',
		top: 30,
	},
	button: {
		width: 200,
		height: 50,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#27ADA0',
	}, 
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	textTitle: {
		fontSize: 30,
		color: '#27ADA0',
		padding: 20,
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
		color: '#6327AD',
		padding: 5
	},
	textGraph: {
		textAlign: 'center',
		fontSize: 16,
		color: '#217A1C'
	},
	row: {
		flexDirection: 'row'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	}
});