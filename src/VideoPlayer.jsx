import React, { useEffect, useRef, useState } from "react";
import Seekbar from "./components/Seekbar";
import SettingOptions from "./components/SettingOptions";
const VideoPlayer = ({ video, title }) => {
    const mainRef = useRef(null);
    const vidRef = useRef(null);
    const ctrlRef = useRef(null);
    const settingRef = useRef(null);
    const [firstRendered, firstRenderedUpdater] = useState(false);
    const [fullLength, fullLengthUpdater] = useState(0);
    const [currentTime, currentTimeUpdater] = useState(0);
    const [hoveredTime, hoveredTimeUpdater] = useState(0);
    const [hoveredLength, hoveredLengthUpdater] = useState(0);
    const [loadedTime, loadedTimeUpdater] = useState(0);
    const [vidState, vidStateUpdater] = useState("paused");
    const [vidVolume, vidVolumeUpdater] = useState(0.5);
    const [isLoading, isLoadingUpdater] = useState(false);
    const [vidVolumeLast, vidVolumeLastUpdater] = useState(0.5);
    const [isFullscreen, isFullscreenUpdater] = useState(false);
    const [displaySettings, displaySettingsUpdater] = useState(false);
    const [playbackRate, playbackRateUpdater] = useState(1);
    const [mouseDownOnSeekbar, mouseDownOnSeekbarUpdater] = useState(false);
    const toggleVidState = (pass) => {
        if (pass || firstRendered) {
            if (vidState === "playing") return vidStateUpdater("paused");
            if (vidState === "paused") return vidStateUpdater("playing");
        }
    };
    useEffect(() => {
        vidStateUpdater("paused");
    }, [video]);
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
    const seekVideo = (val, pass) => {
        if (firstRendered || pass) {
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

    const formatTime = (timeinsec) => {
        if (timeinsec < 60)
            return `00:${
                parseInt(timeinsec).toString().length < 2
                    ? 0 + parseInt(timeinsec).toString()
                    : parseInt(timeinsec).toString()
            }`;
        if (timeinsec > 60 && timeinsec < 3600) {
            let min = parseInt(timeinsec / 60);
            let sec = parseInt((timeinsec / 60 - min) * 60);
            return `${
                min.toString().length < 2 ? 0 + min.toString() : min.toString()
            }:${
                sec.toString().length < 2 ? 0 + sec.toString() : sec.toString()
            }`;
        }
        if (timeinsec > 3600) {
            let hour = parseInt(timeinsec / 3600);
            let min = parseInt((timeinsec / 60 - hour) * 60);
            let sec = parseInt((timeinsec / 60 - min) * 60);
            return `${hour.toString()}:${
                min.toString().length < 2 ? 0 + min.toString() : min.toString()
            }:${
                sec.toString().length < 2 ? 0 + sec.toString() : sec.toString()
            }`;
        }
    };
    useEffect(() => {
        firstRenderedUpdater(true);
        document.addEventListener("keydown", (e) => {
            switch (e.key) {
                case " ":
                    e.preventDefault();
                    ctrlRef.current.querySelector(".playpause").click();
                    break;
                case "ArrowRight":
                    ctrlRef.current.querySelector(".skipNext").click();
                    break;
                case "ArrowLeft":
                    ctrlRef.current.querySelector(".skipPrev").click();
                    break;
                case "ArrowUp":
                    ctrlRef.current.querySelector(".audiorange .volUp").click();
                    break;
                case "ArrowDown":
                    ctrlRef.current
                        .querySelector(".audiorange .volDown")
                        .click();
                    break;
                case "m":
                    ctrlRef.current.querySelector(".volume").click();
                    break;
                case "f":
                    if (!e.ctrlKey)
                        ctrlRef.current.querySelector(".fullscreen").click();
                    break;
                case "Escape":
                    isFullscreen(false);
                    break;
                default:
                    break;
            }
        });
    }, []);
    useEffect(() => {
        if (vidState === "playing") vidRef.current?.play();
        if (vidState === "paused") vidRef.current?.pause();
    }, [vidState]);
    useEffect(() => {
        if (vidRef.current !== null) vidRef.current.volume = vidVolume;
        let trail = ctrlRef.current.querySelector(".audiorange .trail");
        let width = parseFloat(
            getComputedStyle(trail).getPropertyValue("max-width")
        );
        let trailWidth;
        if (width === 0) trailWidth = 0;
        else trailWidth = (vidVolume * 10000) / width;
        trail.style.width = `${trailWidth}px`;
    }, [vidVolume]);
    useEffect(() => {
        if (isFullscreen) mainRef.current?.requestFullscreen();
        else if (document.fullscreenElement) document.exitFullscreen();
    }, [isFullscreen]);
    useEffect(() => {
        if (vidRef.current) vidRef.current.playbackRate = playbackRate;
    }, [playbackRate]);
    const settingOptions = [
        {
            name: "Speed",
            type: "radio",
            options: [
                {
                    name: "x1",
                    function: function () {
                        playbackRateUpdater(1);
                    },
                },
                {
                    name: "x1.25",
                    function: function () {
                        playbackRateUpdater(1.25);
                    },
                },
                {
                    name: "x1.5",
                    function: function () {
                        playbackRateUpdater(1.5);
                    },
                },
                {
                    name: "x1.75",
                    function: function () {
                        playbackRateUpdater(1.75);
                    },
                },
                {
                    name: "x2",
                    function: function () {
                        playbackRateUpdater(2);
                    },
                },
            ],
        },
    ];
    return (
        <div id="videoPlayer" ref={mainRef}>
            <div
                className="vidCont"
                onClick={() => {
                    toggleVidState();
                }}
                onDoubleClick={() => {
                    isFullscreenUpdater(!isFullscreen);
                }}
            >
                <div
                    className="loading"
                    style={{ display: isLoading ? "block" : "none" }}
                >
                    <svg height="80" width="80">
                        <circle cx="40" cy="40" r="35" />
                    </svg>
                </div>
                <video
                    src={video}
                    className="video"
                    ref={vidRef}
                    onLoadStart={() => {
                        isLoadingUpdater(true);
                    }}
                    onLoadedMetadata={() => {
                        fullLengthUpdater(vidRef.current.duration);
                        if (document.visibilityState === "visible") {
                            vidStateUpdater("playing");
                        } else {
                            document.addEventListener(
                                "visibilitychange",
                                function handler(e) {
                                    if (
                                        document.visibilityState === "visible"
                                    ) {
                                        vidStateUpdater("playing");
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
                        if (vidRef.current.readyState <= 2) {
                            isLoadingUpdater(true);
                        } else isLoadingUpdater(false);
                    }}
                    onTimeUpdate={() => {
                        currentTimeUpdater(vidRef.current.currentTime);
                        if (isLoading) {
                            if (vidRef.current.readyState <= 2) {
                                isLoadingUpdater(true);
                            } else isLoadingUpdater(false);
                        }
                    }}
                    onAuxClick={() => {
                        toggleVidState();
                    }}
                    onPause={() => vidStateUpdater("paused")}
                    onPlay={() => vidStateUpdater("playing")}
                    // controls
                ></video>
            </div>
            <div className="controls" ref={ctrlRef}>
                <Seekbar
                    currentTime={currentTime}
                    fullLength={fullLength}
                    mouseDownOnSeekbarUpdater={mouseDownOnSeekbarUpdater}
                    touchSeek={touchSeek}
                    hoveredTimeUpdater={hoveredTimeUpdater}
                    hoveredLengthUpdater={hoveredLengthUpdater}
                    mouseDownOnSeekbar={mouseDownOnSeekbar}
                    loadedTime={loadedTime}
                    hoveredTime={hoveredTime}
                    hoveredLength={hoveredLength}
                    formatTime={formatTime}
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
                            className="volume"
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
                        <div
                            className="audiorange"
                            onWheel={(e) => {
                                if (e.deltaY < 0) {
                                    ctrlRef.current
                                        .querySelector(".audiorange .volUp")
                                        .click();
                                }
                                if (e.deltaY > 0) {
                                    ctrlRef.current
                                        .querySelector(".audiorange .volDown")
                                        .click();
                                }
                            }}
                        >
                            <span className="trail"></span>
                            <button
                                style={{ display: "none" }}
                                onClick={() => {
                                    changeVolume(vidVolume - 0.1);

                                    if (
                                        ctrlRef.current.querySelector(
                                            ".audiorange input"
                                        ).valueAsNumber !== 0
                                    )
                                        vidVolumeLastUpdater(
                                            ctrlRef.current.querySelector(
                                                ".audiorange input"
                                            ).valueAsNumber / 100
                                        );
                                }}
                                className="volDown"
                            >
                                slide-5
                            </button>
                            <button
                                style={{ display: "none" }}
                                onClick={() => {
                                    changeVolume(vidVolume + 0.1);

                                    if (
                                        ctrlRef.current.querySelector(
                                            ".audiorange input"
                                        ).valueAsNumber !== 0
                                    )
                                        vidVolumeLastUpdater(
                                            ctrlRef.current.querySelector(
                                                ".audiorange input"
                                            ).valueAsNumber / 100
                                        );
                                }}
                                className="volUp"
                            >
                                slide+5
                            </button>
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
                                    if (e.target.valueAsNumber !== 0)
                                        vidVolumeLastUpdater(
                                            e.target.valueAsNumber / 100
                                        );
                                }}
                            />
                        </div>
                        <button
                            className="skipPrev"
                            data-title="-5s"
                            onClick={() => {
                                vidRef.current.currentTime -= 5;
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30px"
                                viewBox="0 0 24 24"
                                width="30px"
                                fill="#ffffff"
                            >
                                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" />
                            </svg>
                        </button>
                        <button
                            className="skipNext"
                            data-title="+5s"
                            onClick={() => {
                                vidRef.current.currentTime += 5;
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30px"
                                viewBox="0 0 24 24"
                                width="30px"
                                fill="#ffffff"
                            >
                                <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                            </svg>
                        </button>
                    </div>
                    <div className="right">
                        <div className="time">
                            <span className="current">
                                {formatTime(currentTime)}
                            </span>
                            /
                            <span className="total">
                                {formatTime(fullLength)}
                            </span>
                        </div>
                        <button
                            className="settingBtn"
                            data-title="Settings"
                            onClick={(e) => {
                                if (!displaySettings) {
                                    setTimeout((e) => {
                                        settingRef.current.focus();
                                    }, 200);
                                }
                                displaySettingsUpdater(!displaySettings);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#ffffff"
                            >
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                            </svg>
                        </button>
                        <SettingOptions
                            display={displaySettings ? "flex" : "none"}
                            options={settingOptions}
                            ref={settingRef}
                            displaySettingsUpdater={displaySettingsUpdater}
                            playbackRate={playbackRate}
                        />
                        <button
                            className="picInPic"
                            data-title="Picture in Picture"
                            onClick={() => {
                                if (!document.pictureInPictureElement)
                                    return vidRef.current?.requestPictureInPicture();
                                else document.exitPictureInPicture();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 0 24 24"
                                width="24px"
                                fill="#ffffff"
                            >
                                <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" />
                            </svg>
                        </button>
                        <button
                            className="fullscreen"
                            onClick={() => {
                                isFullscreenUpdater(!isFullscreen);
                            }}
                            data-title={
                                isFullscreen ? "Exit Fullscreen" : "Fullscreen"
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="30px"
                                viewBox="0 0 24 24"
                                width="30px"
                                fill="#ffffff"
                            >
                                {isFullscreen ? (
                                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                                ) : (
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
