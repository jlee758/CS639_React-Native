import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
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
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white'
	},
	accessibilityContainer: {
		position: 'absolute',
		top: 70,
		right: 10
	},
	accessibilityButton: {
		alignItems: 'center',
		width: 50,
		height: 50
	},
});