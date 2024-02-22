import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { login, logout, isLoggedIn } from '../utils/yotoAuthService';
import { useSnackbar } from 'notistack';
import { Button, AppBar, Toolbar } from '@mui/material';
import '../App.css';

export const Nav = () => {
    const location = useLocation();
    const intervalId = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        intervalId.current = setInterval(() => {
            if(!isLoggedIn() && location.pathname !== '/') {
                enqueueSnackbar(<>{'You\'ve been signed out out; you\'ll need to '}<Link target={'_new'} to='/login'>{'log back in'}</Link></>, 'error');
            }
        }, 3000);

        return () => {
            clearInterval(intervalId.current); 
        };
    }, [location, enqueueSnackbar]);

    useEffect(()=> {
        if(!isLoggedIn() && location.pathname !== '/') {
            console.log('Logged out - redirecting');
            logout();
        }
        return () => {};
    }, [ location ]);

    return <>
        <AppBar color="secondary" position="fixed" className="App-header">
            <Toolbar className="navbar-default">
                <div className="navbar-header">
                    <Link className="navbar-brand" to="/">
                        <img src="https://www.datocms-assets.com/48136/1633096024-face-3x.png" width="50" height="50" />
                    </Link>
                </div>
                <ul className="nav navbar-nav navbar-right" style={{ marginLeft: 'auto', marginRight:'10px' }}>
                    {
                        (isLoggedIn()) ?
                            ( <Button variant="contained" color="primary" onClick={() => logout()}>Log out </Button> ) :
                            ( <Button variant="contained" color="secondary" onClick={() => login()}>Log In</Button> )
                    }
                </ul>
            </Toolbar>
        </AppBar>
        <Toolbar style={{ marginBottom: '20px' }}/>
    </>;

};
