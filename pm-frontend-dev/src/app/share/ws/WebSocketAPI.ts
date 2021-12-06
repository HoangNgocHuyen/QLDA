import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class WebSocketAPI {

    webSocketEndPoint: string = environment.URL_API + 'ws';
    stompClient: any;
    messageReceived: BehaviorSubject<any> = new BehaviorSubject(null);
    messageTotalNews: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor() {
    }

    _connect(username?: string) {
        if (this.stompClient == null) {
            console.log('>>>>>>>>>>>>> Open WebSocket Connection...', username);
            let ws = new SockJS(this.webSocketEndPoint);
            this.stompClient = Stomp.over(ws);
            this.stompClient.debug = null;
            const _this = this;
            _this.stompClient.connect({}, function() {
                _this.stompClient.subscribe('/topic/' + username, function(sdkEvent) {
                    _this.onMessageReceived(sdkEvent);
                });
            }, this.errorCallBack);
        }
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient = null;
        }
        this.messageReceived.complete();
        console.log('>>>>>>>>>>>>> Disconnected Websocket...');
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log('>>>>>>>>>>>>> Reconnect Websocket...', error);
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    onMessageReceived(message) {
        let data = JSON.parse(message?.body);
        this.messageReceived.next(data);
        this.messageTotalNews.next(data?.countSent);
    }
}
