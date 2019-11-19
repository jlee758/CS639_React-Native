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

class ViewActivities extends React.Component {
	//ensure no update state on unmounted components
	_isMounted = false;
	
	constructor(props) {
		super(props);
		this.state = {
			activities: {},
			message: {}
		}
		this.token = this.props.navigation.state.params.token;
		this.typeUpdate = this.props.navigation.state.params.typeUpdate;
		this.date = this.props.navigation.state.params.date;
		this.visible = this.props.navigation.state.params.visible;
	}
	
	//call getActivities to render components
	componentDidMount() {
		this._isMounted = true;
		this.getActivities();
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}
	
	//Store all activities in an object (needed to check for duplicates)
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
	
	//returns all created activity as clickable buttons
	outputActivities(activityBtn, innerBtnText, textDesc) {
		if(this._isMounted) {
			this.getActivities();
			let activityOutput = [];
			
			if(this.state.activities !== undefined && this.state.activities !== null) {
				for(const dataId of Object.entries(this.state.activities)) {
					let name, duration, calories, id, date = "";
					let day, month, year, hour, min = "";
					for(const data of Object.entries(dataId[1])) {
						if(data[0] === "name") {
							name = data[1];
						} else if (data[0] === "duration") {
							duration = data[1];
						} else if (data[0] === "calories") {
							calories = data[1];
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
					
					//only return activities for the current date
					if(date === this.date.toDateString()) {
						activityOutput.push(
							<React.Fragment key={dataId[0]}>
								<Button
									buttonStyle={activityBtn}
									textStyle={innerBtnText}
									text={name + "\n" + date + " (" + hour + ":" + min + ")\n" + duration + " minutes\n" + calories + " calories"}
									onPress={() => this.props.navigation.navigate("Activities", {
										token: this.token,
										currId: id,
										currName: name,
										currDuration: duration,
										currCals: calories,
										date: String(year) + "-" + String(month) + "-" + String(day) + " " + String(hour) + ":" + String(min),
										typeUpdate: true,
										visible: this.visible
									})}
								/>
							</React.Fragment>
						);
					}
				}
			}
			//indicate to the user that no activities exist yet
			if(activityOutput.length === 0) {
				return (<Text style={textDesc}>No activities found!</Text>);
			}
			return activityOutput;
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
	returnRender(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn, txtTitle, txtStyle, btn, btnText, activityBtn, innerBtnText, textDesc) {
		return (
			<View style={styles.container}>				
				{/*Title texts*/}
				<View style={styles.row}>
					<Text style={txtTitle}>
						{this.date.toDateString()}
					</Text>
					<Text style={txtStyle}>
						Activities
					</Text>
				</View>
				
				{this.navControls(backBtnContainer, backBtn, btnSize, btnColor, setContainer, setBtn)}
				
				{/*List of interactible activities*/}
				<ScrollView style={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
					{this.outputActivities(activityBtn, innerBtnText, textDesc)}
				</ScrollView>
				<Button
					buttonStyle={btn}
					textStyle={btnText}
					text={'Add new activity'}
					onPress={() => this.props.navigation.navigate("Activities", {
						token: this.token,
						currId: "",
						currName: "",
						currDuration: "",
						currCals: "",
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
						darkStyles.textTitle, darkStyles.textStyle, darkStyles.button, darkStyles.buttonText, darkStyles.activityButton, darkStyles.innerButtonText, darkStyles.textDesc)
				);
			} else {
				return (
					this.returnRender(styles.backButtonContainer, styles.backButton, 40, '#27ADA0', styles.settingsContainer, styles.settingButton,
						styles.textTitle, styles.textStyle, styles.button, styles.buttonText, styles.activityButton, styles.buttonText, styles.textDesc)
				);
			}
		} else {
			return (<View></View>);
		}
	}
}

export default ViewActivities;