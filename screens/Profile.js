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
  AsyncStorage
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Button from '../Button';

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
	getInput(placeholder, keyboard, capitalize, state, value, defaultVal) {
		return (
			<TextInput
				style={styles.textInput}
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
	editProfile() {
		return (
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
					{this.getInput("First name", "default", "words", "firstName", this.state.firstName, this.state.firstName)}
					{this.getInput("Last name", "default", "words", "lastName", this.state.lastName, this.state.lastName)}
					{this.getInput("Daily activity", "numeric", "none", "dailyActivity", String(this.state.dailyActivity), "")}
					{this.getInput("Daily calories", "numeric", "none", "dailyCalories", String(this.state.dailyCalories), "")}
					{this.getInput("Daily carbohydrates", "numeric", "none", "dailyCarbs", String(this.state.dailyCarbs), "")}
					{this.getInput("Daily fat", "numeric", "none", "dailyFat", String(this.state.dailyFat), "")}
					{this.getInput("Daily protein", "numeric", "none", "dailyProtein", String(this.state.dailyProtein), "")}
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
			<Button
				buttonStyle={styles.button}
				textStyle={styles.buttonText}
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

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.backButtonContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("Settings")}
						style={styles.backButton}
					>
						<Ionicons name="md-arrow-back" size={40} color={'#27ADA0'} />
					</TouchableOpacity>
				</View>
				<Text style={styles.textStyle}>
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
					renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
					renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
					keyExtractor={(item, index) => index}
				/>
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
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
							  {this.editProfile()}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
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
	textStyle: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#27ADA0',
		padding: 20
	},
	button: {
		width: 200,
		height: 50,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#27ADA0',
	},
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white',
	},
	modalBG: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00000080',
	},
	modalBox: {
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.7,
		backgroundColor: '#fff',
		padding: 20,
	},
	textInput: {
		borderBottomColor: '#27ADA0',
		borderBottomWidth: 1,
		width: 200,
		textAlign: 'center',
		margin: 1,
		padding: 3,
		color: '#27ADA0',
	},
	item: {
		padding: 10,
		fontSize: 18,
		color: '#27ADA0'
	},
	sectionHeader: {
		paddingTop: 2,
		paddingLeft: 10,
		paddingRight: 10,
		paddingBottom: 2,
		fontSize: 16,
		fontWeight: 'bold',
		backgroundColor: '#27ADA0',
		color: 'white'
	}
});

export default Profile;
