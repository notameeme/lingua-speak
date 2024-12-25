import { useEffect, useState } from "react";
import OpenAI from 'openai';

console.log("API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY ? "Present" : "Missing");
console.log("API Key exists:", !!process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "", 
  dangerouslyAllowBrowser: true,
});

const useTranslate = (sourceText, selectedLanguage) => {
  const [targetText, setTargetText] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState({});

  useEffect(() => {
    const handleTranslate = async (text) => {
      const cacheKey = `${text}-${selectedLanguage}`;
      
      if (translationCache[cacheKey]) {
        setTargetText(translationCache[cacheKey]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Translate this text: "${text}" into ${selectedLanguage}`,
            },
          ],
        });

        const translation = response.choices[0].message.content;
        
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: translation
        }));
        
        setTargetText(translation);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (sourceText.trim()) {
        handleTranslate(sourceText);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [sourceText, selectedLanguage]);

  const detectLanguage = async (text) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `What language is this text written in? Only return the language name: "${text}"`,
          },
        ],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Language detection error:", error);
      return null;
    }
  };

  const getPronunciation = async (text, language) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Provide a simple pronunciation guide for this ${language} text: "${text}"`,
          },
        ],
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Pronunciation guide error:", error);
      return null;
    }
  };

  return { targetText, error, isLoading, detectLanguage, getPronunciation };
};

export default useTranslate;
