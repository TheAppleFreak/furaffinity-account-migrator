import { useState, useEffect } from "preact/hooks";
import classNames from "classnames";

import { AccountContext } from "./context/accounts";

import LoginComponent from "./login";

import type { AccountSchema } from "./context/accounts";

const App = () => {
    const tabs = {
        LOGIN: 1,
        SELECT: 2,
        CONFIRM: 3
    } as const;

    const [activeTab, setActiveTab] = useState(tabs.LOGIN as number);
    const [latestAvailableTab, setLatestAvailableTab] = useState(tabs.LOGIN as number);
    const [accounts, setAccounts] = useState({
        source: { isLoggedIn: false },
        target: { isLoggedIn: false }
    } as AccountSchema);

    useEffect(() => {
        if (accounts.source.isLoggedIn && accounts.target.isLoggedIn) {
            setLatestAvailableTab(tabs.SELECT);
        } else {
            setLatestAvailableTab(tabs.LOGIN);
        }
    }, [accounts.source.isLoggedIn, accounts.target.isLoggedIn])

    const attemptSwitchToTab = (requestedTab: number) => {
        if (requestedTab === activeTab || requestedTab > latestAvailableTab) return;

        setActiveTab(() => requestedTab);
    };

    return (
        <>
            <div className="h-screen pb-10">
                <AccountContext.Provider value={{ accounts, setAccounts }}>
                    <LoginComponent />
                </AccountContext.Provider>
                <nav className="tabs tabs-boxed justify-center absolute bottom-0 w-full">
                    <a
                        className={classNames("tab", {
                            "tab-active": activeTab === tabs.LOGIN
                        })}
                        onClick={() => attemptSwitchToTab(tabs.LOGIN)}
                    >
                        Login to FurAffinity
                    </a>
                    <a
                        className={classNames(
                            "tab",
                            { "tab-active": activeTab === tabs.SELECT },
                            { "tab-disabled": latestAvailableTab < tabs.SELECT }
                        )}
                        onClick={() => attemptSwitchToTab(tabs.SELECT)}
                    >
                        Select items to migrate
                    </a>
                    <a
                        className={classNames(
                            "tab",
                            { "tab-active": activeTab === tabs.CONFIRM },
                            { "tab-disabled": latestAvailableTab < tabs.CONFIRM }
                        )}
                        onClick={() => attemptSwitchToTab(tabs.CONFIRM)}
                    >
                        Confirm
                    </a>
                </nav>
            </div>
        </>
    );
};

export default App;
