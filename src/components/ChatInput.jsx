import { useState, useRef } from "react";
import "../styles/ChatInput.css";

function ChatInput({ onSend, onTyping }) {
  const [inputValue, setInputValue] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const timerRef = useRef(null);
	const intervalRef = useRef(null);

  const handleSend = () => {
    onSend(inputValue);
    setInputValue("");

		// When sending the message, reset the typing timer and interval.
		if (timerRef.current) clearTimeout(timerRef.current);
		if (intervalRef.current) clearInterval(intervalRef.current);
		setIsTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();

		// Disregard non-text key presses
		if (e.key === "Control" || e.key === "Shift" || e.key === "Capslock" || e.key === "Meta" || e.key === "Alt") return;

		if (!isTyping) {
			onTyping();
			intervalRef.current = setInterval(onTyping, 5000);
			setIsTyping(true);
		}

		if (timerRef.current) clearTimeout(timerRef.current);

		timerRef.current = setTimeout(() => {
			setIsTyping(false);
			if (intervalRef.current) clearInterval(intervalRef.current);
		}, 5000);
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder="Type a message ..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatInput;
