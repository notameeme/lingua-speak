import React, { useState } from "react";
import { IconMicrophone } from "@tabler/icons-react";

const SpeechRecognitionComponent = ({ setSourceText }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const startListening = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Speech Recognition API is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setSourceText(transcript);
      };

      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`);
      };

      recognition.start();
    } catch (err) {
      setError("An unexpected error occurred while accessing the microphone.");
      console.error(err);
    }
  };

  return (
    <div className="cursor-pointer flex items-center space-x-2 flex-row">
      <IconMicrophone
        size={22}
        className={`cursor-pointer ${isListening ? "text-blue-500" : "text-gray-400"}`}
        onClick={startListening} 
      />
      {error && <p className="text-red-500 text-sm"></p>}
    </div>
  );
};

export default SpeechRecognitionComponent;
