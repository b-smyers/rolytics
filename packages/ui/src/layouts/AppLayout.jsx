import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Protected from '../components/Protected';
import './AppLayout.css';

const SidbarButton = ({ icon, name, uri, isThemed = false }) => {
    const navigate = useNavigate();
    const navigateURI = () => { navigate(uri); };
  
    return (
        <button
            className="sidebar-nav-item"
            onClick={navigateURI}
            onKeyUp={(input) => {
                if (input.key === 'Enter') navigateURI();
            }}
            tabIndex={0} // Makes the div focusable for accessibility
            aria-label={name}>
            {<img src={icon} alt={name} className={`sidebar-icon ${isThemed ? 'themed' : ''}`} />}
            {name && <span className="sidebar-name">{name}</span>}
        </button>
    )
};

function AppLayout() {
    const date = new Date();
    let year = date.getFullYear();

    return (
        <div className="layout">
            <aside className={"sidebar"}>
                <div className="sidebar-top">
                    <SidbarButton icon={"/logos/rolytics.svg"} name={"Rolytics"} uri={"/"}/>
                    <Protected>
                        <SidbarButton 
                            icon={"/icons/home.svg"} 
                            name={"Dashboard"} 
                            uri={"/dashboard"}
                            isThemed={true}
                        />
                    </Protected>
                </div>
                <div className="sidebar-bottom">
                    <SidbarButton
                        icon={"/icons/missing.svg"}
                        name={"Register"}
                        uri={"/register"}
                        isThemed={true}
                    />
                    <SidbarButton
                        icon={"/icons/login.svg"}
                        name={"Login"}
                        uri={"/login"}
                        isThemed={true}
                    />
                </div>
            </aside>
            <div className="main-content">
                <div className='fill-page'>
                    <Outlet />
                </div>
                <footer>
                    <p>&copy;Rolytics {year}</p>
                </footer>
            </div>
        </div>
    );
}

export default AppLayout;