import React from "react";
import ReactDOM from "react-dom";
import VideoPlayer from "./VideoPlayer";
import "./styles/index.css";
import vid from "./assets/vid.mp4";

ReactDOM.render(
    <React.StrictMode>
        <div className="vidPlayerCont">
            <VideoPlayer video={vid} title="Video Title" />
        </div>
    </React.StrictMode>,
    document.getElementById("root")
);
