import { motion } from "framer-motion"
import { PulseLoader } from "react-spinners";

function ChatMessage({ msg, isTo, isTimestamped = false, pendingMessage = false, typingIndicator = false }) {
	let side;

	if (pendingMessage) {
		side = "right";
	} else if (typingIndicator) {
		side = "left";
	} else {
		side = isTo ? "right" : "left";
	}

	const getTime = (string) => {
		return new Date(string).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	const handleTimestampText = () => {
		if (msg.senttimestamp)
			return getTime(msg.senttimestamp);
		else if (pendingMessage)
			return handlePendingText()
		else
			return "Unknown";
	}

	const handlePendingText = () => {
		if (!pendingMessage) {
			return
		}

		if (msg.pending) {
			return "Sending...";
		} else if (msg.fulfilled) {
			return "Sent"
		} else if (msg.failed) {
			return "Failed";
		} else {
			return "Unknown";
		}
	}

	const handleMessageContent = () => {
		if (!msg) {
			return
		}

		return pendingMessage ? msg.content : msg.messagecontent;
	}

	return (
		<div className={`message-container ${side}`} >
			<motion.div className={`message ${side}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				{!typingIndicator ? (
					<span>{handleMessageContent()}</span>
				) : (
					<PulseLoader speedMultiplier={0.6} size={10} cssOverride={{ width: "100%", height: "100%", }} loading={typingIndicator} color={"#b79b46"} aria-label={"Typing Loader"} />
				)}
			</motion.div>

			{(isTimestamped || pendingMessage) &&
				<motion.div className={`timestamp${pendingMessage && msg.failed ? ' failed' : ''}`} initial={{ opacity: 0, x: side === "left" ? -10 : 10 }} animate={{ opacity: 1, x: 0 }}>
					<span>{pendingMessage ? handlePendingText() : handleTimestampText()}</span>
				</motion.div>
			}
		</div>
	);
}

export default ChatMessage;
