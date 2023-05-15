import React  from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as PlayerMiniOnline } from './mini-online.svg';
import { ReactComponent as PlayerMiniOffline } from './mini-offline.svg';
import { ReactComponent as PlayerV2Online } from './v2-online.svg';
import { ReactComponent as PlayerV2Offline } from './v2-offline.svg';

export const PlayerIcon = (props) => {
    const isOnline = props.online;

    const OnlineIcon = () => props.deviceType === 'mini' 
        ? <PlayerMiniOnline />
        : <PlayerV2Online />;
    
    const OfflineIcon = () => props.deviceType === 'mini'
        ? <PlayerMiniOffline />
        : <PlayerV2Offline />;

    return isOnline 
        ? <OnlineIcon /> 
        : <OfflineIcon />;
};

PlayerIcon.propTypes = {
    online: PropTypes.bool,
    deviceType: PropTypes.string
};
