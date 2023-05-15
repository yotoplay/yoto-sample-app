import { useEffect, useState, useRef } from 'react';
import { YotoPlayerMQTTClient } from '../yotoMqttClient';

export const useMQTT = (props) => {

    const mqttClient = useRef(null);
    const { eventReceived } = props;
    const [ deviceIdState ] = useState(props.deviceId);

    useEffect(() => {
        if(!mqttClient.current && deviceIdState) {
            mqttClient.current = new YotoPlayerMQTTClient({
                data : { deviceId: deviceIdState }
            })
                .on('msgEvents', (e) => eventReceived(e));
            mqttClient.current.start();
        }
        return () => {};
    }, [ deviceIdState, eventReceived ]);

    return mqttClient.current;
};


