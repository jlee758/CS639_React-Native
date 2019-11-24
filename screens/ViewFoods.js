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

class ViewFoods extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			foods: {},
			message: {},
			sumCal: 0,
			sumCarbs: 0,
			sumFat: 0,
			sumProtein: 0
		}
		this.username = this.props.navigation.state.params.username;
		this.token = this.props.navigation.state.params.token;
		this.mealName = this.props.navigation.state.params.currName;
		this.id = this.props.navigation.state.params.currId;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.date = this.props.navigation.state.params.date;
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//call getFoods to render components
	//call outputFoods(true) to get sum of all calories, carbs, etc.
	componentWillMount() {
		this._isMounted = true;
		this.focusListener = this.props.navigation.addListener('didFocus', () => {
			this.getFoods();
			this.outputFoods(true);
		});
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		this.focusListener.remove();
	}
	
	//Store all foods in an object (needed to check for duplicates)
	async getFoods() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			let url = "https://mysqlcs639.cs.wisc.edu/meals/" + this.id + "/foods";

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
	
	//returns all created foods as clickable buttons
	outputFoods(onMount, foodBtn, innerBtnText, textDesc) {
		if(this._isMounted) {
			this.getFoods();
			let foodOutput = [];
			
			//holds the sum of the nutrients for passing to ViewMeals
			let tempCal = 0;
			let tempCarbs = 0;
			let tempFat = 0;
			let tempProtein = 0;
			
			if(this.state.foods !== undefined && this.state.foods !== null) {
				for(const dataId of Object.entries(this.state.foods)) {
					let name, id, calories, carbs, protein, fat = "";
					for(const data of Object.entries(dataId[1])) {
						if(data[0] === "name") {
							name = data[1];
						} else if (data[0] === "id") {
							id = data[1];
						} else if (data[0] === "calories") {
							calories = data[1];
							tempCal += data[1];
						} else if (data[0] === "protein") {
							protein = data[1];
							tempProtein += data[1];
						} else if (data[0] === "carbohydrates") {
							carbs = data[1];
							tempCarbs += data[1];
						} else if (data[0] === "fat") {
							fat = data[1];
							tempFat += data[1];
						}
					}
					
					if(!onMount) {
						foodOutput.push(
							<React.Fragment key={dataId[0]}>
								<Button
									buttonStyle={foodBtn}
									textStyle={innerBtnText}
									text={name + "\n" + calories + " cals\n" + carbs + " carbs\n" + protein + " protein\n" + fat + " fat"}
									onPress={() => this.props.navigation.navigate("Foods", {
										token: this.token,
										currId: id,
										currName: name,
										currCal: calories,
										currCarbs: carbs,
										currProtein: protein,
										currFat: fat,
										typeUpdate: true,
										mealId: this.id,
										visible: this.visible
									})}
								/>
							</React.Fragment>
						);
					}
				}
			}

			if(onMount) {
				this.setState({
					sumCal: tempCal,
					sumCarbs: tempCarbs,
					sumFat: tempFat,
					sumProtein: tempProtein
				});
			//indicate to the user that no foods exist yet
			} else if(foodOutput.length === 0) {
				return (<Text style={textDesc}>No foods found!</Text>);
			} else {
				return foodOutput;
			}
		}
	}
	
	//if accessibility is enabled, rearrange navigation controls into a row at the top of the screen
	navControls(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn) {
		if(this.visible) {
			return (
				<React.Fragment>
					<View style={darkStyles.row}>
						{/*Go back*/}
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate("ViewMeals", {
								fromHome: false,
								updateId: this.id,
								sumCal: this.state.sumCal,
								sumCarbs: this.state.sumCarbs,
								sumFat: this.state.sumFat,
								sumProtein: this.state.sumProtein
							})}
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
							onPress={() => this.props.navigation.navigate("ViewMeals", {
								fromHome: false,
								updateId: this.id,
								sumCal: this.state.sumCal,
								sumCarbs: this.state.sumCarbs,
								sumFat: this.state.sumFat,
								sumProtein: this.state.sumProtein
							})}
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
	returnRender(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn, txtTitle, txtStyle, btn, btnText, foodBtn, innerBtnText, textDesc) {
		return (
			<View style={styles.container}>
				{/*Title texts*/}
				<Text style={txtTitle}>
					{this.date.toDateString()}
				</Text>
				<Text style={txtStyle}>
					Foods for {this.mealName}
				</Text>
				
				{this.navControls(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn)}
				
				{/*List of interactible foods*/}
				<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
					{this.outputFoods(false, foodBtn, innerBtnText, textDesc)}
				</ScrollView>
				
				{/*Food navigation Buttons*/}
				<View style={darkStyles.row}>
					<Button
						buttonStyle={btn}
						textStyle={btnText}
						text={'Add new food'}
						onPress={() => this.props.navigation.navigate("Foods", {
							token: this.token,
							currId: "",
							currName: "",
							currCal: "",
							currProtein: "",
							currCarbs: "",
							currFat: "",
							typeUpdate: false,
							mealId: this.id,
							visible: this.visible
						})}
					/>
					<Button
						buttonStyle={btn}
						textStyle={btnText}
						text={'Edit meal'}
						onPress={() => this.props.navigation.navigate("Meals", {
							token: this.token,
							currId: this.id,
							currName: this.mealName,
							date: this.props.navigation.state.params.stringDate,
							typeUpdate: true,
							visible: this.visible
						})}
					/>
				</View>
			</View>
		);
	}
	
	render() {
		if(this._isMounted) {
			//if accessibility is enabled:
			if(this.visible) {
				return (
					this.returnRender(darkStyles.backButtonContainer, darkStyles.backButton, 100, '#1a1a1a', darkStyles.settingsContainer, darkStyles.settingButton,
						darkStyles.textTitle, darkStyles.textStyle, darkStyles.foodNavButton, darkStyles.buttonText, darkStyles.foodButton, darkStyles.innerButtonText, darkStyles.textDesc)
				);
			} else {
				return (
					this.returnRender(styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.settingsContainer, styles.settingButton,
						styles.textTitle, styles.textStyle, styles.buttonViewFoods, styles.buttonText, styles.foodButton, styles.buttonText, styles.textDesc)
				);
			}
		} else {
			return (<View></View>);
		}
	}
}

export default ViewFoods;