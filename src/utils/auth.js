import { redirect } from "react-router-dom";

export function getAuthToken() {
    const token = localStorage.getItem('jwt');
    return token;
}

export function setAuthToken() {
    localStorage.setItem('jwt');
}

export function checkAuthLoader() {
    const token = getAuthToken();

    if(!token) {
        return redirect('/');
    }

    return null;
}