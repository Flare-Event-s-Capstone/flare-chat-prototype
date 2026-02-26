import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/ChatWindow.css";

function ChatWindow({ userId, messages, pendingMessages, handleMoreMessages, offsetCount, noMoreMessages, scrollToBottom, setScrollToBottom }) {
	const today = new Date()

	// TODO: Move scrollbar to previous first message after atTop and offset message query
	const scrollToRef = useRef(null);

	const chatRef = useRef(null);
	const prevScrollHeightRef = useRef(0);

	const [atMoreMessages, setAtMoreMessages] = useState(false);

	const handleScroll = () => {
		if (chatRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = chatRef.current;

			const halfWay = (scrollHeight - clientHeight) / 2;

			if (scrollTop <= halfWay) {
				setAtMoreMessages(true);
			} else {
				setAtMoreMessages(false);
			}
		}
	};

	useLayoutEffect(() => {
		if (chatRef.current && prevScrollHeightRef.current) {
			const newScrollHeight = chatRef.current.scrollHeight;
			const delta = newScrollHeight - prevScrollHeightRef.current;
			chatRef.current.scrollTop += delta;
		}

		prevScrollHeightRef.current = chatRef.current.scrollHeight;
	});

	useEffect(() => {
		if (atMoreMessages) {
			handleMoreMessages(offsetCount);
			setAtMoreMessages(false);
		}

	}, [atMoreMessages])

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


	useLayoutEffect(() => {
		if (scrollToBottom) {
			scrollToRef.current?.scrollIntoView();
			setScrollToBottom(false);
		}
	}, []);

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

	const shouldPlaceDay = (messages, index, noMoreMessages) => {
		if (index == 0)
			return noMoreMessages || messages.length < 20;

		const prevMessageDate = new Date(messages[index - 1].senttimestamp);
		const currentMessageDate = new Date(messages[index].senttimestamp);

		const diff = 1.5 * 60 * 60 * 1000;

		if (prevMessageDate.getDay() != currentMessageDate.getDay())
			return true
		else if (prevMessageDate.getTime() + diff <= currentMessageDate.getTime())
			return true
		else
			return false
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
					{shouldPlaceDay(messages, index, noMoreMessages) &&
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
