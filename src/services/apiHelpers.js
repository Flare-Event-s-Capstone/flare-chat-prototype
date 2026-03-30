import { getMe, getMatches, getUser } from "./api.js"

export async function getAndProcessMatches() {
	const userid = await getUserId();

	const receivedMatches = await getMatches();

	const matchDataArrayPromises = receivedMatches.filter(m => !m.reported).map(async (match) => {
		const otherUserId = match.userid1 === userid ? match.userid2 : match.userid1;

		const getUserRes = await getUser(otherUserId);

		return {
			otherUser: getUserRes,
			matchId: match.matchid
		};
	});

	const matchDataArray = await Promise.all(matchDataArrayPromises);

	const matchesObject = matchDataArray.reduce((accumulator, match) => {
		accumulator[match.matchId] = match;
		return accumulator;
	}, {});

	return matchesObject;

	// const matchesObject = receivedMatches.reduce(async (accumulator, match) => {
	// 	const otherUserId = match.userid1 === userid ? match.userid2 : match.userid1;

	// 	const getUserRes = await getUser(otherUserId);

	// 	accumulator[match.matchid] = {
	// 		otherUser: getUserRes,
	// 		matchId: match.matchid
	// 	};
	// 	return accumulator;
	// }, {});
}

export async function getUserId() {
	const stored = sessionStorage.getItem("userid");

	return stored ? stored : await (getMe()).userid
}

