import WebSocket, { WebSocketServer } from 'ws';
import http from "http";
import WSUser from './WSUser';

export const PROTOCOL = 'gates-of-atlantis'
type ConnectionListener = (user: WSUser) => void;

export default class WSServer {
    protected wsServer?: WebSocketServer;
    protected connectionListeners: ConnectionListener[] = [];
    protected users: (WSUser | undefined)[] = [];

    addConnectionListener(listener: ConnectionListener) {
        this.connectionListeners.push(listener);
    }

    constructor(
        protected httpServer: http.Server
    ) {}

    establish() {
        if (this.wsServer) {
            throw new Error('Server already established');
        }
        this.wsServer = new WebSocketServer({
            server: this.httpServer,
        });
        this.wsServer.on('connection', (ws) => this.socketConnection(ws));
    }

    socketConnection(webSocket: WebSocket) {
        if (webSocket.protocol !== PROTOCOL) {
            webSocket.close();
        }
        const userId = this.users.length;
        const networkUser = new WSUser(webSocket, userId);
        networkUser.addClosingListener(() =>
            this.users[userId] = undefined
        );
        this.users.push(networkUser);
        this.connectionListeners.forEach(listener => listener(networkUser));
    }
}