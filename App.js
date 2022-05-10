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
	const [task, setTask] = useState([]); // variáveis é escrito
	const [newTask, setNewTask] = useState(''); // variáveis para nova tarefa

	const { transcript, resetTranscript } = useSpeechRecognition(); // variáveis do speech to text

	// adiciona nova tarefa com o que foi dito com voz
	async function addTask() {
		const search = task.filter((task) => task === transcript); // pesquisa se já existe uma tarefa igual

		if (search.length !== 0) {
			console.log('Você já possui uma nota igual.');
			alert('Atenção, você já possui uma nota igual.');
			return;
		}

		setTask([...task, transcript]); // se não tiver uma tarefa igual, a tarefa é adicionada
		setNewTask(''); // limpa o campo
	}

	// adiciona nova tarefa digitada
	async function addTaskWrite() {
		const search = task.filter((task) => task === newTask); //  pesquisa se já existe uma tarefa igual

		if (search.length !== 0) {
			alert('Atenção você já possui uma nota igual.');
			return;
		}

		setTask([...task, newTask]); // se não tiver uma tarefa igual, a tarefa é adicionada
		setNewTask('');

		Keyboard.dismiss(); // fecha o teclado (IOS)
	}

	// apaga a tarefa selecionada
	async function removeTask(item) {
		setTask(task.filter((task) => task !== item)) // delete a tarefa clicada

		// alerta para IOS -> funciona apenas no aplicativo
		alert(
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
					onPress: () => setTask(task.filter((task) => task === newTask)), // se clicado para confirmar apaga a tarefa -> IOS
				},
			],
			{ cancelable: false }
		);
	}

	return (
		<>
			{/* para não quebrar a página ao abrir o teclado no celular */}
			<KeyboardAvoidingView
				keyboardVerticalOffset={0}
				behavior="padding"
				style={{ flex: 1 }}
				enabled={Platform.OS === 'ios'}
			>
				<View style={styles.container}>
					<View style={styles.Body}>
						<Text style={styles.Title}>Memory Card <Ionicons name="save-outline" size={30}/></Text>
						{/* Lista de Itens */}
						<FlatList
							style={styles.FlatList}
							data={task}
							keyExtractor={(item) => item.toString()}
							showsVerticalScrollIndicator={false}
							// Item 
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
					{/* Espaço onde mostra o texto que foi escutado pela IA */}
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
								// Adiciona a tarefa entendida pela IA e para de "escutar"
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
							// Limpa o campo de texto que foi entendido pela IA
							onPress={resetTranscript}
							>
							<Text style={styles.TextButton}>Limpar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.StartButton}
							onPress={(e) => {
								e.preventDefault();
								// Ativa o Speech to Text, começa a "escutar"
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
								// Desativa o Speech to Text, para de "escutar"
								SpeechRecognition.stopListening();
								console.log('não escuto mais então');
							}}
							>
							<Ionicons name="mic-off-outline" size={25} color="#FFF" />
						</TouchableOpacity>
					</View>
					
					<StatusBar style="auto" />
					<View style={styles.Form}>
						{/* Espaço para escrever a tarefa na mão */}
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
							// Adiciona a tarefa escrita
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
		alignItems: 'baseline'
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
