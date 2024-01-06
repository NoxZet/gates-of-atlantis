import WSUser from './WSUser';
import { PROTOCOL } from './WSServer';

type ConnectionListener = (user: WSUser) => void;

export default class WSClient {
    protected ws: WebSocket;
    protected connectionListeners: ConnectionListener[] = [];
    protected user: WSUser | undefined;

    addConnectionListener(listener: ConnectionListener) {
        this.connectionListeners.push(listener);
    }

    connect() {
        const address = 'ws://' + location.host + '/';
        this.ws = new WebSocket(address, PROTOCOL);
        console.log(this.ws);
        this.ws.addEventListener('open', (event) => this.socketConnection());
    }

    protected socketConnection() {
        this.user = new WSUser(this.ws, 0);
        this.user.addClosingListener(() =>
            this.user = undefined
        );
        this.connectionListeners.forEach(listener => listener(this.user!));
    }
}