import { createContext, useContext } from "react";
import { User } from "../../types/auth";

export type AccountContextType = {
    user: User | null | "loading";
    login: (username: string, password: string) => Promise<User | null>;
    logout: () => Promise<void>;
};

export const AccountContext = createContext<AccountContextType>(null as any);

export function useAccount(): AccountContextType {
    return useContext(AccountContext);
}
