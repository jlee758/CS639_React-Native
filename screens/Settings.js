import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Button from '../Button';
import Profile from './Profile';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../styles/Settings.style.js';
import darkStyles from '../styles/Settings.darkStyle.js';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: {}
		}
		this.username = this.props.navigation.getParam('username', 'undefined');
		this.token = this.props.navigation.getParam('token', 'undefined');
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//deletes the account after user confirmation
	async deleteProfile() {
		let headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.token,
		};
		let url = "https://mysqlcs639.cs.wisc.edu/users/" + this.username;

		await fetch(url, {
			method: 'DELETE',
			headers: headers,
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({message: responseData})
		})
		.catch(error => {
			console.log(error);
		});
		
		//alert the user that the account has been deleted, then return them to home screen
		if(this.state.message.message !== undefined) {
			Alert.alert (
				'Notice', this.state.message.message,
				[ {text: 'OK', onPress: () => this.props.navigation.navigate('Home')} ],
				{cancelable: false}
			);
		} else {
			//alert that account couldn't be deleted for some reason
			Alert.alert (
				'Network error', 'No message was returned',
				[ {text: 'OK'} ]
			);
		}
	}
	
	//check if the user wants to log out
	confirmLogout() {
		Alert.alert(
			'Warning', 'Are you sure you want to log out?',
			[ 
				{text: 'Cancel'},
				{text: 'Yes', onPress: () => this.props.navigation.navigate('Home')}
			],
			{cancelable: false}
		);
	}
	
	//check if the user wants to delete their account. Warn it cannot be undone.
	confirmDelete() {
		Alert.alert(
			'Warning', 'Are you sure you want to delete your account? This cannot be undone!',
			[ 
				{text: 'Cancel'},
				{text: 'Yes', onPress: () => this.deleteProfile()}
			],
			{cancelable: false}
		);
	}
	
	//render() method, dependent on styles whether accessibility is enabled
	returnRender(container, backBtnContainer, backBtn, btnSize, btnColor, textStyle, btn, btnText, btnDanger) {
		return (
			<View style={container}>
				<View style={backBtnContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.goBack()}
						style={backBtn}
					>
						<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
					</TouchableOpacity>
				</View>
				<Text style={textStyle}>
					Settings
				</Text>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'View profile'}
					onPress={() => this.props.navigation.navigate('Profile', {
						username: this.username,
						token: this.token,
						visible: this.visible
					})}
				/>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Log out'}
					onPress={() => this.confirmLogout()}
				/>
				<Button
					buttonStyle={btnDanger}
					textStyle={btnText}
					text={'Delete profile'}
					onPress={() => this.confirmDelete()}
				/>
			</View>
		);
	}
	
	render() {
		//if accessibility is enabled:
		if(this.visible) {
			return (
				this.returnRender(darkStyles.container, darkStyles.backButtonContainer, darkStyles.backButton, 100, '#1a1a1a', darkStyles.textStyle,
					darkStyles.button, darkStyles.buttonText, darkStyles.buttonDanger)
			);
		} else {
			return (
				this.returnRender(styles.container, styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.textStyle,
					styles.button, styles.buttonText, styles.buttonDanger)
			);
		}
	}
}

export default Settings;