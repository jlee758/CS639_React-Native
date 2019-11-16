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

class ViewMeals extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			meals: {},
			message: {},
		}
		this.token = this.props.navigation.state.params.token;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.date = this.props.navigation.state.params.date;
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
	outputMeals() {
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
					
					//only return meals for the current date
					if(date === this.date.toDateString()) {
						mealOutput.push(
							<React.Fragment key={dataId[0]}>
								<Button
									buttonStyle={styles.mealButton}
									textStyle={styles.buttonText}
									text={name + "\n" + date + " (" + hour + ":" + min + ")"}
									onPress={() => this.props.navigation.navigate("ViewFoods", {
										token: this.token,
										currId: id,
										currName: name,
										date: this.date,
										stringDate: String(year) + "-" + String(month) + "-" + String(day) + " " + String(hour) + ":" + String(min),
										typeUpdate: true
									})}
								/>
							</React.Fragment>
						);
					}
				}
			}
			//indicate to the user that no meals exist yet
			if(mealOutput.length === 0) {
				return (<Text style={styles.textDesc}>No meals found!</Text>);
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
					
					{/*Text titles*/}
					<View style={styles.row}>
						<Text style={styles.textTitle}>
							{this.date.toDateString()}
						</Text>
						<Text style={styles.textStyle}>
							Meals
						</Text>
					</View>
					
					{/*List of interactible meals*/}
					<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
						{this.outputMeals()}
					</ScrollView>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text={'Add new meal'}
						onPress={() => this.props.navigation.navigate("Meals", {
							token: this.token,
							currId: "",
							currName: "",
							date: this.getDate(),
							typeUpdate: false
						})}
					/>
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
	button: {
		width: 200,
		height: 50,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#27ADA0'
	}, 
	mealButton: {
		width: Dimensions.get('window').width * 0.7,
		height: 80,
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
	textStyle: {
		fontSize: 25,
		color: '#27ADA0',
		textAlign: 'center',
		padding: 5
	},
	textTitle: {
		fontSize: 30,
		color: '#27ADA0',
		padding: 20,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	textDesc: {
		fontSize: 18,
		color: '#6327AD'
	},
	scrollView: {
		flex: 1,
		width: Dimensions.get('window').width * 0.8
	}
})

export default ViewMeals;