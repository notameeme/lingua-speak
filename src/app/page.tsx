"use client"
import React, { useState, ChangeEvent, useEffect } from "react";
import {
  IconCopy,
  IconStar,
  IconThumbDown,
  IconThumbUp,
  IconVolume,
  IconTrash,
} from "@tabler/icons-react";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";
import TextArea from "@/components/Inputs/TextArea";
import FileUpload from "@/components/Inputs/FileUpload";
import LanguageSelector from "@/components/Inputs/LanguageSelector";
import useTranslate from "@/hooks/useTranslate";
import { rtfToText } from "@/utils/rtfToText";
import SvgDecorations from "@/components/SvgDecorations";
import CategoryLinks from "@/components/categoryLinks";

const Home: React.FC = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [wordInfo, setWordInfo] = useState<any>(null);
  const [isLoadingWordInfo, setIsLoadingWordInfo] = useState(false);
  const [wordInfoError, setWordInfoError] = useState<string | null>(null);
  const [languages] = useState<string[]>(["Kannada ", "Spanish", "French", "German", "Chinese"]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Spanish");
  const [translationHistory, setTranslationHistory] = useState<Array<{
    source: string;
    target: string;
    timestamp: number;
  }>>([]);

  const { targetText: translatedText } = useTranslate(sourceText, selectedLanguage);

  useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      setTranslationHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (sourceText.trim() && translatedText.trim()) {
      const newTranslation = {
        source: sourceText,
        target: translatedText,
        timestamp: Date.now()
      };

      setTranslationHistory(prevHistory => {
        const updatedHistory = [newTranslation, ...prevHistory].slice(0, 1);
        localStorage.setItem('translationHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    }
  }, [sourceText, translatedText]); 
  

  const clearHistory = () => {
    setTranslationHistory([]);
    localStorage.removeItem('translationHistory');
  };

  const removeHistoryItem = (index: number) => {
    const newHistory = translationHistory.filter((_, i) => i !== index);
    setTranslationHistory(newHistory);
    localStorage.setItem('translationHistory', JSON.stringify(newHistory));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const rtfContent = reader.result as string;
        const text = rtfToText(rtfContent);
        setSourceText(text);
      };
      reader.readAsText(file);
    }
  };

  const fetchWordInfo = async (word: string, source: 'source' | 'target') => {
    setWordInfoError(null);
    setIsLoadingWordInfo(true);

    try {
      const langCode = source === 'target' ? selectedLanguage.toLowerCase().slice(0, 2) : 'en';

      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/${langCode}/${word}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch word information");
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error("Error fetching word information:", error);
      setWordInfoError("Unable to fetch word information");
      return null;
    } finally {
      setIsLoadingWordInfo(false);
    }
  };

  const handleTextSelection = async (
    event: React.MouseEvent<HTMLTextAreaElement>,
    source: 'source' | 'target'
  ) => {
    const selectedText = window.getSelection()?.toString().trim();

    if (selectedText && selectedText.split(' ').length === 1) {
      console.log(`Selected text: ${selectedText} from ${source}`);
      const info = await fetchWordInfo(selectedText, source);
      console.log('Word info received:', info);
      setWordInfo(info);
    } else {
      setWordInfo(null);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  const handleFavorite = () => {
    setFavorite(!favorite);
    if (!favorite) {
      localStorage.setItem("favoriteTranslation", translatedText);
    } else {
      localStorage.removeItem("favoriteTranslation");
    }
  };

  const handleAudioPlayback = (text: string) => {
    if (!text) {
      console.log("No text provided for audio playback.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full bg-black bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="relative h-screen">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-neutral-200">
              Trans<span className="text-[#4A90E2]">Verse</span>
            </h1>
            <p className="mt-3 text-neutral-400">
              Breaking Language Barriers, One Word at a Time
            </p>

            <div className="mt-7 sm:mt-12 mx-auto max-w-3xl relative">
              <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
                <div className="relative z-10 flex flex-col space-x-3 p-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                  <TextArea
                    id="source-language"
                    value={sourceText}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setSourceText(e.target.value)
                    }
                    onMouseUp={(e) => handleTextSelection(e, 'source')}
                    placeholder="Source Language"
                  />
                  <div className="flex flex-row justify-between w-full">
                    <div className="cursor-pointer flex space-x-2 flex-row">
                      <SpeechRecognitionComponent setSourceText={setSourceText} />
                      <IconVolume size={22} onClick={() => handleAudioPlayback(sourceText)} />
                      
                    </div>
                    <span className="text-sm pr-4">{sourceText.length} / 2000</span>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col space-x-3 p-3 border rounded-lg shadow-lg bg-neutral-900 border-neutral-700 shadow-gray-900/20">
                  <TextArea
                    id="target-language"
                    value={translatedText}
                    onChange={() => { }}
                    onMouseUp={(e) => handleTextSelection(e, 'target')}
                    placeholder="Target Language"
                  />
                  <div className="flex flex-row justify-between w-full">
                    <span className="cursor-pointer flex items-center space-x-2 flex-row">
                      <LanguageSelector
                        selectedLanguage={selectedLanguage}
                        setSelectedLanguage={setSelectedLanguage}
                        languages={languages}
                      />
                      <IconVolume size={22} onClick={() => handleAudioPlayback(translatedText)} />
                    </span>
                    <div className="flex flex-row items-center space-x-2 pr-4 cursor-pointer">
                      <IconCopy size={22} onClick={handleCopyToClipboard} />
                      {copied && <span className="text-xs text-green-500">Copied!</span>}
                      <IconThumbUp
                        size={22}
                        onClick={handleLike}
                        className={liked ? "text-blue-500" : ""}
                      />
                      <IconThumbDown
                        size={22}
                        onClick={handleDislike}
                        className={disliked ? "text-red-500" : ""}
                      />
                      <IconStar
                        size={22}
                        onClick={handleFavorite}
                        className={favorite ? "text-yellow-500" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isLoadingWordInfo && (
                <div className="mt-4 p-4 border rounded-lg bg-neutral-900 border-neutral-700">
                  <p className="text-neutral-300">Loading word information...</p>
                </div>
              )}

              {wordInfoError && (
                <div className="mt-4 p-4 border rounded-lg bg-neutral-900 border-neutral-700">
                  <p className="text-red-500">{wordInfoError}</p>
                </div>
              )}

              {!isLoadingWordInfo && !wordInfoError && wordInfo && (
                <div className="mt-4 p-4 border rounded-lg bg-neutral-900 border-neutral-700">
                  <h4 className="font-semibold text-neutral-200">Word Information</h4>
                  {wordInfo.meanings?.[0]?.definitions?.[0] && (
                    <>
                      <p className="text-neutral-300 mt-2">
                        <strong>Definition:</strong>{" "}
                        {wordInfo.meanings[0].definitions[0].definition}
                      </p>
                      {wordInfo.meanings[0].definitions[0].example && (
                        <p className="text-neutral-300 mt-1">
                          <strong>Example:</strong>{" "}
                          {wordInfo.meanings[0].definitions[0].example}
                        </p>
                      )}
                      {wordInfo.meanings[0].synonyms?.length > 0 && (
                        <p className="text-neutral-300 mt-1">
                          <strong>Synonyms:</strong>{" "}
                          {wordInfo.meanings[0].synonyms.join(", ")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-neutral-200">Recent Translations</h3>
                  {translationHistory.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {translationHistory.length === 0 ? (
                    <p className="text-sm text-neutral-400">No translations yet</p>
                  ) : (
                    translationHistory.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 group hover:bg-neutral-800 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-neutral-400 mb-1">{item.source}</p>
                            <p className="text-sm text-neutral-200 mb-2">{item.target}</p>
                            <p className="text-xs text-neutral-500">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeHistoryItem(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500 text-neutral-400"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <SvgDecorations />
            </div>

            <CategoryLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;