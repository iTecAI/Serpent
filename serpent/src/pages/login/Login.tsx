import { useNavigate } from "react-router-dom";
import { useAccount } from "../../utils/account";
import { useEffect } from "react";
import {
    Button,
    Group,
    Paper,
    PasswordInput,
    Stack,
    TextInput,
    Title,
} from "@mantine/core";
import "./style.scss";
import {
    MdAccountCircle,
    MdCheck,
    MdCheckCircle,
    MdError,
    MdLogin,
    MdPassword,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

export function LoginPage() {
    const { user, login } = useAccount();
    const nav = useNavigate();
    const form = useForm({
        initialValues: {
            username: "",
            password: "",
        },
        validate: {
            username: (value) =>
                value.length > 0 ? null : "Username is required.",
            password: (value) =>
                value.length > 0 ? null : "Password is required.",
        },
    });

    useEffect(() => {
        if (user) {
            nav("/");
        }
    }, [user]);

    return (
        <Paper p="md" shadow="md" className="login-panel">
            <Stack spacing="md">
                <Group position="apart" spacing="md">
                    <MdLogin size={24} />
                    <Title order={3} fw={400}>
                        Log In
                    </Title>
                </Group>
                <form
                    onSubmit={form.onSubmit((values) =>
                        login(values.username, values.password).then((result) =>
                            result
                                ? notifications.show({
                                      title: "Success!",
                                      color: "green",
                                      icon: <MdCheckCircle />,
                                      message: `Logged into ${result.username}`,
                                  })
                                : notifications.show({
                                      title: "Failure.",
                                      color: "red",
                                      icon: <MdError />,
                                      message: "Incorrect username or password",
                                  })
                        )
                    )}
                >
                    <Stack spacing="md">
                        <TextInput
                            withAsterisk
                            icon={<MdAccountCircle />}
                            label="Username"
                            {...form.getInputProps("username")}
                        />
                        <PasswordInput
                            withAsterisk
                            icon={<MdPassword />}
                            label="Password"
                            visibilityToggleIcon={({ reveal, size }) =>
                                reveal ? (
                                    <MdVisibilityOff size={size} />
                                ) : (
                                    <MdVisibility size={size} />
                                )
                            }
                            {...form.getInputProps("password")}
                        />
                        <Group position="right">
                            <Button
                                leftIcon={<MdCheck size={20} />}
                                type="submit"
                            >
                                Log In
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Paper>
    );
}
