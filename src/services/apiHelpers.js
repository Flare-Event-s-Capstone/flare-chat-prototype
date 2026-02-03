import { getMe, getMatches, getUser } from "./api.js"

export async function getAndProcessMatches() {
	const userid = await getUserId();

	const receivedMatches = await getMatches();

	const matchDataArrayPromises = receivedMatches.map(async (match) => {
		const otherUserId = match.userid1 === userid ? match.userid2 : match.userid1;

		const getUserRes = await getUser(otherUserId);

		return {
			otherUser: getUserRes,
			matchId: match.matchid
		};
	});

	return await Promise.all(matchDataArrayPromises);
}

export async function getUserId() {
	const stored = sessionStorage.getItem("userid");

	return stored ? stored : await (getMe()).userid
}
