import createHTTPServer from "Network/HTTPServer";
import WSServer from "Network/WSServer";

const httpServer = createHTTPServer();
const wsServer = new WSServer(httpServer);
wsServer.addConnectionListener(user => {
    console.log('connection!');
    user.addMessageListener(console.log);
    setTimeout(() => user.send('Hello there'), 3000);
});
wsServer.establish();
