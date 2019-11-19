import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  SectionList,
  ScrollView
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../Button';
import styles from '../styles/Profile.style.js';
import darkStyles from '../styles/Profile.darkStyle.js';

class Profile extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
		profileView: false,
		profileEdit: false,
		firstName: "",
		lastName: "",
		dailyActivity: 0.0,
		dailyCalories: 0.0,
		dailyCarbs: 0.0,
		dailyFat: 0.0,
		dailyProtein: 0.0
	};
	this.username = this.props.navigation.state.params.username;
	this.token = this.props.navigation.state.params.token;
	this.visible = this.props.navigation.state.params.visible;
	}

	//update all states with data stored in site
	componentDidMount() {
		this.getProfile();
	}

	//called when opening/closing the "edit profile" modal, determines if it's visible or not
	async profileEdit() {
		this.setState(prevState => ({
			profileEdit: !prevState.profileEdit,
		}));
		
		if(this.state.profileEdit === false) {
			this.getProfile();
		}
	}

	//updates the state to reflect the latest user data in the site
	async getProfile() {
		let headers = {
			'Content-Type': 'application/json',
			'x-access-token': this.token,
		};
		let url = "https://mysqlcs639.cs.wisc.edu/users/" + this.username;

		await fetch(url, {
			method: 'GET',
			headers: headers,
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({
				firstName: responseData.firstName,
				lastName: responseData.lastName,
				dailyActivity: responseData.goalDailyActivity,
				dailyCalories: responseData.goalDailyCalories,
				dailyCarbs: responseData.goalDailyCarbohydrates,
				dailyFat: responseData.goalDailyFat,
				dailyProtein: responseData.goalDailyProtein
			})
		})
		.catch(error => {
			console.log(error);
		});
	}

	//updates the site user data with local changes by the user
	async updateProfile() {
		let headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-access-token': this.token,
		};
		let url = "https://mysqlcs639.cs.wisc.edu/users/" + this.username;

		await fetch(url, {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify ({
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				goalDailyActivity: this.state.dailyActivity,
				goalDailyCalories: this.state.dailyCalories,
				goalDailyCarbohydrates: this.state.dailyCarbs,
				goalDailyFat: this.state.dailyFat,
				goalDailyProtein: this.state.dailyProtein
			})
		})
		.catch(error => {
			console.log(error);
		});

		//close the "edit profile" modal upon updating
		this.profileEdit();
	}

	//base structure for all input fields in the "edit profile" modal
	getInput(placeholder, keyboard, capitalize, state, defaultVal, textInput) {
		return (
			<TextInput
				style={textInput}
				placeholder={placeholder}
				defaultValue={defaultVal}
				keyboardType={keyboard}
				autoCapitalize={capitalize}
				autoCorrect={false}
				onChangeText={text => this.setState({ [state]: text})}
			/>
		);
	}

	//All interactible elements that appear in the "edit profile" modal
	editProfile(btn, btnText, textInput) {
		return (
		<View style={styles.container}>
			<ScrollView style={darkStyles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
						{this.getInput("First name", "default", "words", "firstName", this.state.firstName, textInput)}
						{this.getInput("Last name", "default", "words", "lastName", this.state.lastName, textInput)}
						{this.getInput("Daily activity", "numeric", "none", "dailyActivity", "", textInput)}
						{this.getInput("Daily calories", "numeric", "none", "dailyCalories", "", textInput)}
						{this.getInput("Daily carbohydrates", "numeric", "none", "dailyCarbs", "", textInput)}
						{this.getInput("Daily fat", "numeric", "none", "dailyFat", "", textInput)}
						{this.getInput("Daily protein", "numeric", "none", "dailyProtein", "", textInput)}
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
			</ScrollView>
			<Button
				buttonStyle={btn}
				textStyle={btnText}
				text={'Update profile'}
				onPress={() => this.updateProfile()}
			/>
		</View>
		);
	}
	
	//return profile name, return empty if a name has not been defined
	getName() {
		let firstName, lastName = "";
		if(this.state.firstName !== undefined && this.state.firstName !== null) {
			firstName = this.state.firstName;
		}
		if(this.state.lastName !== undefined && this.state.lastName !== null) {
			lastName = this.state.lastName;
		}
		return ([firstName + " " + lastName]);
	}

	//render() method, dependent on whether accessibility is enabled, changes styles accordingly
	returnRender(backBtnContainer, backBtn, btnSize, btnColor, textStyle, styleItem, sectionHeader, btn, btnText, textInput) {
		return (
			<View style={styles.container}>
				<View style={backBtnContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.goBack()}
						style={backBtn}
					>
						<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
					</TouchableOpacity>
				</View>
				<Text style={textStyle}>
					Profile{'\n'}
				</Text>
				<SectionList
					contentContainerStyle={{ flex: 1 }}
					sections={[
						{title: 'Full name', data: this.getName()},
						{title: 'Goals', data: [
							'Daily activity: ' + this.state.dailyActivity + ' min', 
							'Daily calories: ' + this.state.dailyCalories, 
							'Daily carbohydrates: ' + this.state.dailyCarbs, 
							'Daily fat: ' + this.state.dailyFat, 
							'Daily protein: ' + this.state.dailyProtein
						]}
					]}
					renderItem={({item}) => <Text style={styleItem}>{item}</Text>}
					renderSectionHeader={({section}) => <Text style={sectionHeader}>{section.title}</Text>}
					keyExtractor={(item, index) => index}
				/>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Edit profile'}
					onPress={() => this.profileEdit()}
				/>
				<Modal
					animationType="fade"
					transparent={false}
					visible={this.state.profileEdit}>
					<TouchableWithoutFeedback onPress={() => this.profileEdit()}>
						<View style={styles.modalBG}>
							<View style={styles.modalBox}>
							  {this.editProfile(btn, btnText, textInput)}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		);
	}
	
	render() {
		//if accessibility is enabled:
		if(this.visible) {
			return (
				this.returnRender(darkStyles.backButtonContainer, darkStyles.backButton, 100, '#1a1a1a', darkStyles.textStyle, darkStyles.item, darkStyles.sectionHeader,
					darkStyles.button, darkStyles.buttonText, darkStyles.textInput)
			);
		} else {
			return (
				this.returnRender(styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.textStyle, styles.item, styles.sectionHeader,
					styles.button, styles.buttonText, styles.textInput)
			);
		}
	}
}

export default Profile;
