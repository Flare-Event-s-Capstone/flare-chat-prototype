import React, { useEffect, useState, useCallback, useRef } from "react";
import "../styles/ChatPage.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { getAndProcessMatches } from "../services/apiHelpers";
import { useParams } from "react-router-dom";
import { sendMessage } from "../services/api";
import { getMessages } from "../services/api";
import { getUserId } from "../services/apiHelpers";
import { MoonLoader } from "react-spinners";
import { socket } from "../services/ws"

function ChatPage() {
	const [matches, setMatches] = useState({});
	const [messages, setMessages] = useState({});
	const [userId, setUserId] = useState(null);
	const [pendingMessages, setPendingMessages] = useState([]);
	const { matchid } = useParams();
	const [offsetCount, setOffsetCount] = useState(1);
	const [noMoreMessages, setNoMoreMessages] = useState(false);
	const [showLoading, setShowLoading] = useState(true);
	const [scrollToBottom, setScrollToBottom] = useState(true);
	const [socketIsConnected, setSocketIsConnected] = useState(socket.connected);
	const [otherUserIsTyping, setOtherUserIsTyping] = useState(false);
	const typingTimerRef = useRef(null);

	const asyncMessages = async (offset, shouldShowLoading) => {
		if (shouldShowLoading)
			setShowLoading(true);

		const rawMessages = await getMessages(matchid, offset);

		if (rawMessages.length == 0) {
			if (shouldShowLoading)
				setShowLoading(false);

			return false;
		}

		const messagesObject = rawMessages.reduce((accumulator, message) => {
			accumulator[message.messageid] = message;
			return accumulator;
		}, {});

		const prevMessages = messages && messages[matchid] ? messages[matchid] : {}

		const matchMessagesUnsorted = { ...messagesObject, ...prevMessages };

		const matchMessagesSorted = Object.entries(matchMessagesUnsorted).sort((a, b) => {
			return new Date(a[1].senttimestamp) - new Date(b[1].senttimestamp);
		});

		const newMessages = {
			...messages,
			[matchid]: Object.fromEntries(matchMessagesSorted)
		};

		setMessages(newMessages);

		if (shouldShowLoading)
			setShowLoading(false);

		return true;
	}

	const handleMoreMessages = async (count) => {
		if (noMoreMessages)
			return;

		if (await asyncMessages(count * 20, true)) {
			setOffsetCount(offsetCount + 1);
			setNoMoreMessages(false);
		} else {
			setNoMoreMessages(true);
		}
	}

	const handleTyping = useCallback(() => {
		if (socketIsConnected) {
			socket.emitWithAck("typing", matchid);
		}
	}, [socketIsConnected]);

	useEffect(() => {
		const getMatches = async () => {
			setMatches(await getAndProcessMatches());
		}

		getMatches();
	}, []);

	useEffect(() => {
		if (matchid) {
			asyncMessages(0, true);
		}

		const asyncUserId = async () => {
			setUserId(await getUserId());
		}

		asyncUserId();
	}, []);

	useEffect(() => {
		function onConnect() {
			setSocketIsConnected(true);
		}

		function onDisconnect() {
			setSocketIsConnected(false);
		}

		function onMessageEvent(event) {
		}

		function onMessageSuccessEvent(message) {
			if (message.fromuserid != userId) {
				setOtherUserIsTyping(false);
				if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
			}

			const prevMessages = messages && messages[message.matchid] ? messages[message.matchid] : {}

			const matchMessagesUnsorted = { ...prevMessages, [message.messageid]: message };

			const matchMessagesSorted = Object.entries(matchMessagesUnsorted).sort((a, b) => {
				return new Date(a[1].senttimestamp) - new Date(b[1].senttimestamp);
			});

			const newMessages = {
				...messages,
				[message.matchid]: Object.fromEntries(matchMessagesSorted)
			}

			setScrollToBottom(true);

			setMessages(newMessages);
		}

		function onMessageFailureEvent(event) {
			console.log(event)
		}

		function onTypingEvent(otherUserId) {
			if (otherUserId == matches[matchid].otherUser.userid) {
				setOtherUserIsTyping(true);

				if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

				typingTimerRef.current = setTimeout(() => {
					setOtherUserIsTyping(false);
				}, 10000);
			}
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('message', onMessageEvent);
		socket.on('messageSuccess', onMessageSuccessEvent);
		socket.on('messageFailure', onMessageFailureEvent);
		socket.on('typing', onTypingEvent);

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('message', onMessageEvent);
			socket.off('messageSuccess', onMessageSuccessEvent);
			socket.off('messageFailure', onMessageFailureEvent);
			socket.off('typing', onTypingEvent);
		}
	}, [messages, matches, matchid, userId]);

	const handleSendMessage = useCallback((newMessage) => {
		if (newMessage.trim() === "") return;

		if (!socketIsConnected) return;

		socket.emitWithAck("message", matchid, newMessage).then(() => {
			setPendingMessages([
				...pendingMessages,
				{
					content: newMessage,
					pending: false,
					failed: false
				}
			]);
		});

		setPendingMessages([
			...pendingMessages,
			{
				content: newMessage,
				pending: true,
				failed: false
			}
		]);

		setScrollToBottom(true);
	}, [pendingMessages, socketIsConnected]);

	return (
		<div className="chat-container">
			<div className="sidebar">
				<img
					src={`${import.meta.env.BASE_URL}Secondar Logo_White.png`}
					alt="Secondary Logo"
					className="secondary-logo"
				/>

				{matches &&
					<Sidebar
						matches={Object.values(matches)}
						matchid={matchid}
					/>
				}
			</div>

			<div className="chat-main">
				{messages && userId && matchid &&
					<>
						<ChatWindow userId={userId}
							messages={Object.keys(messages).length == 0 ? [] : Object.values(messages[matchid])}
							pendingMessages={pendingMessages}
							handleMoreMessages={handleMoreMessages}
							offsetCount={offsetCount}
							scrollToBottom={scrollToBottom}
							setScrollToBottom={setScrollToBottom}
							noMoreMessages={noMoreMessages}
							otherUserIsTyping={otherUserIsTyping}
						/>
						<ChatInput onSend={handleSendMessage} onTyping={handleTyping} otherUserIsTyping={otherUserIsTyping} />
					</>
				}

				<div
					style={{ position: "absolute", top: "50%", left: "50%", zIndex: "1", transform: "transform(-50%, -50%)", pointerEvents: "none" }} >
					<MoonLoader
						loading={showLoading}
						color={"#b79b46"}
						aria-label={"Loading Spinner"}
					/>
				</div>

				<img
					src={`${import.meta.env.BASE_URL}Logo_transparent.png`}
					alt="Flare Watermark"
					className="flare-watermark"
				/>

			</div>
		</div>
	);
}

export default ChatPage;
