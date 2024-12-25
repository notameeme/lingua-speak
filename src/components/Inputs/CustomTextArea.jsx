import React from "react";

const CustomTextArea = ({ value, onChange, placeholder, showWordCount = true }) => {
  const wordCount = value.trim().split(/\s+/).length;
  const charCount = value.length;

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-4 rounded-lg bg-opacity-50 
        backdrop-blur-sm border border-gray-700 focus:border-primary
        text-gray-200 placeholder-gray-500 resize-none"
      />
      {showWordCount && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {wordCount} words | {charCount}/2000
        </div>
      )}
    </div>
  );
};

export default CustomTextArea; 