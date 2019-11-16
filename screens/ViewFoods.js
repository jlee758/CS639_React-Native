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

class ViewFoods extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			foods: {},
			message: {}
		}
		this.token = this.props.navigation.state.params.token;
		this.mealName = this.props.navigation.state.params.currName;
		this.id = this.props.navigation.state.params.currId;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.date = this.props.navigation.state.params.date;
	}
	
	//call getFoods to render components
	componentDidMount() {
		this._isMounted = true;
		this.getFoods();
	}
	
	componentWillUnmount() {
		this._isMounted = false;
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
	outputFoods() {
		if(this._isMounted) {
			this.getFoods();
			let foodOutput = [];
			
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
						} else if (data[0] === "protein") {
							protein = data[1];
						} else if (data[0] === "carbohydrates") {
							carbs = data[1];
						} else if (data[0] === "fat") {
							fat = data[1];
						}
					}
					foodOutput.push(
						<React.Fragment key={dataId[0]}>
							<Button
								buttonStyle={styles.foodButton}
								textStyle={styles.buttonText}
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
									mealId: this.id
								})}
							/>
						</React.Fragment>
					);
					}
				}
			//indicate to the user that no foods exist yet
			if(foodOutput.length === 0) {
				return (<Text style={styles.textDesc}>No foods found!</Text>);
			}
			return foodOutput;
		}
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
					
					{/*Title texts*/}
					<View style={styles.row}>
						<Text style={styles.textTitle}>
							{this.date.toDateString()}
						</Text>
						<Text style={styles.textStyle}>
							Foods for {this.mealName}
						</Text>
					</View>
					
					{/*List of interactible foods*/}
					<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
						{this.outputFoods()}
					</ScrollView>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
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
							mealId: this.id
						})}
					/>
					<Button
						buttonStyle={styles.button}
						textStyle={styles.buttonText}
						text={'Edit meal'}
						onPress={() => this.props.navigation.navigate("Meals", {
							token: this.token,
							currId: this.id,
							currName: this.mealName,
							date: this.props.navigation.state.params.stringDate,
							typeUpdate: true
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
	foodButton: {
		width: Dimensions.get('window').width * 0.7,
		height: 130,
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

export default ViewFoods;