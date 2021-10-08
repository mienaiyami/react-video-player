import React, { useEffect, useRef, useState } from "react";
const VideoPlayer = ({ video, title }) => {
    const vidRef = useRef(null);
    const ctrlRef = useRef(null);
    const [firstRendered, firstRenderedUpdater] = useState(false);
    const [fullLength, fullLengthUpdater] = useState(0);
    const [currentTime, currentTimeUpdater] = useState(0);
    const [hoveredTime, hoveredTimeUpdater] = useState(0);
    const [loadedTime, loadedTimeUpdater] = useState(0);
    const [vidState, vidStateUpdater] = useState("playing");
    const [mouseDownOnSeekbar, mouseDownOnSeekbarUpdater] = useState(false);
    useEffect(() => {
        firstRenderedUpdater(true);
        vidRef.current.onloadedmetadata = () => {
            fullLengthUpdater(vidRef.current.duration);
            console.log("dur", vidRef.current.duration);
        };
        vidRef.current.ontimeupdate = () => {
            currentTimeUpdater(vidRef.current.currentTime);
        };
        vidRef.current.onprogress = (e) => {
            let percentVidLoaded = 0;
            if (
                vidRef.current?.buffered.length > 0 &&
                vidRef.current.buffered.end &&
                vidRef.current.duration
            ) {
                for (let i = 0; i < vidRef.current.buffered.length; i++) {
                    // if(vidRef.current.buffered.end(i)>)
                }
                percentVidLoaded = vidRef.current.buffered.end(0);
                console.log(percentVidLoaded);
            }
            if (percentVidLoaded) {
                percentVidLoaded = Math.min(
                    vidRef.current.duration,
                    Math.max(0, percentVidLoaded)
                );
                console.log(percentVidLoaded, vidRef.current.duration);
                loadedTimeUpdater(percentVidLoaded);
            }
        };
    }, []);
    useEffect(() => {
        if (vidState === "playing") vidRef.current?.play();
        if (vidState === "paused") vidRef.current?.pause();
    }, [vidState]);
    const seekVideo = (val) => {
        if (firstRendered) {
            if (val >= 0 && val <= fullLength) {
                vidRef.current.currentTime = val;
                currentTimeUpdater(val);
            }
        }
    };
    const touchSeek = (e) => {
        let seektime =
            (e.nativeEvent.offsetX /
                ctrlRef.current?.querySelector(".seekbar").offsetWidth) *
            fullLength;
        console.log(seektime);
        seekVideo(seektime);
    };

    return (
        <div id="videoPlayer">
            <video
                src={
                    "https://www.videolinks.com/pub/media/videolinks/video/DJI.mp4"
                }
                // autoPlay
                className="video"
                ref={vidRef}
                onProgress={(e) => {
                    console.log(e);
                }}
                controls
            ></video>
            <div className="controls" ref={ctrlRef}>
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
                <div className="ctrlBtns">
                    <div className="left">
                        <button
                            className="playpause"
                            data-state={vidState}
                            onClick={() => {
                                vidStateUpdater(
                                    vidState === "playing"
                                        ? "paused"
                                        : "playing"
                                );
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#ffffff"
                            >
                                {vidState === "playing" ? (
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                ) : (
                                    <path d="M8 5v14l11-7z" />
                                )}
                            </svg>
                        </button>
                        <button className="skipPrev"></button>
                        <button className="skipNext"></button>
                    </div>
                    <div className="right"></div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
