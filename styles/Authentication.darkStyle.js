import {StyleSheet} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
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
	accessibilityContainer: {
		position: 'absolute',
		top: 70,
		right: 100
	},
	accessibilityButton: {
		alignItems: 'center',
		width: 110,
		height: 110
	},
})