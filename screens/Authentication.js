import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../Button';

class Authentication extends React.Component {
	//have a dedicated home page to signing and logging in
	render() {
		const {navigate} = this.props.navigation;
		
		return (
			<View style={styles.container}>
				<Image
					source={require('../assets/title.png')}
				/>
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Sign up'}
					onPress={() => navigate('Signup')}
				/>
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Log in'}
					onPress={() => navigate('Login')}
				>
				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
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
	}
})

export default Authentication;