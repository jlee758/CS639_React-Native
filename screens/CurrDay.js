import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import Button from '../Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProgressCircle } from 'react-native-svg-charts';
import pluralize from 'pluralize';
import styles from '../styles/CurrDay.style.js';
import darkStyles from '../styles/CurrDay.darkStyle.js';

class CurrDay extends React.Component {
	_isMounted = false;
	
	//because of issues getting redux and async storage to work, use stack-nav and getData functions for each class for now
	
	constructor(props) {
		super(props);
		this.state = {
			activities: {},
			meals: {},
			foods: {},
			date: new Date(),
			dailyActivity: 0.0,
			dailyCalories: 0.0,
			dailyCarbs: 0.0,
			dailyFat: 0.0,
			dailyProtein: 0.0,
		}
		this.username = this.props.navigation.state.params.username;
		this.token = this.props.navigation.state.params.token;
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//ensure no updating state on unmounted components
	componentDidMount() {
		this._isMounted = true;
		this.focusListener = this.props.navigation.addListener('didFocus', () => {
				this.getProfile();
				this.getActivities();
				this.getMeals();
		});
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		this.focusListener.remove();
	}
	
	//get all user-specified goals
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
	
	//get all activities
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
			
			this.getFoods();
		}
	}

	//Store all foods in an object (organized by meal ids)
	async getFoods() {
		if(this._isMounted) {
			let headers = {
				'Content-Type': 'application/json',
				'x-access-token': this.token,
			};
			
			for(const dataId of Object.entries(this.state.meals)) {
				for(const data of Object.entries(dataId[1])) {
					if(data[0] === "id") {
						let url = "https://mysqlcs639.cs.wisc.edu/meals/" + data[1] + "/foods";
						
						await fetch(url, {
							method: 'GET',
							headers: headers
						})
						.then((response) => response.json())
						.then((responseData) => {
							if(this._isMounted) {
								let tempFoods = this.state.foods;
								tempFoods[data[1]] = responseData.foods;
								this.setState({foods: tempFoods});
							}
						})
						.catch(error => {
							console.log(error);
						});
					}
				}
			}
		}
	}	
	
	//base code for getting the graph of the summaries
	outputGraphs(percentage, sum, goal, unit, desc, thisSize, thisColor, innerTxt, textGraph) {
		return(
			<View style={styles.container}>
				<ProgressCircle style={{ height: thisSize, width: thisSize }} progressColor={thisColor} backgroundColor={'#E85B30'} progress={percentage} />
				<View style={innerTxt}>
					<Text style={textGraph}>
						{(percentage * 100).toFixed()}%
					</Text>
					<Text style={textGraph}>
						{sum} / {goal} {unit}
					</Text>
					<Text style={textGraph}>
						{desc}
					</Text>
				</View>
			</View>
		);
	}
	
	//helper function for returning percentages, checking if goals were set first
	getPercentage(sum, goal) {
		if(goal === 0.0) {
			return 0.0;
		} else {
			return (sum / goal);
		}
	}
	
	//helper function for outputSummary(), returns different styles based on accessibility
	outputHelper(txtDesc, btn, btnText, totalActivities, totalMeals, durationProgress, sumDuration,
		calBurnProgress, sumCalBurn, carbProgress, sumCarbs, calGainProgress, sumCalGain,
		fatProgress, sumFat, proteinProgress, sumProtein) {
			
		//arrange graphs 1 by 1 if accessibility is enabled
		if(this.visible) {
			return(
				<React.Fragment>
				<Text style={txtDesc}>
					{totalActivities}, {totalMeals}
				</Text>
				<View style={styles.row}>
					{this.outputGraphs(durationProgress, sumDuration, this.state.dailyActivity, "min", "Activity Duration", 300, 'black', darkStyles.innerText, darkStyles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(calBurnProgress, sumCalBurn, this.state.dailyCalories, "burned", "Calories Burned", 300, 'black', darkStyles.innerText, darkStyles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(carbProgress, sumCarbs, this.state.dailyCarbs, "eaten", "Carbohydrates", 300, 'black', darkStyles.innerText, darkStyles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(calGainProgress, sumCalGain, this.state.dailyCalories, "eaten", "Calories Gained", 300, 'black', darkStyles.innerText, darkStyles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(fatProgress, sumFat, this.state.dailyFat, "eaten", "Fat", 300, 'black', darkStyles.innerText, darkStyles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(proteinProgress, sumProtein, this.state.dailyProtein, "eaten", "Protein", 300, 'black', darkStyles.innerText, darkStyles.textGraph)}
				</View>
				<Text></Text>
				<Text style={txtDesc}>
					Net calorie gain: {sumCalGain - sumCalBurn}
				</Text>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={"View past 7 days"}
					onPress={() => this.props.navigation.navigate("Summary", {
						username: this.username,
						token: this.token,
						visible: this.visible
					})}
				/>
				</React.Fragment>
			);
		//arrange graphs 2 by 1 if normal view
		} else {
			return(
				<React.Fragment>
				<Text style={txtDesc}>
					{totalActivities}, {totalMeals}
				</Text>
				<View style={styles.row}>
					{this.outputGraphs(durationProgress, sumDuration, this.state.dailyActivity, "min", "Activity Duration", 135, '#6327AD', styles.innerText, styles.textGraph)}
					{this.outputGraphs(calBurnProgress, sumCalBurn, this.state.dailyCalories, "burned", "Calories Burned", 135, '#6327AD', styles.innerText, styles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(carbProgress, sumCarbs, this.state.dailyCarbs, "eaten", "Carbohydrates", 135, '#6327AD', styles.innerText, styles.textGraph)}
					{this.outputGraphs(calGainProgress, sumCalGain, this.state.dailyCalories, "eaten", "Calories Gained", 135, '#6327AD', styles.innerText, styles.textGraph)}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(fatProgress, sumFat, this.state.dailyFat, "eaten", "Fat", 135, '#6327AD', styles.innerText, styles.textGraph)}
					{this.outputGraphs(proteinProgress, sumProtein, this.state.dailyProtein, "eaten", "Protein", 135, '#6327AD', styles.innerText, styles.textGraph)}
				</View>
				<Text></Text>
				<Text style={txtDesc}>
					Net calorie gain: {sumCalGain - sumCalBurn}
				</Text>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={"View past 7 days"}
					onPress={() => this.props.navigation.navigate("Summary", {
						username: this.username,
						token: this.token,
						visible: this.visible
					})}
				/>
				</React.Fragment>
			);
		}
	}
	
	//returns the aggregated summary at the top
	outputSummary() {
		if(this._isMounted) {
			let numActivities = 0;
			let sumDuration = 0.0;
			let sumCalBurn = 0.0;
			
			//SUMMARY FOR ACTIVITIES:
			if(this.state.activities !== undefined && this.state.activities !== null) {
				for(const dataId of Object.entries(this.state.activities)) {
					let tempDuration = 0;
					let tempCalories = 0;
					let currActivity = false;
					for(const data of Object.entries(dataId[1])) {
						if(data[0] === "duration") {
							tempDuration = data[1];
						} else if (data[0] === "calories") {
							tempCalories = data[1];
						} else if (data[0] === "date") {
							if(new Date(data[1]).toDateString() === this.state.date.toDateString()) {
								currActivity = true;
							}
						}
					}
					//if activity date matches current date:
					if(currActivity) {
						numActivities++;
						sumDuration += tempDuration;
						sumCalBurn += tempCalories;
					}
				}
			}
			
			//SUMMARY FOR MEALS AND FOOD (taken from actual aggregate of food, not random numbers)
			let numMeals = 0;
			let sumCalGain = 0;
			let sumCarbs = 0;
			let sumFat = 0;
			let sumProtein = 0;
			if(this.state.meals !== undefined && this.state.meals !== null) {
				for(const dataId of Object.entries(this.state.meals)) {
					let currentDate = false;
					let currId = 0;
					for(const data of Object.entries(dataId[1])) {
						if(data[0] === "date") {
							if(new Date(data[1]).toDateString() === this.state.date.toDateString()) {
								numMeals++;
								currentDate = true;
							}
						} else if (data[0] === "id") {
							currId = data[1];
						}
					}
					if(currentDate) {
						for(const foodId of Object.entries(this.state.foods)) {
							if(foodId[0] == currId) {
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
					}
				}
			}
			
			//PROGRESS PERCENTAGE VARIABLES
			let durationProgress = this.getPercentage(sumDuration, this.state.dailyActivity);
			let calBurnProgress = this.getPercentage(sumCalBurn, this.state.dailyCalories);
			let carbProgress = this.getPercentage(sumCarbs, this.state.dailyCarbs);
			let calGainProgress = this.getPercentage(sumCalGain, this.state.dailyCalories);
			let fatProgress = this.getPercentage(sumFat, this.state.dailyFat);
			let proteinProgress = this.getPercentage(sumProtein, this.state.dailyProtein);
			
			let totalActivities = pluralize('activity', numActivities, true);
			let totalMeals = pluralize('meal', numMeals, true);
			
			//GET ALL GRAPHS
			if(this.visible) {
				return (
					this.outputHelper(darkStyles.textDesc, darkStyles.button, darkStyles.buttonText, totalActivities, totalMeals, durationProgress, sumDuration,
						calBurnProgress, sumCalBurn, carbProgress, sumCarbs, calGainProgress, sumCalGain, fatProgress, sumFat, proteinProgress, sumProtein)
				);
			} else {
				return (
					this.outputHelper(styles.textDesc, styles.button, styles.buttonText, totalActivities, totalMeals, durationProgress, sumDuration,
						calBurnProgress, sumCalBurn, carbProgress, sumCarbs, calGainProgress, sumCalGain, fatProgress, sumFat, proteinProgress, sumProtein)
				);
			}
		}
	}
	
	//increments or decrements the current date by 1 day (after clicking on the left/right arrows)
	incrementDate(forward) {
		if(forward) {
			let tomorrow = this.state.date;
			tomorrow.setDate(tomorrow.getDate() + 1);
			if(this._isMounted) {
				this.setState({date: tomorrow});
			}
		} else {
			let yesterday = this.state.date;
			yesterday.setDate(yesterday.getDate() - 1);
			if(this._isMounted) {
				this.setState({date: yesterday});
			}
		}
	}
	
	//reorganize navigation controls if accessibility is enabled
	navControls(setContainer, setBtn, btnSize, btnColor, prevContainer, nextContainer) {
		if(this.visible) {
			return (
				<React.Fragment>
					<View style={styles.row}>
						{/*Prev date*/}
						<TouchableOpacity
							onPress={() => this.incrementDate(false)}
							style={setBtn}
						>
							<Ionicons name="md-arrow-dropleft-circle" size={btnSize} color={btnColor} />
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
						{/*Next date*/}
						<TouchableOpacity
							onPress={() => this.incrementDate(true)}
							style={setBtn}
						>
							<Ionicons name="md-arrow-dropright-circle" size={btnSize} color={btnColor} />
						</TouchableOpacity>
					</View>
					<Text></Text>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					{/*Navigate to settings*/}
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
					
					{/*Date navigators*/}
					<View style={prevContainer}>
						<TouchableOpacity
							onPress={() => this.incrementDate(false)}
						>
							<Ionicons name="md-arrow-dropleft-circle" size={btnSize} color={btnColor} />
						</TouchableOpacity>
					</View>
					<View style={nextContainer}>
						<TouchableOpacity
							onPress={() => this.incrementDate(true)}
						>
							<Ionicons name="md-arrow-dropright-circle" size={btnSize} color={btnColor} />
						</TouchableOpacity>
					</View>
				</React.Fragment>
			);
		}
	}
	
	//render() function, dependent on styles or darkStyles depending on if accessibility is enabled
	returnRender(container, setContainer, setBtn, btnSize, btnColor, prevContainer, nextContainer, txtTitle, scrollView, txtStyle, btn, btnText) {
		return (
			<View style={container}>				
				<Text style={txtTitle}>
					{this.state.date.toDateString()}
				</Text>
				
				{this.navControls(setContainer, setBtn, btnSize, btnColor, prevContainer, nextContainer)}
				
				<ScrollView style={scrollView} contentContainerStyle={{ alignItems: 'center' }}>
					{/*Summary section*/}
					<View style={styles.row}>
						<Text style={txtStyle}>
							Summary 
						</Text>
					</View>
					{this.outputSummary()}
					<Ionicons name="md-remove" size={30} color={'white'} />
				</ScrollView>
				
				{/*Buttons for activities or meals*/}
				<View style={styles.row}>
					<Button
						buttonStyle={btn}
						textStyle={btnText}
						text={"View activities"}
						onPress={() => this.props.navigation.navigate("ViewActivities", {
							token: this.token,
							date: this.state.date,
							visible: this.visible
						})}
					/>
					<Button
						buttonStyle={btn}
						textStyle={btnText}
						text={"View meals"}
						onPress={() => this.props.navigation.navigate("ViewMeals", {
							token: this.token,
							date: this.state.date,
							foods: this.state.foods,
							fromHome: true,
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
				return(
					this.returnRender(darkStyles.container, darkStyles.settingsContainer, darkStyles.settingButton, 100, '#1a1a1a', darkStyles.prevDateContainer,
						darkStyles.nextDateContainer, darkStyles.textTitle, darkStyles.scrollView, darkStyles.textStyle, darkStyles.button, darkStyles.buttonText)
				);
			} else {
				return(
					this.returnRender(styles.container, styles.settingsContainer, styles.settingButton, 40, '#27ADA0', styles.prevDateContainer,
						styles.nextDateContainer, styles.textTitle, styles.scrollView, styles.textStyle, styles.button, styles.buttonText)
				);
			}
		} else {
			return(<View></View>);
		}
	}
}

export default CurrDay;