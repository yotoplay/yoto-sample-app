import { Component } from 'react';
import { login } from '../utils/yotoAuthService';

export class Login extends Component {

    componentDidMount() {
        login();
    }

    render() {
        return null;
    }
}