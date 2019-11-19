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
	textStyle: {
		fontSize: 35,
		fontWeight: 'bold',
		color: '#1a1a1a',
		padding: 20
	},
	button: {
		width: 300,
		height: 100,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#1a1a1a',
	},
	buttonText: {
		fontSize: 35,
		fontWeight: '300',
		color: 'white',
	},
	textInput: {
		width: 280,
		height: 70,
		textAlign: 'center',
		borderColor: '#1a1a1a',
		borderWidth: 2,
		fontSize: 26,
		margin: 1,
		padding: 3,
		color: '#1a1a1a',
	},
	item: {
		padding: 10,
		fontSize: 26,
		color: '#1a1a1a'
	},
	sectionHeader: {
		paddingTop: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: 26,
		fontWeight: 'bold',
		backgroundColor: '#1a1a1a',
		color: 'white'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	}
});