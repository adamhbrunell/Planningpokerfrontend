import React from 'react';

function OptionMenu({ options, onSelect }) {
    return (
        <div className="option-menu">
            {options.map((option, index) => (
                <div key={index} className="option-menu-item" onClick={() => onSelect(option)}>
                    {option}
                </div>
            ))}
        </div>
    );
}

export default OptionMenu;