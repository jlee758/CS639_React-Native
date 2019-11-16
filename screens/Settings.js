import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Button from '../Button';
import Profile from './Profile';
import Ionicons from '@expo/vector-icons/Ionicons';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: {}
		}
		this.username = this.props.navigation.getParam('username', 'undefined');
		this.token = this.props.navigation.getParam('token', 'undefined');
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
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.backButtonContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.goBack()}
						style={styles.backButton}
					>
						<Ionicons name="md-arrow-back" size={40} color={'#27ADA0'} />
					</TouchableOpacity>
				</View>
				<Text style={styles.textStyle}>
					Settings
				</Text>
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'View profile'}
					onPress={() => this.props.navigation.navigate('Profile', {
						username: this.username,
						token: this.token
					})}
				/>
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Log out'}
					onPress={() => this.confirmLogout()}
				/>
				<Button
					buttonStyle={styles.buttonDanger}
					textStyle={styles.buttonText}
					text={'Delete profile'}
					onPress={() => this.confirmDelete()}
				/>
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
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white'
	},
	textStyle: {
		fontSize: 35,
		color: '#27ADA0',
		padding: 20
	}
})

export default Settings;