import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechToText = () => {
   const {transcript, resetTranscript} = useSpeechRecognition();

   useEffect(() => {
      SpeechRecognition.startListening({continuous: true});
      console.log('escutando');
   }, [])

	return (
         <div>
            <form>
               <textarea value={transcript}></textarea>
               <button onClick={resetTranscript}>Limpar</button>
               <button onClick={(e) => {
                  e.preventDefault();
                  SpeechRecognition.stopListening()
                  console.log('não escuto mais então')
               }}>Parar de Escutar</button>
            </form>
         </div>
	);
};

export default SpeechToText;
