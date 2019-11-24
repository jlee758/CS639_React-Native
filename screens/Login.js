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
import styles from '../styles/SignLogin.style.js';
import darkStyles from '../styles/SignLogin.darkStyle.js';

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
				token: this.state.token.token,
				visible: this.props.navigation.state.params.visible
			});
		} else if(this.state.token.message !== undefined) {
			Alert.alert(
				'Invalid input', 'Invalid username or password',
				[ {text: 'OK'} ]
			);
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
					<KeyboardAvoidingView behavior="padding" enabled>
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
							returnKeyType="done"
							ref="passwordInput"
							onChangeText={password => this.setState({ password })}
							onSubmitEditing={() => this.login()}
							value={this.state.password}
						/>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Log in'}
					onPress={() => this.login()}
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

export default Login;