import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
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
	textStyle: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#27ADA0',
		padding: 20
	},
	button: {
		width: 200,
		height: 50,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#27ADA0',
	},
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white',
	},
	modalBG: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080',
	},
	modalBox: {
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.7,
		backgroundColor: '#fff',
		padding: 20,
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
	item: {
		padding: 10,
		fontSize: 18,
		color: '#27ADA0'
	},
	sectionHeader: {
		paddingTop: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: 16,
		fontWeight: 'bold',
		backgroundColor: '#27ADA0',
		color: 'white'
	}
});