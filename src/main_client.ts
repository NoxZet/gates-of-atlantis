import WSClient from "Network/WSClient";

const wsClient = new WSClient();
wsClient.addConnectionListener(user => {
    console.log('connection!');
    user.addMessageListener(message => {
        console.log(message);
        user.send(`Pong: ${message}`);
    });
});
wsClient.connect();
