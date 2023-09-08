import { useContext } from "preact/hooks";
import classnames from "classnames";
import { IoMdArrowRoundDown, IoMdArrowForward } from "react-icons/io";

import { AccountContext } from "../context/accounts";

import InstructionsComponent from "./instructions";

const LoginComponent = () => {
    const { accounts, setAccounts } = useContext(AccountContext);

    async function logIntoAccount(): Promise<(typeof accounts)["source"]> {
        return {
            a: "adflkasjd",
            b: "dhfgkjsfh",
            isLoggedIn: true,
            name: Math.random().toString(36).slice(2, 9),
            avatarUrl: "https://placehold.co/100.png"
        };
    }
    const logIntoSourceAccount = async () => {
        if (!accounts.source.isLoggedIn) {
            // Log in
            setAccounts({
                source: await logIntoAccount(),
                target: accounts.target
            });
        } else {
            // Log out
            setAccounts({
                source: {
                    isLoggedIn: false
                },
                target: accounts.target
            });
        }
    };
    const logIntoTargetAccount = async () => {
        if (!accounts.target.isLoggedIn) {
            // Log in
            setAccounts({
                source: accounts.source,
                target: await logIntoAccount()
            });
        } else {
            // Log out
            setAccounts({
                source: accounts.source,
                target: {
                    isLoggedIn: false
                }
            });
        }
    };

    return (
        <div className="w-full h-full flex">
            <InstructionsComponent />
            <div className="w-full h-full flex flex-col align-center items-center justify-center gap-4 relative">
                <div
                    className={classnames(
                        "w-96 bg-base-300 rounded flex align-center items-center justify-center gap-4",
                        { "h-32": accounts.source.isLoggedIn },
                        { "h-56": !accounts.source.isLoggedIn }
                    )}
                >
                    <div className="w-20 h-20">
                        <div
                            className={classnames("avatar", {
                                placeholder: !accounts.source.isLoggedIn
                            })}
                        >
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-20">
                                {accounts.source.isLoggedIn ? (
                                    <img src={accounts.source.avatarUrl!}></img>
                                ) : (
                                    <span className="text-2xl">...</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-64 flex flex-col align-center">
                        <h1 className="text-xl font-bold">Source Account</h1>
                        <p>
                            {accounts.source.isLoggedIn
                                ? accounts.source.name
                                : "Not yet logged in"}
                        </p>
                        {!accounts.source.isLoggedIn ? (
                            <div className="my-4 flex flex-col gap-1">
                                <div className="join flex">
                                    <label className="btn join-item btn-sm no-animation w-10">
                                        a
                                    </label>
                                    <input
                                        className="input input-bordered join-item input-sm w-full"
                                        placeholder="'a' cookie"
                                    />
                                </div>
                                <div className="join flex">
                                    <label className="btn join-item no-animation btn-sm w-10">
                                        b
                                    </label>
                                    <input
                                        className="input input-bordered join-item input-sm w-full"
                                        placeholder="'b' cookie"
                                    />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={logIntoSourceAccount}
                        >
                            {accounts.source.isLoggedIn ? "Log out" : "Log in"}
                        </button>
                    </div>
                </div>
                <IoMdArrowRoundDown size="4em" />
                <div
                    className={classnames(
                        "w-96 bg-base-300 rounded flex align-center items-center justify-center gap-4",
                        { "h-32": accounts.target.isLoggedIn },
                        { "h-56": !accounts.target.isLoggedIn }
                    )}
                >
                    <div className="w-20 h-20">
                        <div
                            className={classnames("avatar", {
                                placeholder: !accounts.target.isLoggedIn
                            })}
                        >
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-20">
                                {accounts.target.isLoggedIn ? (
                                    <img src={accounts.target.avatarUrl!}></img>
                                ) : (
                                    <span className="text-2xl">...</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-64 flex flex-col align-center">
                        <h1 className="text-xl font-bold">Target Account</h1>
                        <p>
                            {accounts.target.isLoggedIn
                                ? accounts.target.name
                                : "Not yet logged in"}
                        </p>
                        {!accounts.target.isLoggedIn ? (
                            <div className="my-4 flex flex-col gap-1">
                                <div className="join flex">
                                    <label className="btn join-item btn-sm no-animation w-10">
                                        a
                                    </label>
                                    <input
                                        className="input input-bordered join-item input-sm w-full"
                                        placeholder="'a' cookie"
                                    />
                                </div>
                                <div className="join flex">
                                    <label className="btn join-item no-animation btn-sm w-10">
                                        b
                                    </label>
                                    <input
                                        className="input input-bordered join-item input-sm w-full"
                                        placeholder="'b' cookie"
                                    />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <button
                            className="btn btn-primary btn-sm mt-2"
                            onClick={logIntoTargetAccount}
                        >
                            {accounts.target.isLoggedIn ? "Log out" : "Log in"}
                        </button>
                    </div>
                </div>
                <div
                    className={classnames(
                        "absolute w-full h-12 bottom-0 bg-base-200 flex align-center items-center justify-center",
                        {
                            hidden: !(
                                accounts.source.isLoggedIn && accounts.target.isLoggedIn
                            )
                        }
                    )}
                >
                    <button className="btn btn-primary btn-sm">
                        Next <IoMdArrowForward />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
