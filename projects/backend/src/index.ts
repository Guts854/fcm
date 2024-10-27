import { Hono } from "hono";
const app = new Hono();
app.get("/", (c) => {
	return c.text("Hello I am FCM Backend!");
});

import { initializeApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "config/serviceAccount.json";
const firebaseApp = initializeApp({
	credential: credential.cert({
		projectId: serviceAccount.project_id,
		clientEmail: serviceAccount.client_email,
		privateKey: serviceAccount.private_key,
	}),
});
const messagingApp = getMessaging(firebaseApp);
function sendMessage(token: string) {
	messagingApp
		.send({
			token,
			notification: {
				title: "測試標題",
				body: "測試內容",
			},
			data: {
				link: "https://google.com.tw",
			},
		})
		.then((response) => {
			// Response is a message ID string.
			console.log("Successfully sent message:", response);
		})
		.catch((error) => {
			console.log("Error sending message:", error);
		});
}
app.post("/send", async (c) => {
	const body = await c.req.json();
	sendMessage(body.token as string);
	return c.json("notification sent!");
});
export default {
	port: 3000,
	fetch: app.fetch,
};

// 新的寫法，我們不需要
// import got from "got";
// import { Auth } from "googleapis";
// async function getAccessToken() {
// 	const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
// 	const SCOPES = [MESSAGING_SCOPE];

// 	const jwtClient = new Auth.JWT(
// 		serviceAccount.client_email,
// 		undefined,
// 		serviceAccount.private_key,
// 		SCOPES,
// 		undefined,
// 	);

// 	const oAuthToken = await jwtClient.authorize();
// 	const { access_token } = oAuthToken;

// 	return access_token;
// }
// async function sendMessageByHTTP(token: string) {
// 	const access_token = await getAccessToken();
// 	got
// 		.post(
// 			`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
// 			{
// 				json: {
// 					message: {
// 						token,
// 						notification: {
// 							title: "測試標題",
// 							body: "測試內容",
// 						},
// 						data: {
// 							link: "https://google.com.tw",
// 						},
// 					},
// 				},
// 				headers: {
// 					Authorization: `Bearer ${access_token}`,
// 				},
// 			},
// 		)
// 		.then((response) => {
// 			// Response is a message ID string.
// 			console.log("Successfully sent message:", response.body);
// 		})
// 		.catch((error) => {
// 			console.log("Error sending message:", error);
// 		});
// }
