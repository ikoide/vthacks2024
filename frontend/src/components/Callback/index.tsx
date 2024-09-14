import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

function Callback({ setUserData }: any) {
	const navigate = useRef(useNavigate());

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const session = urlParams.get('session') as string;
		localStorage.setItem('session', session);
        navigate.current('/');
	}, []);

	return null;
}

export default Callback;