import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import Button from '../Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProgressCircle } from 'react-native-svg-charts';
import pluralize from 'pluralize';

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
			firstName: "",
			lastName: "",
			dailyActivity: 0.0,
			dailyCalories: 0.0,
			dailyCarbs: 0.0,
			dailyFat: 0.0,
			dailyProtein: 0.0,
		}
		this.username = this.props.navigation.state.params.username;
		this.token = this.props.navigation.state.params.token;
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
	outputGraphs(percentage, sum, goal, unit, desc) {
		return(
			<View style={styles.container}>
				<ProgressCircle style={{ height: 135, width: 135 }} progressColor={'#6327AD'} backgroundColor={'#E85B30'} progress={percentage} />
				<View style={styles.innerText}>
					<Text style={styles.textGraph}>
						{(percentage * 100).toFixed()}%
					</Text>
					<Text style={styles.textGraph}>
						{sum} / {goal} {unit}
					</Text>
					<Text style={styles.textGraph}>
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
			return(
				<React.Fragment>
				<Text style={styles.textDesc}>
					{totalActivities}, {totalMeals}
				</Text>
				<View style={styles.row}>
					{this.outputGraphs(durationProgress, sumDuration, this.state.dailyActivity, "min", "Activity Duration")}
					{this.outputGraphs(calBurnProgress, sumCalBurn, this.state.dailyCalories, "burned", "Calories Burned")}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(carbProgress, sumCarbs, this.state.dailyCarbs, "eaten", "Carbohydrates")}
					{this.outputGraphs(calGainProgress, sumCalGain, this.state.dailyCalories, "eaten", "Calories Gained")}
				</View>
				<View style={styles.row}>
					{this.outputGraphs(fatProgress, sumFat, this.state.dailyFat, "eaten", "Fat")}
					{this.outputGraphs(proteinProgress, sumProtein, this.state.dailyProtein, "eaten", "Protein")}
				</View>
				<Text></Text>
				<Text style={styles.textDesc}>
					Net calorie gain: {sumCalGain - sumCalBurn}
				</Text>
				</React.Fragment>
			);
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
	
	render() {
		if(this._isMounted) {
		return (
			<View style={styles.container}>
				{/*Navigate to settings*/}
				<View style={styles.settingsContainer}>
					<TouchableOpacity
						onPress={() => this.props.navigation.navigate("Settings", {
							username: this.username,
							token: this.token
					})}
						style={styles.settingButton}
					>
						<Ionicons name="md-settings" size={40} color={'#27ADA0'} />
					</TouchableOpacity>
				</View>
				
				{/*Date navigators*/}
				<View style={styles.prevDateContainer}>
					<TouchableOpacity
						onPress={() => this.incrementDate(false)}
						style={styles.backButton}
					>
						<Ionicons name="md-arrow-dropleft-circle" size={40} color={'#27ADA0'} />
					</TouchableOpacity>
				</View>
				<View style={styles.nextDateContainer}>
					<TouchableOpacity
						onPress={() => this.incrementDate(true)}
						style={styles.backButton}
					>
						<Ionicons name="md-arrow-dropright-circle" size={40} color={'#27ADA0'} />
					</TouchableOpacity>
				</View>
				
				<Text style={styles.textTitle}>
					{this.state.date.toDateString()}
				</Text>
				
				<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
					{/*Summary section*/}
					<View style={styles.row}>
						<Text style={styles.textStyle}>
							Summary 
						</Text>
					</View>
					{this.outputSummary()}
					<Ionicons name="md-remove" size={30} color={'white'} />
				</ScrollView>
				
				{/*Buttons for activities or meals*/}
				<View style={styles.row}>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text={"View activities"}
						onPress={() => this.props.navigation.navigate("ViewActivities", {
							token: this.token,
							date: this.state.date
						})}
					/>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text={"View meals"}
						onPress={() => this.props.navigation.navigate("ViewMeals", {
							token: this.token,
							date: this.state.date
						})}
					/>

				</View>
			</View>
		);
		} else {
			return(<View></View>);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}, 
	settingsContainer: {
		position: 'absolute',
		top: 70,
		right: 10
	},
	settingButton: {
		alignItems: 'center',
		width: 50,
		height: 50
	},
	prevDateContainer: {
		position: 'absolute',
		top: Dimensions.get('window').height * 0.5,
		left: 10
	},
	nextDateContainer: {
		position: 'absolute',
		top: Dimensions.get('window').height * 0.5,
		right: 10
	},
	innerText: {
		position: 'absolute',
		top: 30,
	},
	button: {
		width: 200,
		height: 50,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#27ADA0',
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
	buttonText: {
		fontSize: 18,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center'
	},
	textTitle: {
		fontSize: 30,
		color: '#27ADA0',
		padding: 20,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	textStyle: {
		fontSize: 25,
		color: '#27ADA0',
		padding: 2
	},
	textDesc: {
		fontSize: 18,
		color: '#6327AD'
	},
	textGraph: {
		textAlign: 'center',
		fontSize: 16,
		color: '#217A1C'
	},
	row: {
		flexDirection: 'row'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	}
})

export default CurrDay;