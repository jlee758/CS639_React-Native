import {StyleSheet} from 'react-native';

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
	buttonText: {
		fontSize: 35,
		fontWeight: '300',
		color: 'white'
	},
	textInput: {
		width: 300,
		height: 70,
		borderColor: '#1a1a1a',
		borderWidth: 2,
		textAlign: 'center',
		margin: 10,
		padding: 5,
		color: '#1a1a1a',
		fontSize: 26
	}
})