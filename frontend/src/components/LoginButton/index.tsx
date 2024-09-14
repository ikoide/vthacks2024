const API_URL = import.meta.env.VITE_API_URL;

import { useState } from 'react';

const LoginButton = ({ setUserData }: any) => {
    return (
        <button
        onClick={() => {
            // window.location.href = API_URL + "/login";

            // create popup window, and listen to changes for localstorage to update user data
            // center window in middle of screen
            const y =
                window.outerHeight / 2 + window.screenY - 300;
            const x =
                window.outerWidth / 2 + window.screenX - 300;
            const popup = window.open(
                API_URL + '/login?popup=true',
                'Login',
                `width=600,height=600,top=${y},left=${x}`
            );

            // add event listener to listen to changes in localstorage
            window.addEventListener('storage', (e) => {
                if (e.key === 'session') {
                    // update user data
                    const token =
                        localStorage.getItem('session');
                    fetch(API_URL + '/user', {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            setUserData(data);
                        });
                    // close popup
                    popup?.close();
                }
            });

            // add event listener to listen to changes in popup window
        }}
        >Login</button>
    );
};

export default LoginButton;