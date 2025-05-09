import { useState, useEffect } from 'react';
import './ToggleSwitch.css';

function ToggleSwitch({ name, selected, onChange }) {
    const [state, setState] = useState(selected);

    useEffect(() => {
        setState(selected);
    }, [selected]);

    return (
        <>
            <input
                name={name}
                className="toggle-switch-checkbox"
                id={`toggle-switch-new`}
                type="checkbox"
                checked={state}
                onChange={() => {
                    setState(!state); 
                    onChange(!state);
                }}
            />
            <label
                id="toggle-switch-label"
                htmlFor={`toggle-switch-new`}
            >
            <span id={`toggle-switch-button`} />
            </label>
        </>
    );
}

export default ToggleSwitch;