import auth0 from 'auth0-js';
import decode from 'jwt-decode';

const ACCESS_TOKEN = 'access_token';
const REDIRECT = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`;
const SCOPE = 'YOUR_SCOPE';
const AUDIENCE = 'https://api.yotoplay.com';

const auth = new auth0.WebAuth({
    clientID: 'cIQ241O2gouOOAwFFvxuGVkHGT3LL6rn',
    domain: 'login.yotoplay.com'
});

export function login(returnUrl) {
    auth.authorize({
        responseType: 'token id_token',
        redirectUri: REDIRECT + (returnUrl ? `?returnUrl=${returnUrl}` : ''),
        audience: AUDIENCE,
        scope: SCOPE
    });
}

export function logout(redirectUrl) {
    localStorage.removeItem(ACCESS_TOKEN);
    let returnTo = `${window.location.protocol}//${window.location.host}`;
    if (redirectUrl) returnTo = redirectUrl.startsWith('http') ? redirectUrl : returnTo + redirectUrl;
    auth.logout({ returnTo: returnTo });

}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
}

// Helper function that will allow us to extract the access_token and id_token
function getParameterByName(name) {
    let match = RegExp(`[#&]${name}=([^&#?]*)`).exec(window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
    let accessToken = getParameterByName(ACCESS_TOKEN);
    if (accessToken) localStorage.setItem(ACCESS_TOKEN, accessToken);
}

const _tryDecodeToken = (encodedToken) => {
    try {
        return decode(encodedToken);
    } catch (err) {
        return null;
    }
};

export function isAdmin() {
    const token = _tryDecodeToken(localStorage.getItem(ACCESS_TOKEN));
    if (!token) return null;
    if (!token['https://yotoplay.com/roles']) { return null; }
    return token['https://yotoplay.com/roles'].split(',').includes('admin');
}

export function isLoggedIn() {
    const _getTokenExpirationDate = (encodedToken) => {
        const token = _tryDecodeToken(encodedToken);
        if (!token || !token.exp) { return null; }
        const date = new Date(0);
        date.setUTCSeconds(token.exp);
        return date;
    };

    const _isTokenExpired = (token) => _getTokenExpirationDate(token) < new Date();

    const token = getAccessToken();
    return !!token && !_isTokenExpired(token);
}

