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
    accounts: AccountsSchema;
    setAccounts: StateUpdater<AccountsSchema>;
});

export interface AccountsSchema {
    source: AccountSchema;
    target: AccountSchema;
}

export interface AccountSchema {
    a?: string;
    b?: string;
    isLoggedIn: boolean;
    name?: string;
    avatarUrl?: string;
}