
import React from "react";

interface TextAreaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  onMouseUp: (e: React.MouseEvent<HTMLTextAreaElement>) => void;  
}

const TextArea: React.FC<TextAreaProps> = ({ 
  id, 
  value, 
  onChange, 
  placeholder,
  onMouseUp 
}) => {
  return (
    <textarea
      id={id}
      className="w-full h-32 p-2 bg-transparent text-neutral-200 border-none focus:outline-none resize-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onMouseUp={onMouseUp} 
    />
  );
};

export default TextArea;