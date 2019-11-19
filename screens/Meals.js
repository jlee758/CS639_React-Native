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
import styles from '../styles/MealActivityEdit.style.js';
import darkStyles from '../styles/MealActivityEdit.darkStyle.js';

class Meals extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			meals: {},
			message: {},
			mealName: this.props.navigation.state.params.currName,
			currId: this.props.navigation.state.params.currId,
			date: this.props.navigation.state.params.date
		}
		this.token = this.props.navigation.state.params.token;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//call getActivities to render components
	componentDidMount() {
		this._isMounted = true;
		this.getMeals();
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}
	
	//check that all fields have at least some input.
	confirmFields(confirmType) {
		if(this._isMounted) {
			if (this.state.mealName === '') {
				Alert.alert(
					'Missing input', 'Please enter a name',
					[ {text: 'OK'} ]
				);
				return false;
			} else if (confirmType) {
				//check that no duplicate activity name exists
				for(const dataId of Object.entries(this.state.meals)) {
					for(const data of Object.entries(dataId[1])) {
						if((data[0] === "name") && (data[1] === this.state.mealName)) {
							Alert.alert(
								'Invalid input', 'Duplicate meal found!',
								[ {text: 'OK'} ]
							);
							return false;
						}
					}
				}
			}
			return true;
		}
	}
	
	//Store all activities in an object (needed to check for duplicates)
	async getMeals() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals";

			await fetch(url, {
				method: 'GET',
				headers: headers,
			})
			.then((response) => response.json())
			.then((responseData) => {
				if(this._isMounted) {
					this.setState({meals: responseData.meals})
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
			let url = "https://mysqlcs639.cs.wisc.edu/meals";
			let tempDate = new Date(parseInt(this.state.date.substr(0,4)), parseInt(this.state.date.substr(5,7)) - 1, parseInt(this.state.date.substr(8,10)), parseInt(this.state.date.substr(11,13)), parseInt(this.state.date.substr(14)), 0).toISOString();
			
			await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify ({
					name: this.state.mealName,
					date: tempDate
				})
			})
			.catch(error => {
				console.log(error);
			});
			
			//navigate back to the current day page
			this.props.navigation.goBack();
		}
	}
	
	//edit the current meal with the new data
	async updateMeal() {
		if(this.confirmFields(false) && this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.state.currId;
			let tempDate = new Date(parseInt(this.state.date.substr(0,4)), parseInt(this.state.date.substr(5,7)) - 1, parseInt(this.state.date.substr(8,10)), parseInt(this.state.date.substr(11,13)), parseInt(this.state.date.substr(14)), 0).toISOString();

			await fetch(url, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify ({
					name: this.state.mealName,
					date: tempDate
				})
			})
			.catch(error => {
				console.log(error);
			});
			
			//automatically go back to the previous page
			this.props.navigation.navigate("ViewMeals");
		}
	}
	
	//remove the meal from the account
	async deleteMeal() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.state.currId;

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
			
			//notify the user that the meal was successfully deleted, then go back to the previous page
			Alert.alert (
				'Notice', this.state.message.message,
				[ {text: 'OK', onPress: () => this.props.navigation.navigate("ViewMeals")} ],
				{cancelable: false}
			);
		}
	}
	
	//check if the user really wants to delete the specified meal
	confirmDelete() {
		if(this._isMounted) {
			Alert.alert(
				'Warning', 'Are you sure you want to delete this meal? This cannot be undone!',
				[ 
					{text: 'Cancel'},
					{text: 'Yes', onPress: () => this.deleteMeal()}
				],
				{cancelable: false}
			);
		}
	}
	
	//All input fields for non-date data
	getInput(placeholder, keyboard, capitalize, state, value, defaultVal, txtInputContainer, inputTitleStyle, txtInput) {
		if(this._isMounted) {
			return (
				<View style={txtInputContainer}>
					<Text style={inputTitleStyle}>
					{placeholder}:
					</Text>
					<TextInput
						style={txtInput}
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
	
	getButtons(addBtn, updateBtn, btnDanger, btnText) {
		//if editing an existing meal, buttons should be for updating or deleting
		if(this.typeUpdate) {
			return (
				<View style={darkStyles.row}>
					<Button
						buttonStyle={updateBtn}
						textStyle={btnText}
						text={'Update meal'}
						onPress={() => this.updateMeal()}
					/>
					<Button
						buttonStyle={btnDanger}
						textStyle={btnText}
						text={'Delete meal'}
						onPress={() => this.confirmDelete()}
					/>
				</View>
			);
		//if creating a new meal, button should only be for adding
		} else {
			return (
				<Button
					buttonStyle={addBtn}
					textStyle={btnText}
					text={'Add meal'}
					onPress={() => this.addToServer()}
				/>
			);
		}
	}
	
	//if accessibility is enabled, place backwards button directly underneath title for consistency
	navControls(backBtnContainer, backBtn, btnSize, btnColor) {
		if(this.visible) {
			return (
				<TouchableOpacity
					onPress={() => this.props.navigation.goBack()}
					style={backBtn}
				>
					<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
				</TouchableOpacity>
			);
		} else {
			return (
				<View style={backBtnContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.goBack()}
						style={backBtn}
					>
						<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
					</TouchableOpacity>
				</View>
			);
		}
	}
	
	//render() method, dependent on whether accessibility is enabled.
	returnRender(backBtnContainer, backBtn, btnSize, btnColor, txtStyle, txtInput, txtInputContainer, inputTitleStyle, 
		dateBtn, btnText, addBtn, updateBtn, btnDanger, dateWidth, dateHeight, dateIconSize, dateFont, scrollView) {
		return (
			<View style={styles.container}>
				<Text style={txtStyle}>
					Meal Editor
				</Text>
				
				{this.navControls(backBtnContainer, backBtn, btnSize, btnColor)}
				
				<View style={styles.container}>
					<ScrollView style={scrollView} contentContainerStyle={{ alignItems: 'center' }}>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
								{this.getInput("Meal Name", "default", "words", "mealName", this.state.mealName, this.state.mealName, txtInputContainer, inputTitleStyle, txtInput)}
								<View style={txtInputContainer}>
									{/*DatePicker*/}
									<Text style={inputTitleStyle}>
									Activity Start Date/Time:
									</Text>
									<View style={{padding: 5}}>
										<DatePicker
											style={{ width: dateWidth }}
											date={this.state.date}
											mode="datetime"
											confirmBtnText="Confirm"
											cancelBtnText="Cancel"
											minDate="2019-11-01"
											maxDate="2025-12-31"
											placeholder="Select Date"
											customStyles={{
												dateInput: {
													height: dateHeight
												},
												dateIcon: {
													width: dateIconSize,
													height: dateIconSize
												},
												dateText: {
													fontSize: dateFont
												}
											}}
											onDateChange={(date) => {this.setState({date: date})}}
										/>
									</View>
									<Button
										buttonStyle={dateBtn}
										textStyle={btnText}
										text={'Use current date'}
										onPress={() => this.getCurrDate()}
									/>
								</View>
							</KeyboardAvoidingView>
						</TouchableWithoutFeedback>
					</ScrollView>
					{this.getButtons(addBtn, updateBtn, btnDanger, btnText)}
				</View>
			</View>
		);
	}
	
	render() {
		if(this._isMounted) {
			if(this.visible) {
				return (
					this.returnRender(darkStyles.backButtonContainer, darkStyles.backButton, 100, '#1a1a1a', darkStyles.textStyle, darkStyles.textInput, 
						darkStyles.textInputContainer, darkStyles.inputTitleStyle, darkStyles.dateButton, darkStyles.buttonText, darkStyles.addButton, 
						darkStyles.updateButton, darkStyles.buttonDanger, 300, 56, 46, 25, darkStyles.scrollView)
				);
			} else {
				return (
					this.returnRender(styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.textStyle, styles.textInput, 
						styles.textInputContainer, styles.inputTitleStyle, styles.dateButton, styles.buttonText, styles.button, styles.button, 
						styles.buttonDanger, 200, 40, 32, 18, styles.scrollView)
				);
			}
		} else {
			return (<View></View>);
		}
	}
}

export default Meals;