import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
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
	updateButton: {
		flex: 1,
		margin: 10,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a'
	},
	addButton: {
		width: 300,
		height: 100,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a'
	},
	buttonDanger: {
		flex: 1,
		margin: 10,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#AD272D'
	},
	dateButton: {
		width: 280,
		height: 80,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius:  5,
		backgroundColor: '#1a1a1a'
	},
	buttonText: {
		fontSize: 35,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	textStyle: {
		fontSize: 40,
		color: '#1a1a1a',
		padding: 20,
		textAlign: 'center'
	},
	inputTitleStyle: {
		fontSize: 30,
		color: '#1a1a1a',
		padding: 10
	},
	textInput: {
		width: 300,
		height: 60,
		borderColor: '#1a1a1a',
		borderWidth: 2,
		textAlign: 'center',
		margin: 1,
		padding: 3,
		color: '#1a1a1a',
		fontSize: 23
	},
	textInputContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
	},
	row: {
		flexDirection: 'row'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width
	}
})