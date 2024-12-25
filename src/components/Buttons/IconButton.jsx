"use client";

import React from "react";

const IconButton = ({ Icon, onClick }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) {
      setDisliked(false); 
    }
  };
  
  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) {
      setLiked(false); 
    }
  };

  return (
    <div
      className="cursor-pointer flex items-center space-x-2"
      onClick={onClick}
    >
      <Icon size={22} />
    </div>
  );
};

export default IconButton;
