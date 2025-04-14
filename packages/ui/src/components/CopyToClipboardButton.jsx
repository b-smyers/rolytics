import { useState } from 'react';
import './CopyToClipboardButton.css';

const CopyToClipboardButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 750); // reset ms
    });
  };

  return (
    <button
      id="copy-button"
      className={isCopied ? 'copied' : ''}
      onClick={handleCopy}
    >
      <img src="/icons/copy.svg" alt="Copy to clipboard" />
      {isCopied && <span id="copy-label">Copied!</span>}
    </button>
  );
};

export default CopyToClipboardButton;