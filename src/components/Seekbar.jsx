import React from "react";

const Seekbar = ({
    currentTime,
    fullLength,
    mouseDownOnSeekbarUpdater,
    touchSeek,
    hoveredTimeUpdater,
    mouseDownOnSeekbar,
    loadedTime,
    hoveredTime,
}) => {
    return (
        <div
            className="seekbar"
            role="slider"
            aria-valuenow={(currentTime * 100) / fullLength || 0}
            onMouseDown={(e) => {
                mouseDownOnSeekbarUpdater(true);
                touchSeek(e);
            }}
            onMouseUp={() => mouseDownOnSeekbarUpdater(false)}
            onMouseMove={(e) => {
                hoveredTimeUpdater(e.nativeEvent.offsetX);
                if (mouseDownOnSeekbar) touchSeek(e);
            }}
            onMouseLeave={() => {
                hoveredTimeUpdater(0);
                mouseDownOnSeekbarUpdater(false);
            }}
        >
            <span className="full"></span>
            <span
                className="loaded"
                style={{
                    width: `${(loadedTime * 100) / fullLength}%`,
                }}
            ></span>
            <span
                className="hover"
                style={{
                    width: `${hoveredTime}px`,
                }}
            ></span>
            <span
                className="current"
                style={{
                    width: `${(currentTime * 100) / fullLength}%`,
                }}
            ></span>
        </div>
    );
};

export default Seekbar;
