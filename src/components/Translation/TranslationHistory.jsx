"use client";

import React, { useState, useEffect } from 'react';

const TranslationHistory = () => {
  const [history, setHistory] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Recent Translations</h3>
      <div className="space-y-2">
        {history.map((item, index) => (
          <div key={index} className="p-2 rounded-lg bg-gray-800">
            <p className="text-sm text-gray-400">{item.source}</p>
            <p className="text-sm text-white">{item.target}</p>
            <p className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationHistory; 