import { ReactNode, useEffect, useState } from "react";
import { Session, User } from "../../types/auth";
import { useApi } from "../api/api";
import { AccountContext } from "./account";

export function AccountProvider({
    children,
}: {
    children?: ReactNode | ReactNode[];
}) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null | "loading">("loading");
    const { get, post } = useApi();

    async function updateSession(): Promise<Session | null> {
        const newSession = await get<Session>("/auth/session");
        if (newSession.success) {
            setSession(newSession.value);
            return newSession.value;
        } else {
            setSession(null);
            return null;
        }
    }

    useEffect(() => {
        updateSession();
    }, []);

    useEffect(() => {
        if (session?.uid) {
            get<User>("/auth").then(
                (result) => result.success && setUser(result.value)
            );
        } else {
            setUser(null);
        }
    }, [session?.uid]);

    return (
        <AccountContext.Provider
            value={{
                user,
                login: async (username: string, password: string) => {
                    const loginResult = await post<User>("/auth/login", {
                        data: {
                            username,
                            password,
                        },
                    });
                    if (loginResult.success) {
                        setUser(loginResult.value);
                        return loginResult.value;
                    }
                    return null;
                },
                logout: async () => {
                    await post<null>("/auth/logout");
                    setUser(null);
                },
            }}
        >
            {children}
        </AccountContext.Provider>
    );
}
