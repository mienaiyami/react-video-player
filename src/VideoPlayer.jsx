import React from "react";
const VideoPlayer = ({ video, title }) => {
    return (
        <div id="videoPlayer">
            <video src={video} autoPlay className="video"></video>
            <div className="controls">
                <div className="seekbar">
                    <span className="full"></span>
                    <span className="loaded"></span>
                    <span className="current"></span>
                </div>
                <div className="left"></div>
                <div className="right"></div>
            </div>
        </div>
    );
};

export default VideoPlayer;
