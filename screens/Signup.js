import React from 'react';
import { View, 
	Text, 
	StyleSheet, 
	TouchableOpacity,
	TextInput,
	Keyboard,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Alert
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../Button';
import styles from '../styles/SignLogin.style.js';
import darkStyles from '../styles/SignLogin.darkStyle.js';

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			repeatPassword: '',
			message: {}
		}
	}
	
	//check that all fields are filled in, and that the two passwords match
	//Alert is applicable for both iOS and Android
	confirmFields() {
		if (this.state.username === '') {
			Alert.alert(
				'Missing input', 'Please enter a username',
				[ {text: 'OK'} ]
			);
			return false;
		}
		if (this.state.password === '') {
			Alert.alert(
				'Missing input', 'Please enter a password',
				[ {text: 'OK'} ]
			);
			return false;
		}
		if (this.state.repeatPassword === '') {
			Alert.alert(
				'Missing input', 'Please repeat your password',
				[ {text: 'OK'} ]
			);
			return false;
		} else {
			if(this.state.repeatPassword !== this.state.password) {
				Alert.alert(
					'Invalid input', 'The passwords do not match',
					[ {text: 'OK'} ]
				);
				return false;
			}
		}
		return true;
	}
	
	async signup() {
		//only sign up if all fields are valid
		if(this.confirmFields()) {
			let headers = {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}

			await fetch('https://mysqlcs639.cs.wisc.edu/users', {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					username: this.state.username,
					password: this.state.password
				})
			})
			.then((resp) => resp.json())
			.then((respData) => {
				this.setState({message: respData})
			})
			.catch((error) => {
				console.log(error);
			});

			//Return to user status of signing up
			if(this.state.message.message !== undefined) {
				Alert.alert (
					'Notice', this.state.message.message,
					[ {text: 'OK'} ]
				);
			} else {
				Alert.alert (
					'Network error', 'No message was returned',
					[ {text: 'OK'} ]
				);
			}
		}
	}
	
	returnRender(container, backContainer, backBtn, btnSize, btnColor, txtInput, plhdrColor, btn, btnText) {
		return (
			<View style={container}>
				<View style={backContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("Home")}
						style={backBtn}
					>
						<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
					</TouchableOpacity>
				</View>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView style={container} behavior="padding" enabled>
						<TextInput
							style={txtInput}
							placeholder="Username"
							placeholderTextColor={plhdrColor}
							autoCapitalize="none"
							autoCorrect={false}
							returnKeyType="next"
							ref="usernameInput"
							onChangeText={text => this.setState({ username: text })}
							onSubmitEditing={() => this.refs.passwordInput.focus()}
							value={this.state.username}
						/>
						<TextInput
							style={txtInput}
							placeholder="Password"
							placeholderTextColor={plhdrColor}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry={true}
							returnKeyType="next"
							ref="passwordInput"
							onChangeText={password => this.setState({ password })}
							onSubmitEditing={() => this.refs.repeatPasswordInput.focus()}
							value={this.state.password}
						/>
						<TextInput
							style={txtInput}
							placeholder="Repeat Password"
							placeholderTextColor={plhdrColor}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry={true}
							returnKeyType="done"
							ref="repeatPasswordInput"
							onChangeText={repeatPassword => this.setState({ repeatPassword })}
							onSubmitEditing={() => this.signup()}
							value={this.state.repeatPassword}
						/>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Sign up'}
					onPress={() => this.signup()}
				/>
			</View>
		);
	}
	
	render() {
		if(this.props.navigation.state.params.visible) {
			return (
				this.returnRender(darkStyles.container, darkStyles.backButtonContainer, darkStyles.backButton, 100, '#1a1a1a', darkStyles.textInput, '#1a1a1a', darkStyles.button, darkStyles.buttonText)
			);
		} else {
			return (
				this.returnRender(styles.container, styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.textInput, '#c4c4c4', styles.button, styles.buttonText)
			);
		}
	}
}

export default Signup;