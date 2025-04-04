import { redirect } from "react-router-dom";

export function getAuthToken() {
    const token = localStorage.getItem('jwt');
    return token;
}

export function setAuthToken(token) {
    localStorage.setItem('jwt', token);
}

export function setLevel(level) {
    localStorage.setItem('level', level);
}

export function getLevel() {
    const level = localStorage.getItem('level');
    return level;
}

export function checkAuthLoader() {
    const token = getAuthToken();

    if(!token) {
        return redirect('/');
    }

    return null;
}

export function logOut() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('level');
}