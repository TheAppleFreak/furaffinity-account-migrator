import { useState, useEffect } from "preact/hooks";
import { open } from "@tauri-apps/api/shell";
import { platform } from "@tauri-apps/api/os";
import classnames from "classnames";

import imgChromeInspect from "./images/chrome/inspect.png";
import imgChromeApplicationsView from "./images/chrome/applications-menu.png";
import imgChromeCookiesView from "./images/chrome/cookies-view.png";

import imgFirefoxInspect from "./images/firefox/inspect.png";
import imgFirefoxNetworkTab from "./images/firefox/network-tab.png";
import imgFirefoxCookiesView from "./images/firefox/cookies-view.png";

import imgSafariSettings from "./images/safari/settings.png";
import imgSafariEnableDevTools from "./images/safari/enable-developer-mode.png";
import imgSafariOpenWebInspector from "./images/safari/open-web-inspector.png";
import imgSafariOpenNetworkTab from "./images/safari/open-network-tab.png";
import imgSafariSelectRequest from "./images/safari/select-request.png";
import imgSafariCookiesView from "./images/safari/cookies-view.png";

const InstructionsComponent = () => {
    enum Browsers {
        CHROME = "chrome",
        FIREFOX = "firefox",
        SAFARI = "safari"
    }

    const [browser, setBrowser] = useState<Browsers>(Browsers.CHROME);
    const [os, setOs] = useState<Awaited<ReturnType<typeof platform>>>();

    useEffect(() => {
        (async () => {
            setOs(await platform());
        })();
    }, []);

    return (
        <div className="w-full bg-base-200 overflow-auto">
            <div className="px-8 relative">
                <h1 className="text-xl font-bold pt-6">How to log in</h1>
                <p>
                    Because FurAffinity does not provide an API for apps to easily
                    interface with their site, this app uses a workaround by pretending
                    to be a web browser you've previously logged in from. As such, the
                    setup for this is a little more involved than might be expected.
                </p>
                <div className="tabs my-4">
                    <a
                        className={classnames("tab", "tab-bordered", {
                            "tab-active": browser === Browsers.CHROME
                        })}
                        onClick={() => setBrowser(Browsers.CHROME)}
                    >
                        Chrome/Edge/Opera
                    </a>
                    <a
                        className={classnames("tab", "tab-bordered", {
                            "tab-active": browser === Browsers.FIREFOX
                        })}
                        onClick={() => setBrowser(Browsers.FIREFOX)}
                    >
                        Firefox
                    </a>
                    {os === "darwin" ? (
                        <a
                            className={classnames("tab", "tab-bordered", {
                                "tab-active": browser === Browsers.SAFARI
                            })}
                            onClick={() => setBrowser(Browsers.SAFARI)}
                        >
                            Safari
                        </a>
                    ) : (
                        ""
                    )}
                </div>

                {os === "darwin" && browser !== Browsers.SAFARI ? (
                    <p>
                        <span className="font-bold">Note:</span> While these screenshots
                        were taken on Windows, the process should be the same on macOS.
                    </p>
                ) : (
                    ""
                )}

                <ol className="list-decimal pl-6">
                    <li className="my-2">
                        <p>Log into FurAffinity.</p>
                        <button
                            className="btn btn-outline btn-primary btn-sm after:content-['_↗'] my-2"
                            onClick={() => open("https://www.furaffinity.net")}
                        >
                            Open FurAffinity
                        </button>
                    </li>

                    {browser == Browsers.CHROME ? (
                        <>
                            <li className="my-2">
                                <p>
                                    On any page on FA, right click and select{" "}
                                    <span className="font-bold">Inspect</span> in the
                                    menu that appears. The Web Developer tools should
                                    appear.
                                </p>
                                <img className="my-2" src={imgChromeInspect}></img>
                            </li>
                            <li className="my-2">
                                <p>
                                    Select the{" "}
                                    <span className="font-bold">Application</span> tab,
                                    and in the sidebar, select{" "}
                                    <span className="font-bold">Cookies</span> →{" "}
                                    <code>https://www.furaffinity.net</code>. The main
                                    pane of the window should have several entries.
                                </p>
                                <img
                                    className="my-2"
                                    src={imgChromeApplicationsView}
                                ></img>
                                <img className="my-2" src={imgChromeCookiesView}></img>
                            </li>
                        </>
                    ) : (
                        ""
                    )}
                    {browser == Browsers.FIREFOX ? (
                        <>
                            <li className="my-2">
                                <p>
                                    On any page on FA, right click and select{" "}
                                    <span className="font-bold">Inspect</span> in the
                                    menu that appears. The Web Developer tools should
                                    appear.
                                </p>
                                <img className="my-2" src={imgFirefoxInspect}></img>
                            </li>
                            <li className="my-2">
                                <p>
                                    Select the{" "}
                                    <span className="font-bold">Network</span> tab. In
                                    the list of entries, look for one with a domain of{" "}
                                    <code>www.furaffinity.net</code> (if no such entry
                                    exists, reload the page). Select that entry, and in
                                    the inspector on the right side, select the{" "}
                                    <span className="font-bold">Cookies</span> tab.
                                </p>
                                <img className="my-2" src={imgFirefoxNetworkTab}></img>
                                <img className="my-2" src={imgFirefoxCookiesView}></img>
                            </li>
                        </>
                    ) : (
                        ""
                    )}
                    {browser == Browsers.SAFARI ? (
                        <>
                            <li className="my-2">
                                <p>
                                    In the <span className="font-bold">Safari</span>{" "}
                                    menu, open Settings.
                                </p>
                                <img className="my-2" src={imgSafariSettings}></img>
                            </li>
                            <li className="my-2">
                                <p>
                                    Under the{" "}
                                    <span className="font-bold">Advanced</span> menu,
                                    make sure that{" "}
                                    <span className="font-bold">
                                        Show Develop menu in menu bar
                                    </span>{" "}
                                    is checked.
                                </p>
                                <img
                                    className="my-2"
                                    src={imgSafariEnableDevTools}
                                ></img>
                            </li>
                            <li className="my-2">
                                <p>
                                    Open the Web Inspector by pressing{" "}
                                    <kbd className="kbd">Cmd</kbd> +{" "}
                                    <kbd className="kbd">Opt</kbd> +{" "}
                                    <kbd className="kbd">I</kbd> or by opening{" "}
                                    <span className="font-bold">Develop</span> →{" "}
                                    <span className="font-bold">
                                        Show Web Inspector
                                    </span>
                                </p>
                                <img
                                    className="my-2"
                                    src={imgSafariOpenWebInspector}
                                ></img>
                            </li>
                            <li className="my-2">
                                <p>
                                    Open the Network tab, and select an item in the list
                                    where the domain is listed as{" "}
                                    <code>furaffinity.net</code>. Select the{" "}
                                    <span className="font-bold">Cookies</span> tab.
                                </p>
                                <img
                                    className="my-2"
                                    src={imgSafariOpenNetworkTab}
                                ></img>
                                <img
                                    className="my-2"
                                    src={imgSafariSelectRequest}
                                ></img>
                            </li>
                            <li className="my-2">
                                <p>Reload the page to show all of the cookies.</p>
                                <img className="my-2" src={imgSafariCookiesView}></img>
                            </li>
                        </>
                    ) : (
                        ""
                    )}

                    <li className="my-2">
                        Double click the <code>a</code> and <code>b</code> values, then
                        copy each and paste them into the corresponding text boxes in
                        this application.
                    </li>
                    <li className="my-2">
                        Click <span className="font-bold">Log In</span> to log into the
                        account.
                    </li>
                    <li className="my-2">
                        In a private browsing window or another browser, repeat these
                        steps with the other account.
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default InstructionsComponent;
