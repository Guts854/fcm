import AppStyle from "@/App.css";
import { createSignal } from "solid-js";
import { initializeApp, type FirebaseApp } from "firebase/app";
import {
	getMessaging,
	getToken,
	onMessage,
	type Messaging,
} from "firebase/messaging";
import firebaseConfig from "config/firebaseConfig.json";
import { vapidKey } from "config/vapidKey.json";

import ky from "ky";

export default function App() {
	const [app, setApp] = createSignal<FirebaseApp>();
	const [messaging, setMessaging] = createSignal<Messaging>();
	const [token, setToken] = createSignal("");

	// 請求通知權限
	function requestPermission() {
		console.log("Requesting permission...");
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") {
				console.log("Notification permission granted.");
			}
		});
	}
	// 初始化 Firebase Cloude Messaging 服務
	function initMessaging() {
		setApp(initializeApp(firebaseConfig));
		setMessaging(getMessaging(app()));
	}
	// 前景接收消息(這行必須存在，否則通知出不來)
	function onForegroundMessage() {
		onMessage(messaging() as Messaging, (payload) => {
			const notificationTitle = payload.notification?.title as string;
			const notificationOptions = {
				body: payload.notification?.body,
				// icon: "/*.png",
				data: {
					link: payload.data?.link as string,
				},
			};
			navigator.serviceWorker.ready.then((registration) => {
				registration.showNotification(notificationTitle, notificationOptions);
			});
		});
	}
	// 初始化 Firebase 服務
	function init() {
		requestPermission();
		initMessaging();
		onForegroundMessage();
	}

	// 取得每個人獨有的 fcm token
	async function getRegistrationToken() {
		setToken(
			await getToken(messaging() as Messaging, {
				vapidKey,
			}),
		);
		console.log("你的 token 是：", token());
	}

	// 發送請求到後端，要求寄送通知給自己
	async function sendMessage() {
		const json = await ky
			.post("https://localhost:5173/api/send", { json: { token: token() } })
			.json();
		console.log(json);
	}

	return (
		<div class={AppStyle}>
			<h1>Hello I am FCM Frontend!</h1>
			<button type="button" onClick={init}>
				1. click me to request notification permission and initialize FCM
			</button>
			<button type="button" onClick={getRegistrationToken}>
				2. click me to get FCM registration token
			</button>
			<button type="button" onClick={sendMessage}>
				3. click me to send a message, create a new notification
			</button>
		</div>
	);
}
