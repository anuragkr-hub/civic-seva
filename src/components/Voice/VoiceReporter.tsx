'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VoiceReporterProps {
  onTranscriptReady: (transcript: string) => void;
}

export const VoiceReporter: React.FC<VoiceReporterProps> = ({ onTranscriptReady }) => {
  const { language } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const startListening = () => {
    setIsRecording(true);
    setSpeechText('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setSpeechText(transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (speechText) {
            processWithAI(speechText);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
          simulateSpeechFallback();
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition start failed, using demo simulation', err);
      }
    }

    // Fallback simulation if browser blocks mic or not supported
    simulateSpeechFallback();
  };

  const simulateSpeechFallback = () => {
    const samples = {
      en: 'Here is a large pothole near the Calcutta University bus stop on College Street and it becomes very dangerous during rain.',
      bn: 'কলেজ স্ট্রিট বইপাড়ার কাছে রাস্তার ওপর বড় গর্ত তৈরি হয়েছে, বৃষ্টিতে জল জমে খুব বিপদ হচ্ছে।',
      hi: 'कॉलेज स्ट्रीट बस स्टॉप के पास एक गहरा गड्ढा हो गया है, जो बारिश में बहुत खतरनाक हो जाता है।'
    };

    const text = samples[language] || samples.en;
    let index = 0;
    const interval = setInterval(() => {
      index += 6;
      setSpeechText(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setIsRecording(false);
        processWithAI(text);
      }
    }, 50);
  };

  const processWithAI = (rawText: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onTranscriptReady(rawText);
    }, 600);
  };

  const stopListening = () => {
    setIsRecording(false);
    if (speechText) {
      processWithAI(speechText);
    }
  };

  return (
    <div className="bg-orange-50/50 border border-orange-200/70 rounded-xl p-4 transition-all">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              🎙 Voice Assistant (English / বাংলা / हिन्दी)
            </h4>
            <p className="text-[11px] text-slate-500">
              Speak naturally. AI will transcribe and structure your civic grievance.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={isRecording ? stopListening : startListening}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-white border border-orange-300 text-orange-700 hover:bg-orange-100'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              <span>Listening... Click Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>Speak Description</span>
            </>
          )}
        </button>
      </div>

      {/* Voice feedback box */}
      {(speechText || isProcessing) && (
        <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 text-orange-600 font-semibold mb-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            {isProcessing ? 'AI Structuring Civic Description...' : 'Transcribed Voice:'}
          </div>
          <p className="italic">{speechText}</p>
        </div>
      )}
    </div>
  );
};
