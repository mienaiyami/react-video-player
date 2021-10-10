import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import video from "./assets/Placeholder-Video.mp4";
const App = () => {
    const [link, linkUpadter] = useState(video);
    return (
        <div className="vidPlayerCont">
            <input
                type="file"
                onChange={(e) => {
                    let file = e.target.files[0];
                    if (file.type === "video/mp4") {
                        const fileLink = URL.createObjectURL(file);
                        URL.revokeObjectURL(link);
                        linkUpadter(fileLink);
                    }
                }}
            />
            or
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    linkUpadter(
                        e.target.querySelector("input[type='text']").value
                    );
                }}
            >
                <input type="text" placeholder="url of mp4" />
                <input type="submit" />
            </form>
            <VideoPlayer video={link} title="Video Title" />
        </div>
    );
};

export default App;
