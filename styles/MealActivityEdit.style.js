import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}, 
	innerContainer: {
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.8
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
	button: {
		width: 200,
		height: 50,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#27ADA0'
	}, 
	buttonDanger: {
		width: 200,
		height: 50,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#AD272D'
	},
	dateButton: {
		width: 180,
		height: 30,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius:  5,
		backgroundColor: '#27ADA0'
	},
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	textStyle: {
		fontSize: 30,
		color: '#27ADA0',
		padding: 20,
		textAlign: 'center'
	},
	inputTitleStyle: {
		fontSize: 18,
		color: '#27ADA0',
		padding: 10
	},
	textInput: {
		borderBottomColor: '#27ADA0',
		borderBottomWidth: 1,
		width: 200,
		textAlign: 'center',
		margin: 1,
		padding: 3,
		color: '#27ADA0',
	},
	textInputContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	}
})