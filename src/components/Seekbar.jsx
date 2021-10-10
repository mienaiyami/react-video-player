import React, { useRef, useState } from "react";

const Seekbar = ({
    currentTime,
    fullLength,
    mouseDownOnSeekbarUpdater,
    touchSeek,
    hoveredTimeUpdater,
    mouseDownOnSeekbar,
    loadedTime,
    hoveredTime,
    hoveredLengthUpdater,
    hoveredLength,
    formatTime,
}) => {
    const [seekbarHovered, seekbarHoveredUpdater] = useState(false);
    const seekbarRef = useRef(null);
    return (
        <div
            className="seekbar"
            role="slider"
            aria-valuenow={(currentTime * 100) / fullLength || 0}
            onMouseDown={(e) => {
                mouseDownOnSeekbarUpdater(true);
                touchSeek(e);
            }}
            ref={seekbarRef}
            onMouseUp={() => mouseDownOnSeekbarUpdater(false)}
            onMouseMove={(e) => {
                hoveredLengthUpdater(e.nativeEvent.offsetX);
                hoveredTimeUpdater(
                    (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) *
                        fullLength
                );
                seekbarHoveredUpdater(true);

                if (mouseDownOnSeekbar) touchSeek(e);
            }}
            onMouseLeave={() => {
                hoveredLengthUpdater(0);
                hoveredTimeUpdater(0);
                seekbarHoveredUpdater(false);
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
                    width: `${hoveredLength}px`,
                }}
            ></span>
            <span
                className="current"
                style={{
                    width: `${(currentTime * 100) / fullLength}%`,
                }}
            ></span>
            <div
                className="hoveredTime"
                style={{
                    display: seekbarHovered ? "block" : "none",
                    left:
                        hoveredLength < 20
                            ? 20
                            : hoveredLength >
                              seekbarRef.current.offsetWidth - 20
                            ? seekbarRef.current.offsetWidth - 20
                            : hoveredLength,
                }}
            >
                {formatTime(hoveredTime)}
            </div>
        </div>
    );
};

export default Seekbar;
