import React, { useEffect, useState } from "react";
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

function ChatPage() {
	const [matches, setMatches] = useState([]);
	const [messages, setMessages] = useState({});
	const [userId, setUserId] = useState(null);
	const [pendingMessages, setPendingMessages] = useState([]);
	const { matchid } = useParams();
	const [activeChat, setActiveChat] = useState(matchid);
	const [offsetCount, setOffsetCount] = useState(1);
	const [noMoreMessages, setNoMoreMessages] = useState(false);
	const [showLoading, setShowLoading] = useState(true);
	const [scrollToBottom, setScrollToBottom] = useState(true);

	const asyncMessages = async (offset, shouldShowLoading) => {
		if (shouldShowLoading)
			setShowLoading(true);

		const rawMessages = await getMessages(activeChat, offset);

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

	const handleAtTop = async (count) => {
		if (noMoreMessages)
			return;

		if (await asyncMessages(count * 20, true)) {
			setOffsetCount(offsetCount + 1);
			setNoMoreMessages(false);
		} else {
			setNoMoreMessages(true);
		}
	}

	useEffect(() => {
		const getMatches = async () => {
			setMatches(await getAndProcessMatches());
		}

		getMatches();

		console.log("getMatches");
	}, []);

	useEffect(() => {
		if (matchid) {
			asyncMessages(0, true);
		}

		const asyncUserId = async () => {
			setUserId(await getUserId());
		}

		asyncUserId();

		console.log("getMessages and userId");
	}, [activeChat]);


	const handleSendMessage = (newMessage) => {
		if (newMessage.trim() === "") return;

		sendMessage(activeChat, newMessage).then(() => {
			asyncMessages(0, false).then(() => {
				setPendingMessages([
					...pendingMessages,
					{
						content: newMessage,
						pending: false,
						failed: false
					}
				])
			});
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
	};

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
						matches={matches}
						activeChat={activeChat}
						onSelectUser={setActiveChat}
					/>
				}
			</div>

			<div className="chat-main">
				{messages && userId && activeChat &&
					<>
						<ChatWindow userId={userId}
							messages={Object.keys(messages).length == 0 ? [] : Object.values(messages[activeChat])}
							pendingMessages={pendingMessages}
							handleAtTop={handleAtTop}
							offsetCount={offsetCount}
							scrollToBottom={scrollToBottom}
							setScrollToBottom={setScrollToBottom}
							noMoreMessages={noMoreMessages}
						/>
						<ChatInput onSend={handleSendMessage} />
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
