import { Component } from "preact";
// import { invoke } from "@tauri-apps/api/tauri";

import { IoMdArrowRoundForward } from "react-icons/io";

class App extends Component {
    render() {
        return (
            <div className="h-screen pb-10">
                <nav className="tabs tabs-boxed justify-center absolute bottom-0 w-full">
                    <a className="tab tab-active">Login to FurAffinity</a> 
                    <a className="tab tab-disabled">Select items to migrate</a> 
                    <a className="tab tab-disabled">Confirm</a>
                </nav>
                <main className="h-full p-4">
                    <div className="flex h-full flex-col align-middle items-center">
                        <div className="flex h-full justify-center items-center gap-16">
                            <div className="flex flex-col w-60 h-80 bg-base-200 rounded-2xl items-center justify-center align-middle">
                                <h1 className="font-bold text-lg">Source account</h1>
                                <div className="avatar placeholder my-6">
                                    <div className="w-32 rounded-full bg-neutral-focus text-neutral-content">
                                        <span className="text-3xl">...</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary rounded-sm">Sign in</button>
                            </div>
                            <IoMdArrowRoundForward size="5em" />
                            <div className="flex flex-col w-60 h-80 bg-base-200 rounded-2xl items-center justify-center align-middle">
                                <h1 className="font-bold text-lg">Target account</h1>
                                <div className="avatar placeholder my-6">
                                    <div className="w-32 rounded-full bg-neutral-focus text-neutral-content">
                                        <span className="text-3xl">...</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary rounded-sm">Sign in</button>
                            </div>
                        </div>
                        <div className="mb-8 flex items-center justify-center">
                            <button className="btn btn-disabled">Next step</button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
