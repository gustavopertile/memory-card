import { StatusBar } from 'expo-status-bar';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';

import React, { useState } from 'react';

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

export default function App() {
	const [task, setTask] = useState([]);
	const [newTask, setNewTask] = useState('');

	const { transcript, resetTranscript } = useSpeechRecognition();

	// adiciona nova tarefa com o que foi dito com voz
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

	// adiciona nova tarefa digitada
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

	// apaga a tarefa selecionada
	async function removeTask(item) {
		// delete a tarefa clicada
		setTask(task.filter((task) => task !== item))

		// alerta para IOS -> funciona apenas no aplicativo
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
						<Text style={styles.Title}>Memory Card <Ionicons name="save-outline" size={30}/></Text>
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
					<StatusBar style="auto" />
					<View style={styles.FormTalk}>
						<TextInput
							style={styles.Input}
							placeholderTextColor="#999"
							autoCorrect={true}
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
							<Ionicons name="add-circle-outline" size={25} color="#FFF" />
						</TouchableOpacity>
					</View>
					<View style={styles.Buttons}>
						<TouchableOpacity
							style={styles.CleanButton}
							onPress={resetTranscript}
							>
							<Text style={styles.TextButton}>Limpar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.StartButton}
							onPress={(e) => {
								e.preventDefault();
								SpeechRecognition.startListening({ continuous: true });
								console.log('escutando');
							}}
							>
							<Ionicons name="mic-outline" size={40} color="#FFF" />
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.StopButton}
							onPress={(e) => {
								e.preventDefault();
								SpeechRecognition.stopListening();
								console.log('não escuto mais então');
							}}
							>
							<Ionicons name="mic-off-outline" size={25} color="#FFF" />
						</TouchableOpacity>
					</View>
					
					<StatusBar style="auto" />
					<View style={styles.Form}>
						<TextInput
							style={styles.Input}
							placeholderTextColor="#999"
							autoCorrect={true}
							placeholder="Não pode falar? Digite"
							onChangeText={(text) => setNewTask(text)}
							value={newTask}
						/>
						<TouchableOpacity
							style={styles.Button}
							onPress={() => addTaskWrite()}
						>
							<Ionicons name="add-circle-outline" size={25} color="#FFF" />
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</>
	);
}

// CSS
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
		alignItems: 'baseline',
		// marginHorizontal: 90,
	},
	Body: {
		flex: 1,
	},
	Form: {
		padding: 0,
		height: 40,
		justifyContent: 'center',
		alignSelf: 'stretch',
		flexDirection: 'row',
		paddingTop: 0,
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
		textAlign: 'start'
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
	Buttons: {
		padding: 0,
		height: 120,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginVertical: 5
	},
	StartButton: {
		height: 120,
		width: 120,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#4CAF50',
		backgroundColor: '#4CAF50',
		borderWidth: 2,
		borderRadius: 100,
		marginHorizontal: 40,
		marginBottom: 10
	},
	TextButton: {
		color: 'white',
		fontSize: 16,
	},
	CleanButton: {
		height: 80,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#555555',
		backgroundColor: '#555555',
		borderWidth: 2,
		borderRadius: 100,
		marginHorizontal: 'auto',
		marginBottom: 10
	},
	StopButton: {
		height: 80,
		width: 80,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#f44336',
		backgroundColor: '#f44336',
		borderWidth: 2,
		borderRadius: 100,
		marginHorizontal: 'auto',
		marginBottom: 10
	},
	FormTalk: {
		padding: 0,
		height: 60,
		justifyContent: 'center',
		alignSelf: 'stretch',
		flexDirection: 'row',
		paddingTop: 13,
		borderTopWidth: 1,
		borderColor: '#eee',
	},
});
