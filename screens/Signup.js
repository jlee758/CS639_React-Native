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
	
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.backButtonContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("Home")}
						style={styles.backButton}
					>
						<Ionicons name="md-arrow-back" size={40} color={'#27ADA0'} />
					</TouchableOpacity>
				</View>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
						<TextInput
							style={styles.textInput}
							placeholder="Username"
							autoCapitalize="none"
							autoCorrect={false}
							returnKeyType="next"
							ref="usernameInput"
							onChangeText={text => this.setState({ username: text })}
							onSubmitEditing={() => this.refs.passwordInput.focus()}
							value={this.state.username}
						/>
						<TextInput
							style={styles.textInput}
							placeholder="Password"
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
							style={styles.textInput}
							placeholder="Repeat Password"
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
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Sign up'}
					onPress={() => this.signup()}
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
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white'
	},
	textInput: {
		borderBottomColor: '#27ADA0',
		borderBottomWidth: 1,
		width: 200,
		textAlign: 'center',
		margin: 10,
		padding: 5,
		color: '#27ADA0'
	}
})

export default Signup;