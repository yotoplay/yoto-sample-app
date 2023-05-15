import { Component } from 'react';
import { setAccessToken } from '../utils/yotoAuthService';

export class Callback extends Component {

    componentDidMount() {
        setAccessToken();
        window.location.href = '/';
    }

    render() {
        return null;
    }
}
