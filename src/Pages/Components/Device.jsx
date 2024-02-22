import React, { useState } from 'react';
import { Card, Stack, Chip, Typography } from '@mui/material';
import { useMQTT } from '../../utils/mqtt/mqttHooks';
import { PlayerIcon } from '../Icons/PlayerIcon';

export const DeviceComponent = (props) => {
    // eslint-disable-next-line react/prop-types
    const { device } = props;
    const [ deviceState ] = useState(device);
    const [ volState, setVolState ] = useState();
    const [ playbackState, setPlaybackState ] = useState();

    // eslint-disable-next-line react/prop-types
    useMQTT({ deviceId: device.deviceId, eventReceived: (e) => { 
        // eslint-disable-next-line react/prop-types
        console.log(device.deviceId, e);
        if(e.volume) {
            setVolState(e.volume);
        }
        if(e.playbackStatus) {
            setPlaybackState(e);
        }
    } });

    return <>
        <Card>
            <Stack
                direction="row"
                justifyContent="space-evently"
                spacing={5}
                sx={{ px: 2, py: 1, bgcolor: 'background.default' }}
            >
                <PlayerIcon 
                    online={deviceState.online}
                    deviceType={deviceState.deviceType}
                />
                <Typography >{deviceState.name}</Typography>
                { volState || volState === 0
                    ? <Chip label={volState} ></Chip>
                    : <></>
                }
                { playbackState
                    ? <Chip label={`${playbackState.playbackStatus} - ${playbackState.cardId}`} ></Chip>
                    : <></> 
                }
                { playbackState?.chapterTitle
                    ? <Chip label={`${playbackState.chapterTitle} - ${playbackState.position}`} ></Chip>
                    : <></> 
                }
            </Stack>
        </Card>
    </>;
};