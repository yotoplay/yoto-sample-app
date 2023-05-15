import React, { useState, useEffect } from 'react';
import { Card, Stack, Chip } from '@mui/material';
import { Nav } from './Nav';
import { useLoggedInCheck } from '../utils/signInHooks';
import { useMQTT } from '../utils/mqtt/mqttHooks';
import { PlayerIcon } from './Icons/PlayerIcon';
import { getDevicesView } from '../utils/yotoApi';

const DeviceComponent = (props) => {
    // eslint-disable-next-line react/prop-types
    const { device } = props;
    const [ deviceState ] = useState(device);
    //const [ eventState, setEventState ] = useState();
    const [ volState, setVolState ] = useState();
    const [ playbackState, setPlaybackState ] = useState();

    // eslint-disable-next-line react/prop-types
    useMQTT({ deviceId: device.deviceId, eventReceived: (e) => { 
        console.log(e);
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
                <div>{deviceState.name}</div>
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



export const Home  = () => {

    const [devicesState, setDevices] = useState();
    const _isLoggedIn = useLoggedInCheck();

    useEffect(()=> {
        if(!_isLoggedIn){
            return;
        }
        async function fetchData() {
            const familyResponse = await getDevicesView();
            setDevices(familyResponse.devices);
        }
        fetchData();
    }, [ setDevices, _isLoggedIn ]);


    return (
        <div>
            <Nav/>
            <div>
                { useLoggedInCheck()
                    ? <>
                        <div>
                            {   devicesState ? 
                                <>
                                    { devicesState.filter(d => d.online).map(d => 
                                        <DeviceComponent key={d.deviceId} device={d} />)
                                    }
                                </>
                                : ''
                            }
                        </div>
                    </>
                    : <div>Sign in to continue</div>
                }
            </div>
        </div>
    );
};
