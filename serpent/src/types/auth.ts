export type Session = {
    token: string;
    uid: string | null;
    last_seen: number;
};

export type User = {
    uid: string;
    username: string;
    admin: boolean | "forced";
    alert_email: string;
    alerts: boolean;
};
