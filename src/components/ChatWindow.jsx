import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatWindow.css";

function ChatWindow({ userId, messages, pendingMessages, handleAtTop, offsetCount, scrollToBottom, setScrollToBottom }) {
	const today = new Date()

	// TODO: Move scrollbar to previous first message after atTop and offset message query
	const scrollToRef = useRef(null);

	const chatRef = useRef(null);

	const [atTop, setAtTop] = useState(false);

	const handleScroll = () => {
		if (chatRef.current) {
			if (chatRef.current.scrollTop === 0) {
				setAtTop(true);
			}
		}
	};

	useEffect(() => {
		if (atTop) {
			handleAtTop(offsetCount);
			setAtTop(false);
		}
	}, [atTop])

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.addEventListener('scroll', handleScroll);
		}

		return () => {
			if (chatRef.current) {
				chatRef.current.removeEventListener('scroll', handleScroll);
			}
		};
	}, []);


	useEffect(() => {
		if (scrollToBottom) {
			scrollToRef.current?.scrollIntoView();
			setScrollToBottom(false);
		}
	}, [scrollToBottom]);

	const getTime = (string) => {
		return new Date(string).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	const handleDayText = (senttimestamp) => {
		const sentTime = new Date(senttimestamp);

		if (today.getDay() == sentTime.getDay()) {
			return `Today ${getTime(senttimestamp)}`;
		} else if (today.getDay() - 1 == sentTime.getDay()) {
			return `Yesterday ${getTime(senttimestamp)}`;
		} else if (today.getDay() - 7 < sentTime.getDay()) {
			return sentTime.toLocaleString('en-US', {
				weekday: "long"
			});
		} else {
			return sentTime.toDateString();
		}
	}

	const handleTimestampText = (senttimestamp) => {
		if (senttimestamp)
			return getTime(senttimestamp);
		else
			return "Sending..."
	}

	const handlePendingText = (pendingMessage) => {
		if (pendingMessage.pending) {
			return "Sending...";
		} else if (pendingMessage.failed) {
			return "Failed";
		} else {
			return "Unknown";
		}
	}

	const shouldPlaceDay = (messages, index) => {
		if (index == 0)
			return true;

		if (index == messages.length - 1)
			return false;

		const prevMessageDate = new Date(messages[index - 1].senttimestamp);
		const currentMessageDate = new Date(messages[index].senttimestamp);

		// console.log(`message: ${messages[index].messagecontent} ${currentMessageDate.getDay()}\nnext message: ${messages[index + 1].messagecontent} ${nextMessageDate.getDay()}\n`)

		return prevMessageDate.getDay() != currentMessageDate.getDay();
	}

	const shouldPlaceTimestamp = (pendingMessages, messages, index) => {
		if (pendingMessages.find(o => o.pending) && index == messages.length - 1)
			return false;

		if (messages.length == 1 || index == messages.length - 1 || messages[index].senttimestamp == null)
			return true;

		const nextMessageDate = new Date(messages[index + 1].senttimestamp);
		const currentMessageDate = new Date(messages[index].senttimestamp);

		const diff = 5 * 60 * 1000;

		return nextMessageDate.getTime() - diff >= currentMessageDate.getTime();
	}

	const shouldPlacePendingMessage = (pendingMessage) => {
		return pendingMessage.pending || pendingMessage.failed
	}

	return (
		<div ref={chatRef} className="chat-window">
			{messages && userId && messages.map((msg, index) => (
				<React.Fragment key={index}>
					{shouldPlaceDay(messages, index) &&
						<span className="day">{handleDayText(msg.senttimestamp)}</span>
					}
					<div className={`message-container ${msg.fromuserid !== userId ? "left" : "right"}`} >
						<div className={`message ${msg.fromuserid !== userId ? "left" : "right"}`}>
							<div>
								{msg.messagecontent}
							</div>
						</div>

						{shouldPlaceTimestamp(pendingMessages, messages, index) &&
							<>
								<span>{handleTimestampText(msg.senttimestamp)}</span>
							</>
						}
					</div>
				</React.Fragment>
			))}

			{pendingMessages && pendingMessages.map((pendingMsg, index) => (
				<React.Fragment key={index}>
					{shouldPlacePendingMessage(pendingMsg) &&
						<div className={"message-container right"}>
							<div className={"message right"}>
								<div>
									{pendingMsg.content}
								</div>
							</div>
							<span className={pendingMsg.failed ? "failed" : ""}>{handlePendingText(pendingMsg)}</span>
						</div>}
				</React.Fragment>
			))}
			<div ref={scrollToRef} id="scroll-target"></div>
		</div>
	);
}

export default ChatWindow;
