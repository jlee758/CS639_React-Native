import React from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	TouchableOpacity, 
	TouchableWithoutFeedback, 
	Dimensions, 
	TextInput, 
	Keyboard,
	KeyboardAvoidingView,
	Alert,
	ScrollView
} from 'react-native';
import Button from '../Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker';

class Activities extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			activities: {},
			message: {},
			activityName: this.props.navigation.state.params.currName,
			activityDuration: this.props.navigation.state.params.currDuration,
			activityCalories: this.props.navigation.state.params.currCals,
			currId: this.props.navigation.state.params.currId,
			date: this.props.navigation.state.params.date
		}
		this.token = this.props.navigation.state.params.token;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
	}
	
	//call getActivities to render components
	componentDidMount() {
		this._isMounted = true;
		this.getActivities();
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}
	
	//check that all fields have at least some input.
	confirmFields(confirmType) {
		if(this._isMounted) {
			if (this.state.activityName === '') {
				Alert.alert(
					'Missing input', 'Please enter a name',
					[ {text: 'OK'} ]
				);
				return false;
			} else if (confirmType) {
				//check that no duplicate activity name exists
				for(const dataId of Object.entries(this.state.activities)) {
					for(const data of Object.entries(dataId[1])) {
						if((data[0] === "name") && (data[1] === this.state.activityName)) {
							Alert.alert(
								'Invalid input', 'Duplicate activity found!',
								[ {text: 'OK'} ]
							);
							return false;
						}
					}
				}
			}
			if (this.state.activityDuration === 0.0 || this.state.activityDuration === "") {
				Alert.alert(
					'Missing input', 'Please enter a duration',
					[ {text: 'OK'} ]
				);
				return false;
			}
			if (this.state.activityCalories === 0.0 || this.state.activityCalories === "") {
				Alert.alert(
					'Missing input', 'Please enter calories',
					[ {text: 'OK'} ]
				);
				return false;
			}
			return true;
		}
	}
	
	//Store all activities in an object (needed to check for duplicates)
	async getActivities() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/activities";

			await fetch(url, {
				method: 'GET',
				headers: headers,
			})
			.then((response) => response.json())
			.then((responseData) => {
				if(this._isMounted) {
					this.setState({activities: responseData.activities})
				}
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
	
	//Add the specified data to a new activity
	async addToServer() {
		if(this.confirmFields(true) && this._isMounted) {
			let headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/activities";
			let tempDate = new Date(parseInt(this.state.date.substr(0,4)), parseInt(this.state.date.substr(5,7)) - 1, parseInt(this.state.date.substr(8,10)), parseInt(this.state.date.substr(11,13)), parseInt(this.state.date.substr(13)), 0).toISOString();
			
			await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify ({
					name: this.state.activityName,
					date: tempDate,
					duration: this.state.activityDuration,
					calories: this.state.activityCalories,
				})
			})
			.catch(error => {
				console.log(error);
			});
			
			//navigate back to the current day page
			this.props.navigation.goBack();
		}
	}
	
	//edit the current activity with the new data
	async updateActivity() {
		if(this.confirmFields(false) && this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/activities/" + this.state.currId;
			let tempDate = new Date(parseInt(this.state.date.substr(0,4)), parseInt(this.state.date.substr(5,7)) - 1, parseInt(this.state.date.substr(8,10)), parseInt(this.state.date.substr(11,13)), parseInt(this.state.date.substr(14)), 0).toISOString();

			await fetch(url, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify ({
					name: this.state.activityName,
					date: tempDate,
					duration: this.state.activityDuration,
					calories: this.state.activityCalories
				})
			})
			.catch(error => {
				console.log(error);
			});
			
			//automatically go back to the "current day" page
			this.props.navigation.goBack();
		}
	}
	
	//remove the activity from the account
	async deleteActivity() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/activities/" + this.state.currId;

			await fetch(url, {
				method: 'DELETE',
				headers: headers,
			})
			.then((response) => response.json())
			.then((responseData) => {
				if(this._isMounted) {
					this.setState({message: responseData})
				}
			})
			.catch(error => {
				console.log(error);
			});
			
			//notify the user that the activity was successfully deleted, then go back to the "current day" page
			Alert.alert (
				'Notice', this.state.message.message,
				[ {text: 'OK', onPress: () => this.props.navigation.goBack()} ],
				{cancelable: false}
			);
		}
	}
	
	//check if the user really wants to delete the specified activity
	confirmDelete() {
		if(this._isMounted) {
			Alert.alert(
				'Warning', 'Are you sure you want to delete this activity? This cannot be undone!',
				[ 
					{text: 'Cancel'},
					{text: 'Yes', onPress: () => this.deleteActivity()}
				],
				{cancelable: false}
			);
		}
	}
	
	//All input fields for non-date data
	getInput(placeholder, keyboard, capitalize, state, value, defaultVal) {
		if(this._isMounted) {
			return (
				<View style={styles.textInputContainer}>
					<Text style={styles.inputTitleStyle}>
					{placeholder}:
					</Text>
					<TextInput
						style={styles.textInput}
						placeholder={placeholder}
						defaultValue={defaultVal}
						keyboardType={keyboard}
						autoCapitalize={capitalize}
						autoCorrect={false}
						onChangeText={text => this.setState({ [state]: text})}
					/>
				</View>
			);
		}
	}
	
	//get the current date
	getCurrDate() {
		if(this._isMounted) {
			let currDate = new Date();
			let currDay = currDate.getDate();
			let currMonth = currDate.getMonth() + 1;
			let currYear = currDate.getFullYear();
			let currHour = currDate.getHours();
			let currMin = currDate.getMinutes();
			
			this.setState({
				date: currYear + "-" + currMonth + "-" + currDay + " " + currHour + ":" + currMin
			});
		}
	}
	
	getButtons() {
		//if editing an existing activity, buttons should be for updating or deleting
		if(this.typeUpdate) {
			return (
				<React.Fragment>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text={'Update activity'}
						onPress={() => this.updateActivity()}
					/>
					<Button
						buttonStyle={styles.buttonDanger}
						textStyle={styles.buttonText}
						text={'Delete activity'}
						onPress={() => this.confirmDelete()}
					/>
				</React.Fragment>
			);
		//if creating a new activity, button should only be for adding
		} else {
			return (
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Add activity'}
					onPress={() => this.addToServer()}
				/>
			);
		}
	}
	
	render() {
		if(this._isMounted) {
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
					{/*Keep all text input fields in one center-aligned container*/}
					<View style={styles.innerContainer}>
						<Text style={styles.textStyle}>
							Activity Editor
						</Text>
						<View style={styles.container}>
							<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
								<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
									<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
										{this.getInput("Activity Name", "default", "words", "activityName", this.state.activityName, this.state.activityName)}
										<View style={styles.textInputContainer}>
											{/*DatePicker*/}
											<Text style={styles.inputTitleStyle}>
											Activity Start Date/Time:
											</Text>
											<DatePicker
												style={{ width: 200 }}
												date={this.state.date}
												mode="datetime"
												confirmBtnText="Confirm"
												cancelBtnText="Cancel"
												minDate="2019-11-01"
												maxDate="2025-12-31"
												placeholder="Select Date"
												onDateChange={(date) => {this.setState({date: date})}}
											/>
											<Button
												buttonStyle={styles.dateButton}
												textStyle={styles.buttonText}
												text={'Use current date'}
												onPress={() => this.getCurrDate()}
											/>
										</View>
										{this.getInput("Duration (minutes)", "numeric", "none", "activityDuration", String(this.state.activityDuration), String(this.state.activityDuration))}
										{this.getInput("Calories", "numeric", "none", "activityCalories", String(this.state.activityCalories), String(this.state.activityCalories))}
									</KeyboardAvoidingView>
								</TouchableWithoutFeedback>
							</ScrollView>
							{this.getButtons()}
						</View>
					</View>
				</View>
			);
		} else {
			return (<View></View>);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}, 
	innerContainer: {
		width: Dimensions.get('window').width * 0.8,
		height: Dimensions.get('window').height * 0.8
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
	activityButton: {
		width: Dimensions.get('window').width * 0.7,
		height: 100,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#6327AD',
	},
	dateButton: {
		width: 180,
		height: 30,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius:  5,
		backgroundColor: '#27ADA0'
	},
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	textStyle: {
		fontSize: 25,
		color: '#27ADA0',
		textAlign: 'center'
	},
	inputTitleStyle: {
		fontSize: 18,
		color: '#27ADA0',
		padding: 10
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
	textInputContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 10,
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.9
	}
})

export default Activities;