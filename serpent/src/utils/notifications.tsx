import { notifications } from "@mantine/notifications";
import { MdCheckCircle, MdError } from "react-icons/md";

export function notificationSuccess(message: string) {
    notifications.show({
        title: "Success",
        message,
        color: "green",
        icon: <MdCheckCircle />,
    });
}

export function notificationError(message: string) {
    notifications.show({
        title: "Error",
        message,
        color: "red",
        icon: <MdError />,
    });
}
