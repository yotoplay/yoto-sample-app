import { useState, useEffect, useRef } from 'react';
import { isLoggedIn } from './yotoAuthService';

export const useLoggedInCheck = () => {
    const [loggedInState, setLoggedInState] = useState(isLoggedIn());
    const intervalId = useRef(setInterval(() => { }));
    const checkInterval = 3000;
    useEffect(() => {
        intervalId.current = setInterval(() => {
            setLoggedInState(isLoggedIn());
        }, checkInterval);

        return () => {
            clearInterval(intervalId.current);
        };
    }, []);

    return loggedInState;
};
