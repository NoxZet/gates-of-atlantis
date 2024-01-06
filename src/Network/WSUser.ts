import WebSocket, { WebSocketServer } from 'ws';

type MessageListener = (message: string) => void
type ErrorListener = () => void;
type ClosingListener = () => void;

type MessageEvent = {
    data: string | {toString: () => string}
}
declare class AnyWebSocket {
    addEventListener(
        method: 'message',
        cb: (event: MessageEvent) => void,
    ): void;
    addEventListener(
        method: 'error',
        cb: (event: {}) => void,
    ): void;
    addEventListener(
        method: 'close',
        cb: (event: {}) => void,
    ): void;
    close(code?: number): void;
    send(message: string): void;
};

export default class WSUser {
    protected expectDisconnect: boolean = false;
    protected messageListeners: MessageListener[] = [];
    protected errorListeners: ErrorListener[] = [];
    protected closingListeners: {listener: ClosingListener, triggeredByManualClosure: boolean}[] = [];

    addMessageListener(listener: MessageListener) {
        this.messageListeners.push(listener);
    }

    addErrorListener(listener: ErrorListener) {
        this.errorListeners.push(listener);
    }

    addClosingListener(listener: ClosingListener, triggeredByManualClosure: boolean = true) {
        this.closingListeners.push({listener, triggeredByManualClosure});
    }

    constructor(
        protected ws: AnyWebSocket,
        public readonly userId: number,
    ) {
        this.ws.addEventListener('message', event => {
            const data = event.data;
            if (typeof data !== 'string') {
                this.errorListeners.forEach(errorListener =>
                    errorListener()
                )
            } else {
                this.messageListeners.forEach(messageListener =>
                    messageListener(data)
                )
            }
        });
        this.ws.addEventListener('error', event =>
            this.errorListeners.forEach(errorListener => errorListener())
        );
        this.ws.addEventListener('close', event =>
            this.closingListeners.forEach(closingListener => {
                if (closingListener.triggeredByManualClosure || this.expectDisconnect) {
                    closingListener.listener();
                }
            })
        );
    }

    close(code?: number) {
        this.expectDisconnect = true;
        this.ws.close(code);
    }

    send(message: string): void {
        this.ws.send(message);
    }
}