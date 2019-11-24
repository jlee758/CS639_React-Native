import React from 'react';
import { 
	View, 
	Text, 
	StyleSheet, 
	TouchableOpacity, 
	Dimensions, 
	ScrollView
} from 'react-native';
import Button from '../Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../styles/MealActivity.style.js';
import darkStyles from '../styles/MealActivity.darkStyle.js';

class ViewMeals extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			meals: {},
			foods: this.props.navigation.state.params.foods,
			message: {},
		}
		this.username = this.props.navigation.state.params.username;
		this.token = this.props.navigation.state.params.token;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.date = this.props.navigation.state.params.date;
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//call getMeals to render components
	componentDidMount() {
		this._isMounted = true;
		this.getMeals();
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}
	
	//Store all meals in an object (needed to check for duplicates)
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
	
	//returns all created meals as clickable buttons
	outputMeals(mealBtn, innerBtnText, textDesc) {
		if(this._isMounted) {
			this.getMeals();
			let mealOutput = [];
			
			if(this.state.meals !== undefined && this.state.meals !== null) {
				for(const dataId of Object.entries(this.state.meals)) {
					let name, id, date = "";
					let day, month, year, hour, min = "";
					for(const data of Object.entries(dataId[1])) {
						if(data[0] === "name") {
							name = data[1];
						} else if (data[0] === "id") {
							id = data[1];
						} else if (data[0] === "date") {
							date = new Date(data[1]).toDateString();
							day = new Date(data[1]).getDate();
							month = new Date(data[1]).getMonth() + 1;
							year = new Date(data[1]).getFullYear();
							hour = new Date(data[1]).getHours();
							min = new Date(data[1]).getMinutes();
						}
					}
					
					if(min < 10) {
						min = "0" + min;
					}
					
					//only return meals for the current date
					if(date === this.date.toDateString()) {
						let sumCalGain = 0;
						let sumCarbs = 0;
						let sumFat = 0;
						let sumProtein = 0;
						
						//if user came from currDay, then the food object was updated
						if(this.props.navigation.state.params.fromHome) {
							for(const foodId of Object.entries(this.state.foods)) {
								if(foodId[0] == id) {
									for(const foodInnerId of Object.entries(foodId[1])) {
										for(const food of Object.entries(foodInnerId[1])) {
											if(food[0] === "calories") {
												sumCalGain += food[1];
											} else if (food[0] === "carbohydrates") {
												sumCarbs += food[1];
											} else if (food[0] === "fat") {
												sumFat += food[1];
											} else if (food[0] === "protein") {
												sumProtein += food[1];
											}
										}
									}
								}
							}
						//else, use the aggregated nutrients retrieved from ViewFoods
						} else {
							if(id === this.props.navigation.state.params.updateId) {
								sumCalGain = this.props.navigation.state.params.sumCal;
								sumCarbs = this.props.navigation.state.params.sumCarbs;
								sumFat = this.props.navigation.state.params.sumFat;
								sumProtein = this.props.navigation.state.params.sumProtein;
							}
						}
						
						mealOutput.push(
							<React.Fragment key={dataId[0]}>
								<Button
									buttonStyle={mealBtn}
									textStyle={innerBtnText}
									text={name + "\n" + date + " (" + hour + ":" + min + ")\n" + sumCalGain + " cal\n" + sumCarbs + " carbohydrates\n" + sumFat + " fat\n" + sumProtein + " protein"}
									onPress={() => this.props.navigation.navigate("ViewFoods", {
										username: this.username,
										token: this.token,
										currId: id,
										currName: name,
										date: this.date,
										stringDate: String(year) + "-" + String(month) + "-" + String(day) + " " + String(hour) + ":" + String(min),
										typeUpdate: true,
										visible: this.visible
									})}
								/>
							</React.Fragment>
						);
					}
				}
			}
			//indicate to the user that no meals exist yet
			if(mealOutput.length === 0) {
				return (<Text style={textDesc}>No meals found!</Text>);
			}
			return mealOutput;
		}
	}
	
	//format date into readable version for datePicker
	getDate() {
		let currDay = this.date.getDate();
		let currMonth = this.date.getMonth() + 1;
		let currYear = this.date.getFullYear();
		let currHour = this.date.getHours();
		let currMin = this.date.getMinutes();
		
		return (currYear + "-" + currMonth + "-" + currDay + " " + currHour + ":" + currMin);
	}
	
	//if accessibility is enabled, rearrange navigation controls into a row at the top of the screen
	navControls(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn) {
		if(this.visible) {
			return (
				<React.Fragment>
					<View style={darkStyles.row}>
						{/*Go back*/}
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={backBtn}
						>
							<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
						</TouchableOpacity>
						{/*Settings*/}
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate("Settings", {
								username: this.username,
								token: this.token,
								visible: this.visible
						})}
							style={setBtn}
						>
							<Ionicons name="md-settings" size={btnSize} color={btnColor} />
						</TouchableOpacity>
					</View>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					{/*Navigation controls*/}
					<View style={backBtnContainer}>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={backBtn}
						>
							<Ionicons name="md-arrow-back" size={btnSize} color={btnColor} />
						</TouchableOpacity>
					</View>
					<View style={setContainer}>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate("Settings", {
								username: this.username,
								token: this.token,
								visible: this.visible
						})}
							style={setBtn}
						>
							<Ionicons name="md-settings" size={btnSize} color={btnColor} />
						</TouchableOpacity>
					</View>
				</React.Fragment>
			);
		}
	}
	
	//render() function, dependent on styles or darkStyles, changes when accessibility is toggled
	returnRender(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn, txtTitle, txtStyle, btn, btnText, mealBtn, innerBtnText, textDesc) {
		return (
			<View style={styles.container}>
				{/*Text titles*/}
				<View style={styles.row}>
					<Text style={txtTitle}>
						{this.date.toDateString()}
					</Text>
					<Text style={txtStyle}>
						Meals
					</Text>
				</View>
				
				{this.navControls(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn)}
				
				{/*List of interactible meals*/}
				<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
					{this.outputMeals(mealBtn, innerBtnText, textDesc)}
				</ScrollView>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Add new meal'}
					onPress={() => this.props.navigation.navigate("Meals", {
						token: this.token,
						currId: "",
						currName: "",
						date: this.getDate(),
						typeUpdate: false,
						visible: this.visible
					})}
				/>
			</View>
		);
	}
	
	render() {
		if(this._isMounted) {
			if(this.visible) {
				return (
					this.returnRender(darkStyles.backButtonContainer, darkStyles.backButton, 100, '#1a1a1a', darkStyles.settingsContainer, darkStyles.settingButton,
						darkStyles.textTitle, darkStyles.textStyle, darkStyles.button, darkStyles.buttonText, darkStyles.mealButton, darkStyles.innerButtonText, darkStyles.textDesc)
				);
			} else {
				return (
					this.returnRender(styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.settingsContainer, styles.settingButton,
						styles.textTitle, styles.textStyle, styles.button, styles.buttonText, styles.mealButton, styles.buttonText, styles.textDesc)
				);
			}
		} else {
			return (<View></View>);
		}
	}
}

export default ViewMeals;