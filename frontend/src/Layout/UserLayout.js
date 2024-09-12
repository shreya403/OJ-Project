import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UserLayout() {
    const user = useSelector((state) => state.Auth.user);
    const navigate = useNavigate();
    const googleUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user && !googleUser) {
            navigate('/login');
        }
    }, [user, googleUser, navigate]);

    return (
        <Outlet />
    );
}