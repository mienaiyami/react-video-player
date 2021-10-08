import React from "react";

const InputRange = ({ value, min, max, className }) => {
    return (
        <div
            className={"inputRange " + className}
            role="slider"
            aria-valuenow={value}
            onMouseDown={(e) => {}}
            onMouseUp={(e) => {}}
            onMouseMove={(e) => {}}
            onMouseLeave={() => {}}
        >
            <span className="full"></span>
            <span
                className="slider"
                style={{
                    width: `${(value * 100) / max}%`,
                }}
            ></span>
        </div>
    );
};

export default InputRange;
