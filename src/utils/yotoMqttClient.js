import mqtt from 'mqtt/dist/mqtt';
import EventEmitter from 'events';
import { getAccessToken } from './yotoAuthService';

const MQTT_URL = 'wss://aqrphjqbp3u2z-ats.iot.eu-west-2.amazonaws.com';
const MQTT_AUTH_NAME = 'JwtAuthorizer_mGDDmvLsocFY';

export class YotoPlayerMQTTClient extends EventEmitter {
    constructor(params) {
        super();
        if (!params.data) {
            throw new Error('No Yoto Player has been set up for this');
        }
        const { data } = params;
        this._deviceId = data.deviceId;
        this._client = null;
    }

    _subscribe(topic) {
        if (!this.isConnected()) {
            this.start();
        }

        return this._client
            .subscribe(topic, {}, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.info(`Subscribed to ${topic}`);
                }
            });
    }

    _connect() {
        const { _deviceId } = this;
        console.log(`MQTT connected to ${_deviceId}`);
        super.emit('connected', true);
        const rootTopic = `device/${_deviceId}`;
        const commandResponseTopic = `${rootTopic}/response`;
        const eventTopic = `${rootTopic}/events`;
        const statusTopic = `${rootTopic}/status`;
        this._subscribe(commandResponseTopic);
        this._subscribe(eventTopic);
        this._subscribe(statusTopic);
        this.sendCommand('events', {});
    }

    _message(topic, message) {
        const messageJson = JSON.parse(message.toString());
        if (topic.endsWith('response')) {
            const messageBody = messageJson.status.req_body;
            const payload = messageBody.length > 0 ? JSON.parse(messageBody) : {};
            const command = Object.keys(messageJson.status)[0];
            super.emit('msgResponse', { command, payload });
        }
        if (topic.endsWith('events')) {
            const events = messageJson;
            super.emit('msgEvents', events);
        }
        if (topic === `device/${this._deviceId}/status`) {
            const { status } = messageJson;
            super.emit('msgStatus', status);
        }
    }

    isConnected() {
        return this._client && this._client.connected;
    }

    sendCommand(command, payload) {
        const commandTopic = `device/${this._deviceId}/command/${command}`;
        if (!this.isConnected()) {
            this.start();
        }
        return this._client
            .publish(commandTopic, JSON.stringify(payload), (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.info(`Command ${command} with ${JSON.stringify(payload)} sent to ${commandTopic}`);
                }
            });
    }

    start() {
        if (!this.isConnected()) {
            const clientId = `DASH${this._deviceId}`;
            const client = mqtt.connect(MQTT_URL, {
                keepalive: 300,
                port: 443,
                protocol: 'wss',
                username: `${this._deviceId}?x-amz-customauthorizer-name=${MQTT_AUTH_NAME}`,
                password: getAccessToken(),
                reconnectPeriod: 0,
                clientId,
                ALPNProtocols: ['x-amzn-mqtt-ca']
            });
            client.on('connect', () => this._connect());
            client.on('message', (topic, message) => this._message(topic, message));
            client.on('error', (err) => console.error(err));
            this._client = client;
        }
    }

    stop() {
        console.log('stop');
        super.emit('connected', false);
        this._client.end();
    }
}