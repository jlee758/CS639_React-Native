import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Button from '../Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../styles/Authentication.style.js';
import darkStyles from '../styles/Authentication.darkStyle.js';

class Authentication extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}
	
	//toggle the accessibility features for this app
	changeAccess() {
		this.setState(prevState => ({
			visible: !prevState.visible
		}));
	}
	
	//confirm if the user wants to toggle accessibility features for this app
	enableAccessibility() {
		Alert.alert (
			'Accessibility', 'Do you want to toggle visual aids for this app?',
			[ 
				{text: 'No', style: 'cancel'},
				{text: 'Yes', onPress: () => this.changeAccess()} 
			],
			{cancelable: false}
		);
	}
	
	returnRender(container, accessContainer, accessButton, btn, btnText, btnSize, btnColor) {
		const {navigate} = this.props.navigation;
		
		return (
			<View style={container}>
				<View style={accessContainer}>
					<TouchableOpacity
						onPress={() => this.enableAccessibility()}
						style={accessButton}
					>
						<Ionicons name="md-eye" size={btnSize} color={btnColor} />
					</TouchableOpacity>
				</View>
			
				<Image
					source={require('../assets/title.png')}
				/>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Sign up'}
					onPress={() => navigate('Signup', {
						visible: this.state.visible
					})}
				/>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Log in'}
					onPress={() => navigate('Login', {
						visible: this.state.visible
					})}
				>
				</Button>
			</View>
		);
	}
	
	//have a dedicated home page to signing and logging in
	render() {		
		if(this.state.visible) {
			return (
				this.returnRender(darkStyles.container, darkStyles.accessibilityContainer, darkStyles.accessibilityButton, darkStyles.button, darkStyles.buttonText, 100, '#1a1a1a')
			);
		} else {
			return (
				this.returnRender(styles.container, styles.accessibilityContainer, styles.accessibilityButton, styles.button, styles.buttonText, 40, '#27ADA0')
			);
		}
	}
}

export default Authentication;