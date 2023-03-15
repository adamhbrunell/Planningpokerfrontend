import React, { useState } from "react";
import "./TestPage.css"
import OptionMenu from "./OptionMenu";

const TestPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="container">
            <div className="option-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
            {isOpen && (
                <OptionMenu
                    options={['Option 1', 'Option 2', 'Option 3']}
                    onSelect={handleOptionSelect}
                />
            )}
            {selectedOption && <div>You selected {selectedOption}</div>}
        </div>
    );
}

export default TestPage;
