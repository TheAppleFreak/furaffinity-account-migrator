import { useState, useEffect } from "preact/hooks";
import classNames from "classnames";

import { AccountContext } from "./context/accounts";

import LoginComponent from "./login";

import type { AccountsSchema } from "./context/accounts";

const App = () => {
    enum Tabs {
        LOGIN = 1,
        SELECT = 2,
        CONFIRM = 3
    }

    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.LOGIN);
    const [latestAvailableTab, setLatestAvailableTab] = useState<Tabs>(Tabs.LOGIN);
    const [accounts, setAccounts] = useState({
        source: { isLoggedIn: false },
        target: { isLoggedIn: false }
    } as AccountsSchema);

    useEffect(() => {
        if (accounts.source.isLoggedIn && accounts.target.isLoggedIn) {
            setLatestAvailableTab(Tabs.SELECT);
        } else {
            setLatestAvailableTab(Tabs.LOGIN);
        }
    }, [accounts.source.isLoggedIn, accounts.target.isLoggedIn]);

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
                <nav className="tabs tabs-boxed justify-center absolute bottom-0 w-full bg-base-300">
                    <a
                        className={classNames("tab", {
                            "tab-active": activeTab === Tabs.LOGIN
                        })}
                        onClick={() => attemptSwitchToTab(Tabs.LOGIN)}
                    >
                        Login to FurAffinity
                    </a>
                    <a
                        className={classNames(
                            "tab",
                            { "tab-active": activeTab === Tabs.SELECT },
                            { "tab-disabled": latestAvailableTab < Tabs.SELECT }
                        )}
                        onClick={() => attemptSwitchToTab(Tabs.SELECT)}
                    >
                        Select items to migrate
                    </a>
                    <a
                        className={classNames(
                            "tab",
                            { "tab-active": activeTab === Tabs.CONFIRM },
                            { "tab-disabled": latestAvailableTab < Tabs.CONFIRM }
                        )}
                        onClick={() => attemptSwitchToTab(Tabs.CONFIRM)}
                    >
                        Confirm
                    </a>
                </nav>
            </div>
        </>
    );
};

export default App;
