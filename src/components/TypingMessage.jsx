function TypingMessage() {
	return (
		<motion.div className={"message-container left"}>
			<div className={"message left"}>
				<PulseLoader speedMultiplier={0.6} size={10} cssOverride={{ width: "100%", height: "100%", }} loading={otherUserIsTyping} color={"#b79b46"} aria-label={"Typing Loader"} />
			</div>
		</motion.div>
	);
}

export default TypingMessage
