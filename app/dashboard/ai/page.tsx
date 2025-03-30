'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const questions = [
  "Hi, I’m your health assistant. What’s your name?",
  "Nice to meet you, [name]! How old are you?",
  "What symptoms are you feeling today, [name]?",
  "Any past medical history?",
  "Are you on any medications?"
];

export default function Page() {
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [message, setMessage] = useState('');
  const [patientData, setPatientData] = useState<{ name?: string; age?: string; symptoms?: string; history?: string; medications?: string }>({});
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    addMessageToChat('bot', questions[0]);
  }, []);

  const addMessageToChat = (role: string, content: string) => {
    setChatHistory((prev) => [...prev, { role, content }]);
    if (role === 'bot') speak(content);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const getNextResponse = (userMessage: string) => {
    let updatedData = { ...patientData };
    if (questionIndex === 0) updatedData.name = userMessage;
    else if (questionIndex === 1) updatedData.age = userMessage;
    else if (questionIndex === 2) updatedData.symptoms = userMessage;
    else if (questionIndex === 3) updatedData.history = userMessage;
    else if (questionIndex === 4) {
      updatedData.medications = userMessage;
      return `Thanks, ${updatedData.name}! Based on your age (${updatedData.age}) and symptoms (${updatedData.symptoms}), try resting and staying hydrated. See a doctor for a full check-up.`;
    }
    setPatientData(updatedData);
    setQuestionIndex((prev) => prev + 1);
    return questions[questionIndex + 1].replace('[name]', updatedData.name || '');
  };

  const handleSend = () => {
    if (message.trim()) {
      addMessageToChat('user', message);
      setTimeout(() => addMessageToChat('bot', getNextResponse(message)), 300);
      setMessage('');
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
  
    recognition.onresult = (event: any) => {
      const userMessage = event.results[0][0].transcript;
      addMessageToChat("user", userMessage);
      setTimeout(() => addMessageToChat("bot", getNextResponse(userMessage)), 300);
    };
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-4">
      <div className="w-full max-w-lg p-4 rounded-2xl bg-opacity-10 backdrop-blur-lg">
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl max-w-[80%] backdrop-blur-md ${msg.role === 'user' ? 'ml-auto bg-white/20 text-right' : 'mr-auto bg-white/30'}`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-lg text-black outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="p-3 bg-cyan-500 rounded-full hover:bg-cyan-600">▶</button>
          <button onClick={handleVoiceInput} className="p-3 bg-gray-500 rounded-full hover:bg-gray-600">🎤</button>
        </div>
      </div>
    </div>
  );
}
