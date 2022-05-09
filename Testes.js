import { StatusBar } from 'expo-status-bar';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';

import React, { useState, useEffect, AsyncStorage } from 'react';

import {
	StyleSheet,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Keyboard,
	Alert,
} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import SpeechToText from './SpeechToText';

export default function App() {
	const [task, setTask] = useState([]);
	const [newTask, setNewTask] = useState('');

	const { transcript, resetTranscript } = useSpeechRecognition();

	// useEffect(() => {
	// 	SpeechRecognition.startListening({ continuous: true });
	// 	console.log('escutando');
	// }, []);

	// const {
	// 	transcript,
	// 	listening,
	// 	resetTranscript,
	// 	browserSupportsSpeechRecognition,
	// } = useSpeechRecognition();

	// if (!browserSupportsSpeechRecognition) {
	// 	return <Text>Browser doesn't support speech recognition.</Text>;
	// }

	// const [recording, setRecording] = useState();
	// const [recordings, setRecordings] = useState([]);
	// const [message, setMessage] = useState('');

	// async function startRecording() {
	// 	try {
	// 		const permission = await Audio.requestPermissionAsync();

	// 		if(permission.status = 'granted') {
	// 			await Audio.setAudioModeAsync({
	// 				allowsRecordingIOS: true,
	// 				playsInSilentModeIOS: true
	// 			});

	// 			const { recording } = await Audio.Recording.createAsync(
	// 				Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
	// 			);

	// 			setRecording(recording);
	// 		} else {
	// 			setMessage('Garanta que dê permissão ao app para acessar o microfone')
	// 		}
	// 	}
	// 	catch (err) {
	// 		console.log('Erro ao começar a gravar', err);
	// 	}
	// }

	// async function stopRecording() {
	// 	setRecording(undefined);
	// 	await recording.stopAndUnloadAsync();

	// 	let updateRecordings = [...recordings];
	// 	const { sound, status } = await recording.createNewLoadedSoundAsync();
	// 	updateRecordings.push({
	// 		sound: sound,
	// 		duration: getDurationFormatted(status.durationMillis),
	// 		file: recording.getURI()
	// 	});

	// 	setRecordings(updateRecordings);
	// }

	async function addTask() {
		const search = task.filter((task) => task === transcript);

		if (search.length !== 0) {
			Alert.alert('Atenção', 'Você já possui uma nota igual.');
			return;
		}

		setTask([...task, transcript]);
		setNewTask('');

		Keyboard.dismiss();
	}

	async function addTaskWrite() {
		const search = task.filter((task) => task === newTask);

		if (search.length !== 0) {
			Alert.alert('Atenção', 'Você já possui uma nota igual.');
			return;
		}

		setTask([...task, newTask]);
		setNewTask('');

		Keyboard.dismiss();
	}

	async function removeTask(item) {
		Alert.alert(
			'Deletar Nota',
			'Tem certeza que deseja remover esta anotação?',
			[
				{
					text: 'Cancel',
					onPress: () => {
						return;
					},
					style: 'cancel',
				},
				{
					text: 'OK',
					onPress: () => setTask(task.filter((task) => task === newTask)),
				},
			],
			{ cancelable: false }
		);
	}

	// useEffect(() => {
	// 	async function carregaDados() {
	// 		const task = await AsyncStorage.getItem('task');

	// 		if(task) {
	// 			setTask(JSON.parse(task));
	// 		}
	// 	}
	// 	carregaDados();
	// }, [])

	// useEffect(() => {
	// 	async function salvaDados() {
	// 		AsyncStorage.setItem('task', JSON.stringify(task))
	// 	}
	// 	salvaDados();
	// }, [task])

	return (
		<>
			<KeyboardAvoidingView
				keyboardVerticalOffset={0}
				behavior="padding"
				style={{ flex: 1 }}
				enabled={Platform.OS === 'ios'}
			>
				<View style={styles.container}>
					<View style={styles.Body}>
						<Text style={styles.Title}>Memory Card</Text>
						<TextInput
							style={styles.Input}
							value={transcript}
							placeholder={transcript}
						></TextInput>
						<FlatList
							style={styles.FlatList}
							data={task}
							keyExtractor={(item) => item.toString()}
							showsVerticalScrollIndicator={false}
							renderItem={({ item }) => (
								<View style={styles.Card}>
									<Text style={styles.CardText}>{item}</Text>
									<TouchableOpacity onPress={() => removeTask(item)}>
										<MaterialIcons
											name="delete-forever"
											size={25}
											color="#f64c75"
										/>
									</TouchableOpacity>
								</View>
							)}
						/>
					</View>
					<TouchableOpacity
							style={styles.StartButton}
							onPress={(e) => {
								e.preventDefault();
								SpeechRecognition.startListening({ continuous: true });
								console.log('escutando');
							}}
						>
							<Text style={styles.TextStart}>Falar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.CleanButton}
							onPress={resetTranscript}
						>
							<Text>Limpar</Text>
						</TouchableOpacity>
					<StatusBar style="auto" />
					<View style={styles.Form}>
						<TouchableOpacity
							style={styles.Button}
							onPress={(e) => {
								e.preventDefault();
								SpeechRecognition.stopListening();
								console.log('não escuto mais então');
							}}
						>
							<Text>Parar de Escutar</Text>
						</TouchableOpacity>
						<TextInput
							style={styles.Input}
							placeholderTextColor="#999"
							autoCorrect={true}
							placeholder="Adicione uma tarefa"
							onChangeText={(text) => setNewTask(text)}
							value={transcript}
						/>
						<TouchableOpacity
							style={styles.Button}
							onPress={() => {
								addTask();
								SpeechRecognition.stopListening();
								resetTranscript;
							}}
						>
							<Ionicons name="ios-add" size={25} color="#FFF" />
						</TouchableOpacity>
					</View>
					<StatusBar style="auto" />
					<View style={styles.Form}>
						<TextInput
							style={styles.Input}
							placeholderTextColor="#999"
							autoCorrect={true}
							placeholder="Adicione uma tarefa"
							onChangeText={(text) => setNewTask(text)}
							value={newTask}
						/>
						<TouchableOpacity
							style={styles.Button}
							onPress={() => addTaskWrite()}
						>
							<Ionicons name="ios-add" size={25} color="#FFF" />
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		paddingVertical: 25,
		marginTop: 20,
	},
	Title: {
		fontSize: 30,
		paddingVertical: 0,
		marginHorizontal: 'auto',
	},
	Body: {
		flex: 1,
	},
	Form: {
		padding: 0,
		height: 60,
		justifyContent: 'center',
		alignSelf: 'stretch',
		flexDirection: 'row',
		paddingTop: 13,
		borderTopWidth: 1,
		borderColor: '#eee',
	},
	Input: {
		flex: 1,
		height: 40,
		backgroundColor: '#eee',
		borderRadius: 4,
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#eee',
	},
	Button: {
		height: 40,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1c6cce',
		borderRadius: 4,
		marginLeft: 10,
	},
	FlatList: {
		flex: 1,
		marginTop: 10,
	},
	Card: {
		marginBottom: 15,
		padding: 15,
		borderRadius: 4,
		backgroundColor: '#eee',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#eee',
	},
	CardText: {
		fontSize: 14,
		color: '#333',
		marginTop: 4,
		textAlign: 'center',
	},
	StartButton: {
		height: 100,
		width: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#39FF14',
		backgroundColor: '#eee',
		borderWidth: 2,
		borderRadius: 100,
		marginHorizontal: 'auto',
		marginBottom: 10
	},
	TextStart: {
		color: '#000',
		fontSize: 18,

	}
});
