import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	settingButton: {
		alignItems: 'center',
		width: 100,
		height: 100,
	},
	innerText: {
		position: 'absolute',
		top: 60,
	},
	button: {
		flex: 1,
		margin: 10,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a',
	}, 
	buttonText: {
		fontSize: 35,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	textTitle: {
		fontSize: 40,
		color: '#1a1a1a',
		padding: 20,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	textStyle: {
		fontSize: 30,
		color: '#1a1a1a',
	},
	textDesc: {
		fontSize: 25,
		color: '#1a1a1a',
		padding: 5
	},
	textGraph: {
		textAlign: 'center',
		fontSize: 30,
		color: '#1a1a1a'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	}
});