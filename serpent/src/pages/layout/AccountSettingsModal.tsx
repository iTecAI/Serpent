import {
    ActionIcon,
    Button,
    Card,
    Group,
    Modal,
    PasswordInput,
    Stack,
    Switch,
    Text,
    TextInput,
} from "@mantine/core";
import { AccountContextType, useAccount } from "../../utils/account";
import { User } from "../../types/auth";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import {
    MdAccountCircle,
    MdAddAlert,
    MdCheck,
    MdEmail,
    MdPassword,
    MdSave,
} from "react-icons/md";
import { useApi } from "../../utils/api/api";
import {
    notificationError,
    notificationSuccess,
} from "../../utils/notifications";

const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

function UsernameForm({ user, update }: AccountContextType) {
    const resolvedUser = user && user !== "loading" ? user : null;
    const form = useForm({
        initialValues: {
            username: "",
        },
        validate: {
            username: (value) =>
                value.length > 0 ? null : "Enter a username.",
        },
    });
    const { post } = useApi();

    useEffect(() => {
        resolvedUser && form.setFieldValue("username", resolvedUser.username);
    }, [resolvedUser?.username]);
    return (
        <Card withBorder p="md" className="account-form username">
            <Stack spacing="md">
                <Group position="apart">
                    <MdAccountCircle size={24} />
                    <Text fw={600}>Username</Text>
                </Group>
                <form
                    onSubmit={form.onSubmit((values) =>
                        post<User>("/auth/settings/username", {
                            data: { username: values.username },
                        }).then((result) => {
                            if (result.success) {
                                notificationSuccess(
                                    `Changed username to ${result.value.username}`
                                );
                                update(result.value);
                            } else {
                                if (result.code === 405) {
                                    notificationError(
                                        `A user with the username ${values.username} already exists.`
                                    );
                                } else {
                                    notificationError(
                                        `An unknown error occurred: ${result.reason}`
                                    );
                                }
                            }
                        })
                    )}
                >
                    <Stack spacing={"sm"}>
                        <TextInput
                            label="Username"
                            icon={<MdAccountCircle />}
                            placeholder="Maia Arson Crimew"
                            {...form.getInputProps("username")}
                        />
                        <Group position="right">
                            <Button
                                leftIcon={<MdSave size={16} />}
                                type="submit"
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Card>
    );
}

function PasswordForm({ update }: AccountContextType) {
    const form = useForm({
        initialValues: {
            current: "",
            newPassword: "",
            confirmNewPassword: "",
        },
        validate: {
            current: (value) =>
                value.length > 0 ? null : "Current password is required.",
            newPassword: (value, { confirmNewPassword }) =>
                value.length === 0
                    ? "New password cannot be empty"
                    : value === confirmNewPassword
                    ? null
                    : "Passwords must match.",
            confirmNewPassword: (value, { newPassword }) =>
                value.length === 0
                    ? "New password cannot be empty"
                    : value === newPassword
                    ? null
                    : "Passwords must match.",
        },
    });
    const { post } = useApi();

    return (
        <Card withBorder p="md" className="account-form password">
            <Stack spacing="md">
                <Group position="apart">
                    <MdPassword size={24} />
                    <Text fw={600}>Change Password</Text>
                </Group>
                <form
                    onSubmit={form.onSubmit((values) =>
                        post<User>("/auth/settings/password", {
                            data: {
                                currentPassword: values.current,
                                newPassword: values.newPassword,
                            },
                        }).then((result) => {
                            if (result.success) {
                                notificationSuccess("Changed password!");
                                form.reset();
                                update(result.value);
                            } else {
                                if (result.code === 403) {
                                    notificationError("Incorrect password.");
                                } else {
                                    notificationError(
                                        "An unknown error occurred."
                                    );
                                }
                            }
                        })
                    )}
                >
                    <Stack spacing={"sm"}>
                        <PasswordInput
                            withAsterisk
                            label="Current Password"
                            icon={<MdPassword />}
                            {...form.getInputProps("current")}
                        />
                        <Group spacing="sm">
                            <PasswordInput
                                style={{ flexGrow: 1 }}
                                withAsterisk
                                label="New Password"
                                icon={<MdPassword />}
                                {...form.getInputProps("newPassword")}
                            />
                            <PasswordInput
                                style={{ flexGrow: 1 }}
                                withAsterisk
                                label="Confirm New Password"
                                icon={<MdPassword />}
                                {...form.getInputProps("confirmNewPassword")}
                            />
                        </Group>
                        <Group position="right">
                            <Button
                                leftIcon={<MdSave size={16} />}
                                type="submit"
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Card>
    );
}

function AlertsForm({ user, update }: AccountContextType) {
    const resolvedUser = user && user !== "loading" ? user : null;
    const [err, setErr] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [enabled, setEnabled] = useState(false);
    const { post } = useApi();

    useEffect(() => {
        if (resolvedUser) {
            setEmail(resolvedUser.alert_email);
            setEnabled(resolvedUser.alerts);
            setErr(null);
        }
    }, [resolvedUser?.alert_email, resolvedUser?.alerts]);
    return (
        <Card withBorder p="md" className="account-form alerts">
            <Stack spacing="md">
                <Group position="apart">
                    <MdAddAlert size={24} />
                    <Text fw={600}>Download Alerts</Text>
                </Group>
                <TextInput
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={err}
                    label="Alert Email"
                    icon={<MdEmail />}
                    placeholder="yo@ho.ho"
                    rightSection={
                        <ActionIcon
                            onClick={() => {
                                if (enabled && email.length === 0) {
                                    setErr(
                                        "An email must be specified if alerts are enabled."
                                    );
                                    return;
                                }

                                if (
                                    !EMAIL_REGEX.test(email) &&
                                    email.length > 0
                                ) {
                                    setErr("Invalid email.");
                                    return;
                                }

                                setErr(null);

                                post<User>("/auth/settings/alerts", {
                                    data: {
                                        email,
                                        enabled,
                                    },
                                }).then((result) => {
                                    if (result.success) {
                                        notificationSuccess(
                                            result.value.alert_email.length > 0
                                                ? `Set alerting email to ${result.value.alert_email}.`
                                                : "Removed alert email."
                                        );
                                        update(result.value);
                                    } else {
                                        notificationError(
                                            "An unknown error occurred."
                                        );
                                    }
                                });
                            }}
                        >
                            <MdCheck />
                        </ActionIcon>
                    }
                />
                <Group position="apart">
                    <Text>Enable Alerts</Text>
                    <Switch
                        checked={enabled}
                        onChange={(event) => {
                            setEnabled(event.target.checked);
                            post<User>("/auth/settings/alerts", {
                                data: {
                                    email: resolvedUser?.alert_email,
                                    enabled: event.target.checked,
                                },
                            }).then((result) => {
                                if (result.success) {
                                    notificationSuccess(
                                        `${
                                            result.value.alerts
                                                ? "Enabled"
                                                : "Disabled"
                                        } email alerts.`
                                    );
                                    update(result.value);
                                } else {
                                    notificationError(
                                        "An unknown error occurred."
                                    );
                                }
                            });
                        }}
                        disabled={resolvedUser?.alert_email.length === 0}
                    />
                </Group>
            </Stack>
        </Card>
    );
}

export function AccountManagementModal({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) {
    const account = useAccount();
    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            size="lg"
            title="Account Management"
        >
            {account.user && account.user !== "loading" && (
                <Stack spacing={"md"}>
                    <UsernameForm {...account} />
                    <PasswordForm {...account} />
                    <AlertsForm {...account} />
                </Stack>
            )}
        </Modal>
    );
}
