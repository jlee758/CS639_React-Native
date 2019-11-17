import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import { Line } from 'react-native-svg';

class PastSummary extends React.Component {
	_isMounted = false;
		
	constructor(props) {
		super(props);
		this.state = {
			activities: {},
			meals: {},
			foods: {},
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
	outputGraphs(currGoal, currType, currData) {
		//shows a straight line for each graph indicating the metric's goal
		//if all days had values less than the goal, then the goal line will not show on the graph
		const GoalLine = (({ y }) => (
			<Line
				key={ 'zero-axis' }
				x1={ '0%' }
				x2={ '100%' }
				y1={ y(currGoal) }
				y2={ y(currGoal) }
				stroke={'#6327AD'}
				strokeDashArray={ [4, 8] }
				strokeWidth={ 2 }
			/>
		));
	
		return(
			<React.Fragment>
				{/*Graph title*/}
				<Text style={styles.textDesc}>
					{currType}
				</Text>
				<Text style={styles.textDesc}>
					for each day since today
				</Text>
				
				<View style={styles.graphContainer}>
					<YAxis
						data={currData}
						style={{ marginBottom: 30 }}
						contentInset={{ top: 10, bottom: 10 }}
						svg={{ fontSize: 10, fill: '#27ADA0' }}
					/>
					<View style={{ flex: 1, marginLeft: 10 }}>
						<LineChart
							style={{ flex: 1 }}
							data={currData}
							svg={{ stroke: '#27ADA0' }}
							contentInset={{ top: 10, bottom: 10 }}
						>
							<Grid />
							<GoalLine />
						</LineChart>
						{/*X axis labels are days since today. (e.g. -1 means 1 day before today, while 0 means today) */}
						<XAxis
							style={{ marginHorizontal: -10, height: 30 }}
							data={currData}
							formatLabel={(value, index) => (index - 6)}
							contentInset={{ left: 10, right: 10 }}
							svg={{ fontSize: 10, fill: '#27ADA0' }}
						/>
					</View>
				</View>
			</React.Fragment>
		);
	}
	
	//gets the aggregated summary for each day, and outputs the corresponding graphs
	outputSummary() {
		if(this._isMounted) {
			//each element of daySummaries corresponds to a day within the past 7 days
			//each element holds another array of data
			let daySummaries = [];
			
			//set the date parameters
			let currDay = new Date();
			currDay.setDate(currDay.getDate() - 6);
			
			for(let i = 0; i < 7; i++) {
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
								if(new Date(data[1]).toDateString() === currDay.toDateString()) {
									currActivity = true;
								}
							}
						}
						//if activity date matches current date:
						if(currActivity) {
							sumDuration += tempDuration;
							sumCalBurn += tempCalories;
						}
					}
				}
				
				//SUMMARY FOR MEALS AND FOOD (taken from actual aggregate of food, not random numbers)
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
								if(new Date(data[1]).toDateString() === currDay.toDateString()) {
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
				
				//STORE DATA FOR EACH DAY
				let tempData = [];
				tempData[0] = sumDuration;
				tempData[1] = sumCalBurn;
				tempData[2] = sumCalGain;
				tempData[3] = sumCarbs;
				tempData[4] = sumFat;
				tempData[5] = sumProtein;		
				daySummaries[i] = tempData;
		
				//move to the next day
				currDay.setDate(currDay.getDate() + 1);
			}
			
			//organize the data by type instead of by day
			let durationData = [];
			let calBurnData = [];
			let calGainData = [];
			let carbData = [];
			let fatData = [];
			let proteinData = [];
			for(let j = 0; j < daySummaries.length; j++) {
				durationData.push(daySummaries[j][0]);
				calBurnData.push(daySummaries[j][1]);
				calGainData.push(daySummaries[j][2]);
				carbData.push(daySummaries[j][3]);
				fatData.push(daySummaries[j][4]);
				proteinData.push(daySummaries[j][5]);
			}
			
			//return the graphs
			return (
				<React.Fragment>
					{this.outputGraphs(this.state.dailyActivity, "Duration", durationData)}
					{this.outputGraphs(this.state.dailyCalories, "Calories burnt", calBurnData)}
					{this.outputGraphs(this.state.dailyCalories, "Calories gained", calGainData)}
					{this.outputGraphs(this.state.dailyCarbs, "Carbohydrates", carbData)}
					{this.outputGraphs(this.state.dailyFat, "Fat", fatData)}
					{this.outputGraphs(this.state.dailyProtein, "Protein", proteinData)}
				</React.Fragment>
			);
		}
	}
	
	//display which days are considered in the 7 day summary
	dateHeader() {
		let currDate = new Date();
		let firstDate = new Date();
		firstDate.setDate(firstDate.getDate() - 6);
		
		return(
			<React.Fragment>
				<Text style={styles.textStyle}>
					{firstDate.toDateString()}
				</Text>
				<Text style={styles.textStyle}>
					to
				</Text>
				<Text style={styles.textStyle}>
					{currDate.toDateString()}
				</Text>
			</React.Fragment>
		);
	}
	
	render() {
		if(this._isMounted) {
			return (
				<View style={styles.container}>
					{/*Navigation controls*/}
					<View style={styles.backButtonContainer}>
						<TouchableOpacity
							onPress={() => this.props.navigation.goBack()}
							style={styles.backButton}
						>
							<Ionicons name="md-arrow-back" size={40} color={'#27ADA0'} />
						</TouchableOpacity>
					</View>
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
					
					<Text style={styles.textTitle}>
						Statistics for past 7 days
					</Text>
					
					<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
						{/*Summary section*/}
						{this.dateHeader()}
						<Text></Text>
						{this.outputSummary()}
						<Ionicons name="md-remove" size={30} color={'white'} />
					</ScrollView>
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
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	},
	graphContainer: {
		height: 300,
		padding: 20,
		flexDirection: 'row',
	}
})

export default PastSummary;