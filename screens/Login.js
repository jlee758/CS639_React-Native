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
import base64 from 'base-64';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			token: {}
		}
	}
	
	//check that all fields are filled in
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
		return true;
	}
	
	//authenticate user input
	async login() {
		const {navigate} = this.props.navigation;

		if(this.confirmFields()) {
			//use base64 to encrypt username & password
			let headers = {
				'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)
			};

			await fetch('https://mysqlcs639.cs.wisc.edu/login', {
				method: 'GET',
				headers: headers
			})
			.then((resp) => resp.json())
			.then((respData) => {
				this.setState({token: respData})
			})
			.catch((error) => {
				console.log(error);
			});
		}

		//if token was returned, then login info is valid
		if(this.state.token.token !== undefined) {
			navigate('MainProg', {
				username: this.state.username,
				token: this.state.token.token
			});
		} else if(this.state.token.message !== undefined) {
			Alert.alert(
				'Invalid input', 'Invalid username or password',
				[ {text: 'OK'} ]
			);
		} else {
			Alert.alert(
				'Network error', 'No message received from network',
				[ {text: 'OK'} ]
			);
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
							returnKeyType="done"
							ref="passwordInput"
							onChangeText={password => this.setState({ password })}
							onSubmitEditing={() => this.login()}
							value={this.state.password}
						/>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Log in'}
					onPress={() => this.login()}
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

export default Login;