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
	
	getButtons() {
		//if editing an existing food, buttons should be for updating or deleting
		if(this.typeUpdate) {
			return (
				<React.Fragment>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text={'Update food'}
						onPress={() => this.updateFood()}
					/>
					<Button
						buttonStyle={styles.buttonDanger}
						textStyle={styles.buttonText}
						text={'Delete food'}
						onPress={() => this.confirmDelete()}
					/>
				</React.Fragment>
			);
		//if creating a new food, button should only be for adding
		} else {
			return (
				<Button
					buttonStyle={styles.button}
					textStyle={styles.buttonText}
					text={'Add food'}
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
							Food Editor
						</Text>
						<View style={styles.container}>
							<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
								<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
									<KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
										{this.getInput("Food Name", "default", "words", "foodName", this.state.foodName, this.state.foodName)}
										{this.getInput("Calories", "numeric", "none", "calories", String(this.state.calories), String(this.state.calories))}
										{this.getInput("Carbohydrates", "numeric", "none", "carbs", String(this.state.carbs), String(this.state.carbs))}
										{this.getInput("Protein", "numeric", "none", "protein", String(this.state.protein), String(this.state.protein))}
										{this.getInput("Fat", "numeric", "none", "fat", String(this.state.fat), String(this.state.fat))}
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

export default Foods;