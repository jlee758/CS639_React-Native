import {StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
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
	textTitle: {
		fontSize: 40,
		color: '#1a1a1a',
		padding: 8,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	textStyle: {
		fontSize: 30,
		color: '#1a1a1a',
		padding: 2
	},
	textDesc: {
		fontSize: 25,
		color: '#1a1a1a'
	},
	graphContainer: {
		height: 400,
		padding: 20,
		flexDirection: 'row',
	},
	row: {
		flexDirection: 'row'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width
	}
});