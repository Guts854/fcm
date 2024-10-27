importScripts(
	"https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js",
);
importScripts(
	"https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js",
);

// config 必須寫死，因為不能用 import 讀檔
const firebaseConfig = {
	apiKey: "",
	authDomain: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: "",
	measurementId: "",
};
firebase.initializeApp(firebaseConfig);

// 通知服務建立(這行必須存在，否則通知出不來)
const messaging = firebase.messaging();

// 點擊通知，打開網頁(這行必須存在，否則通知點了不跳轉)
self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	clients.openWindow(event.notification.data.link);
});

// 背景接收消息(這個 APP 不是 PWA，無法離線，所以無用)
// messaging.onBackgroundMessage((payload) => {
// 	const notificationTitle = payload.notification?.title;
// 	const notificationOptions = {
// 		body: payload.notification?.body,
// 		// icon: "/*.png",
// 	};
// 	navigator.serviceWorker.ready.then((registration) => {
// 		registration.showNotification(notificationTitle, notificationOptions);
// 	});
// });
