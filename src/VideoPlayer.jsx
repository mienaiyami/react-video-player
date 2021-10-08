import React, { useEffect, useRef, useState } from "react";
import Seekbar from "./components/Seekbar";
const VideoPlayer = ({ video, title }) => {
    const vidRef = useRef(null);
    const ctrlRef = useRef(null);
    const [firstRendered, firstRenderedUpdater] = useState(false);
    const [fullLength, fullLengthUpdater] = useState(0);
    const [currentTime, currentTimeUpdater] = useState(0);
    const [hoveredTime, hoveredTimeUpdater] = useState(0);
    const [loadedTime, loadedTimeUpdater] = useState(0);
    const [vidState, vidStateUpdater] = useState("paused");
    const [vidVolume, vidVolumeUpdater] = useState(0.5);
    const [vidVolumeLast, vidVolumeLastUpdater] = useState(0.5);
    const [mouseDownOnSeekbar, mouseDownOnSeekbarUpdater] = useState(false);
    const toogleVidState = (pass) => {
        if (pass || firstRendered) {
            console.log("fffffff", vidState);
            if (vidState === "playing") return vidStateUpdater("paused");
            if (vidState === "paused") return vidStateUpdater("playing");
        }
    };
    useEffect(() => {
        firstRenderedUpdater(true);
        document.addEventListener("keydown", (e) => {
            if (e.key === " ") {
                e.preventDefault();
                console.log("f");
                ctrlRef.current.querySelector(".playpause").click();
            }
        });
    }, []);
    useEffect(() => {
        if (vidState === "playing") vidRef.current?.play();
        if (vidState === "paused") vidRef.current?.pause();
    }, [vidState]);
    const updateBufferedTime = () => {
        let percentVidLoaded = 0;
        if (
            vidRef.current.buffered.length > 0 &&
            vidRef.current.buffered.end &&
            vidRef.current.duration
        ) {
            if (vidRef.current.buffered.length > 1) {
                for (let i = vidRef.current.buffered.length - 1; i > 0; i--) {
                    if (
                        currentTime > vidRef.current.buffered.end(i - 1) &&
                        vidRef.current.buffered.end(i) > currentTime
                    ) {
                        percentVidLoaded = vidRef.current.buffered.end(i);
                    }
                }
            } else {
                percentVidLoaded = vidRef.current.buffered.end(0);
            }
        }
        if (percentVidLoaded) {
            percentVidLoaded = Math.min(
                vidRef.current.duration,
                Math.max(0, percentVidLoaded)
            );
            loadedTimeUpdater(percentVidLoaded);
        }
    };
    const seekVideo = (val) => {
        if (firstRendered) {
            if (val >= 0 && val <= fullLength) {
                vidRef.current.currentTime = val;
                currentTimeUpdater(val);
                updateBufferedTime();
            }
        }
    };
    const touchSeek = (e) => {
        let seektime =
            (e.nativeEvent.offsetX /
                ctrlRef.current?.querySelector(".seekbar").offsetWidth) *
            fullLength;
        seekVideo(seektime);
    };
    const changeVolume = (vol) => {
        vidVolumeUpdater(parseFloat(Math.max(0, Math.min(1, vol))) || 0);
    };
    useEffect(() => {
        if (vidRef.current !== null) vidRef.current.volume = vidVolume;
    }, [vidVolume]);
    return (
        <div id="videoPlayer">
            <video
                src={
                    "https://www.videolinks.com/pub/media/videolinks/video/DJI.mp4"
                }
                // autoPlay
                className="video"
                ref={vidRef}
                onLoadedMetadata={() => {
                    fullLengthUpdater(vidRef.current.duration);
                    console.log("dur", vidRef.current.duration);
                    if (document.visibilityState === "visible")
                        vidStateUpdater("playing");
                    else {
                        document.addEventListener(
                            "visibilitychange",
                            function handler(e) {
                                if (document.visibilityState === "visible") {
                                    vidStateUpdater("playing");
                                    console.log(document.visibilityState);
                                    document.removeEventListener(
                                        e.type,
                                        handler
                                    );
                                }
                            }
                        );
                    }
                }}
                onProgress={() => {
                    updateBufferedTime();
                }}
                onTimeUpdate={() => {
                    currentTimeUpdater(vidRef.current.currentTime);
                }}
                onClick={() => {
                    toogleVidState();
                }}
                onAuxClick={() => {
                    toogleVidState();
                }}
                onPause={() => vidStateUpdater("paused")}
                onPlay={() => vidStateUpdater("playing")}
                // controls
            ></video>
            <div className="controls" ref={ctrlRef}>
                <Seekbar
                    currentTime={currentTime}
                    fullLength={fullLength}
                    mouseDownOnSeekbarUpdater={mouseDownOnSeekbarUpdater}
                    touchSeek={touchSeek}
                    hoveredTimeUpdater={hoveredTimeUpdater}
                    mouseDownOnSeekbar={mouseDownOnSeekbar}
                    loadedTime={loadedTime}
                    hoveredTime={hoveredTime}
                />

                <div className="ctrlBtns">
                    <div className="left">
                        <button
                            className="playpause"
                            data-state={vidState}
                            data-title={
                                vidState === "playing" ? "Pause" : "Play"
                            }
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
                                height="30px"
                                viewBox="0 0 24 24"
                                width="30px"
                                fill="#ffffff"
                            >
                                {vidState === "playing" ? (
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                ) : (
                                    <path d="M8 5v14l11-7z" />
                                )}
                            </svg>
                        </button>
                        <button
                            className="audio"
                            data-title="Mute"
                            onClick={() => {
                                if (vidVolume === 0)
                                    return changeVolume(vidVolumeLast);
                                changeVolume(0);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#ffffff"
                            >
                                {vidVolume > 0.5 ? (
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                ) : vidVolume > 0.1 ? (
                                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                                ) : vidVolume > 0 ? (
                                    <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                                ) : (
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                )}
                            </svg>
                        </button>
                        <div className="audiorange">
                            <span
                                className="trail"
                                style={{
                                    width: `${
                                        ctrlRef.current?.querySelector(
                                            ".audiorange input"
                                        ).value
                                    }%`,
                                }}
                            ></span>
                            <input
                                type="range"
                                value={vidVolume * 100}
                                min="0"
                                max="100"
                                onChange={(e) => {
                                    vidVolumeUpdater(
                                        e.target.valueAsNumber / 100
                                    );
                                }}
                                onMouseUp={(e) => {
                                    vidVolumeLastUpdater(
                                        e.target.valueAsNumber / 100
                                    );
                                }}
                            />
                        </div>
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
