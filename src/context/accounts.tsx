import { createContext } from "preact";
import type { StateUpdater } from "preact/hooks";

export const AccountContext = createContext({
    accounts: {
        source: {
            a: undefined,
            b: undefined,
            isLoggedIn: false,
            name: undefined,
            avatarUrl: undefined
        },
        target: {
            a: undefined,
            b: undefined,
            isLoggedIn: false,
            name: undefined,
            avatarUrl: undefined
        }
    },
    setAccounts: undefined!
} as {
    accounts: AccountSchema;
    setAccounts: StateUpdater<AccountSchema>;
});

export interface AccountSchema {
    source: {
        a?: string;
        b?: string;
        isLoggedIn: boolean;
        name?: string;
        avatarUrl?: string;
    };
    target: {
        a?: string;
        b?: string;
        isLoggedIn: boolean;
        name?: string;
        avatarUrl?: string;
    };
}
