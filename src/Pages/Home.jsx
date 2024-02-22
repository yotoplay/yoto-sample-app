import React, { useState, useEffect } from 'react';
import { Nav } from './Nav';
import { useLoggedInCheck } from '../utils/signInHooks';
import { getDevicesView } from '../utils/yotoApi';
import { DeviceComponent } from './Components/Device';

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
