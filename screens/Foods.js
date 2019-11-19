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
import styles from '../styles/MealActivityEdit.style.js';
import darkStyles from '../styles/MealActivityEdit.darkStyle.js';

class Foods extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			foods: {},
			message: {},
			foodName: this.props.navigation.state.params.currName,
			currId: this.props.navigation.state.params.currId,
			calories: this.props.navigation.state.params.currCal,
			protein: this.props.navigation.state.params.currProtein,
			carbs: this.props.navigation.state.params.currCarbs,
			fat: this.props.navigation.state.params.currFat,
			id: this.props.navigation.state.params.currId
		}
		this.token = this.props.navigation.state.params.token;
		this.mealId = this.props.navigation.state.params.mealId;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//call getFoods to render components
	componentDidMount() {
		this._isMounted = true;
		this.getFoods();
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}
	
	//check that all fields have at least some input.
	confirmFields(confirmType) {
		if(this._isMounted) {
			if (this.state.foodName === '') {
				Alert.alert(
					'Missing input', 'Please enter a name',
					[ {text: 'OK'} ]
				);
				return false;
			} else if (confirmType) {
				//check that no duplicate food name exists
				for(const dataId of Object.entries(this.state.foods)) {
					for(const data of Object.entries(dataId[1])) {
						if((data[0] === "name") && (data[1] === this.state.foodName)) {
							Alert.alert(
								'Invalid input', 'Duplicate food found!',
								[ {text: 'OK'} ]
							);
							return false;
						}
					}
				}
			}
			if (this.state.calories === '') {
				Alert.alert(
					'Missing input', 'Please enter calories',
					[ {text: 'OK'} ]
				);
				return false;
			}
			if (this.state.carbs === '') {
				Alert.alert(
					'Missing input', 'Please enter carbohydrates',
					[ {text: 'OK'} ]
				);
				return false;
			}
			if (this.state.protein === '') {
				Alert.alert(
					'Missing input', 'Please enter protein',
					[ {text: 'OK'} ]
				);
				return false;
			}
			if (this.state.fat === '') {
				Alert.alert(
					'Missing input', 'Please enter fat',
					[ {text: 'OK'} ]
				);
				return false;
			}
			return true;
		}
	}
	
	//Store all foods in an object (needed to check for duplicates)
	async getFoods() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.mealId + "/foods";

			await fetch(url, {
				method: 'GET',
				headers: headers,
			})
			.then((response) => response.json())
			.then((responseData) => {
				if(this._isMounted) {
					this.setState({foods: responseData.foods})
				}
			})
			.catch(error => {
				console.log(error);
			});
		}
	}
	
	//Add the specified data to a new food
	async addToServer() {
		if(this.confirmFields(true) && this._isMounted) {
			let headers = {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.mealId + "/foods";
			
			await fetch(url, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify ({
					name: this.state.foodName,
					calories: this.state.calories,
					protein: this.state.protein,
					carbohydrates: this.state.carbs,
					fat: this.state.fat
				})
			})
			.catch(error => {
				console.log(error);
			});
			
			//navigate back to the viewFoods page
			this.props.navigation.goBack();
		}
	}
	
	//edit the current food with the new data
	async updateFood() {
		if(this.confirmFields(false) && this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.mealId + "/foods/" + this.state.id;

			await fetch(url, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify ({
					name: this.state.foodName,
					calories: this.state.calories,
					protein: this.state.protein,
					carbohydrates: this.state.carbs,
					fat: this.state.fat
				})
			})
			.catch(error => {
				console.log(error);
			});
			
			//automatically go back to the previous page
			this.props.navigation.goBack();
		}
	}
	
	//remove the food from the account
	async deleteFood() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.mealId + "/foods/" + this.state.id;

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
			
			//notify the user that the food was successfully deleted, then go back to the previous page
			Alert.alert (
				'Notice', this.state.message.message,
				[ {text: 'OK', onPress: () => this.props.navigation.goBack()} ],
				{cancelable: false}
			);
		}
	}
	
	//check if the user really wants to delete the specified food
	confirmDelete() {
		if(this._isMounted) {
			Alert.alert(
				'Warning', 'Are you sure you want to delete this food? This cannot be undone!',
				[ 
					{text: 'Cancel'},
					{text: 'Yes', onPress: () => this.deleteFood()}
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
	
	getButtons(addBtn, updateBtn, btnDanger, btnText) {
		//if editing an existing food, buttons should be for updating or deleting
		if(this.typeUpdate) {
			return (
				<View style={darkStyles.row}>
					<Button
						buttonStyle={updateBtn}
						textStyle={btnText}
						text={'Update food'}
						onPress={() => this.updateFood()}
					/>
					<Button
						buttonStyle={btnDanger}
						textStyle={btnText}
						text={'Delete food'}
						onPress={() => this.confirmDelete()}
					/>
				</View>
			);
		//if creating a new food, button should only be for adding
		} else {
			return (
				<Button
					buttonStyle={addBtn}
					textStyle={btnText}
					text={'Add food'}
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
		btnText, addBtn, updateBtn, btnDanger, scrollView) {
		return (
			<View style={styles.container}>
				<Text style={txtStyle}>
					Food Editor
				</Text>
				
				{this.navControls(backBtnContainer, backBtn, btnSize, btnColor)}
				
				<View style={styles.container}>
					<ScrollView style={scrollView} contentContainerStyle={{ alignItems: 'center' }}>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
								{this.getInput("Food Name", "default", "words", "foodName", this.state.foodName, this.state.foodName, txtInputContainer, inputTitleStyle, txtInput)}
								{this.getInput("Calories", "numeric", "none", "calories", String(this.state.calories), String(this.state.calories), txtInputContainer, inputTitleStyle, txtInput)}
								{this.getInput("Carbohydrates", "numeric", "none", "carbs", String(this.state.carbs), String(this.state.carbs), txtInputContainer, inputTitleStyle, txtInput)}
								{this.getInput("Protein", "numeric", "none", "protein", String(this.state.protein), String(this.state.protein), txtInputContainer, inputTitleStyle, txtInput)}
								{this.getInput("Fat", "numeric", "none", "fat", String(this.state.fat), String(this.state.fat), txtInputContainer, inputTitleStyle, txtInput)}
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
						darkStyles.textInputContainer, darkStyles.inputTitleStyle, darkStyles.buttonText, darkStyles.addButton, 
						darkStyles.updateButton, darkStyles.buttonDanger, darkStyles.scrollView)
				);
			} else {
				return (
					this.returnRender(styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.textStyle, styles.textInput, 
						styles.textInputContainer, styles.inputTitleStyle, styles.buttonText, styles.button, styles.button, styles.buttonDanger, styles.scrollView)
				);
			}
		} else {
			return (<View></View>);
		}
	}
}

export default Foods;