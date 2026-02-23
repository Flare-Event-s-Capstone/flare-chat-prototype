function ChatMessage({ msg, isTo, isTimestamped = false, pendingMessage = false }) {
	const side = pendingMessage ? "right" : isTo ? "right" : "left";

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
		return pendingMessage ? msg.content : msg.messagecontent;
	}

	return (
		<div className={`message-container ${side}`} >
			<div className={`message ${side}`}>
				<div>
					{handleMessageContent()}
				</div>
			</div>

			{(isTimestamped || pendingMessage) &&
				<>
					<span className="timestamp">{handleTimestampText()}</span>
				</>
			}
		</div>
	);
}

export default ChatMessage;
