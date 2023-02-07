import React from 'react';
import MicIcon from '@mui/icons-material/Mic';
import { Box } from '@mui/material';
import Image from '../components/Image';

export default function About() {
  const [listening, setListening] = React.useState(false);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const startListening = () => {
    setListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      setListening(false);
      console.log('12345', event.results[0][0].transcript);
      // Perform a search based on the transcript
    };
  };

  const stopListening = () => {
    setListening(false);
    recognition.stop();
  };

  return (
    <div>
      <button className="mt-24" onClick={listening ? stopListening : startListening}>
        {listening ? (
          <Box className="bg-red-500 w-9 h-9 rounded-full flex justify-center items-center">
            <MicIcon sx={{ color: 'white', width: 30, height: 30 }} />
          </Box>
        ) : (
          <Image alt="sketch icon" src="/icons/ic_mic.svg" sx={{ width: 30, height: 30, mr: 1 }} />
        )}
      </button>

      {listening && <p>Listening...</p>}
    </div>
  );
}
