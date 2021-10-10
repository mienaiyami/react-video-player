import React, { useEffect } from "react";

const SettingOptions = React.forwardRef(
    (
        { display, options, displaySettingsUpdater, playbackRate },
        settingsRef
    ) => {
        useEffect(() => {
            document.addEventListener("mousedown", (e) => {
                if (
                    !e.path.includes(settingsRef.current) &&
                    !e.path.includes(
                        document.querySelector("#videoPlayer .settingBtn")
                    )
                )
                    displaySettingsUpdater(false);
            });
        }, []);
        return (
            <div
                className="settingOptions"
                ref={settingsRef}
                style={{ display: display }}
                tabIndex="-1"
            >
                {options.map((e) => {
                    return (
                        <div className="optionTab" key={e.name}>
                            <h3>{e.name}</h3>
                            {e.options.map((e) => {
                                return (
                                    <div
                                        className={
                                            "options " +
                                            (e.name.replace("x", "") ===
                                            playbackRate.toString()
                                                ? "selected"
                                                : "")
                                        }
                                        key={e.name}
                                        onClick={e.function}
                                    >
                                        {e.name}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
);

export default SettingOptions;
