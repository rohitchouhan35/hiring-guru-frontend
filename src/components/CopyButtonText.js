import React, { useState } from "react";

const CopyButtonText = ({ sharableLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(sharableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="meeting-id-display">
      <span>{sharableLink}</span>
      <button onClick={handleCopyClick}>{copied ? "Copied!" : "Copy"}</button>
    </div>
  );
};

export default CopyButtonText;
