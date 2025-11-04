import { env } from "../env";

const domain =
  import.meta.env.MODE === "development"
    ? "test-rejoin.adrianluca.dev"
    : window.location.href;

export const startPasswordlessLogin = async ({
  email,
  mode,
}: {
  email: string;
  mode: "code" | "link";
}) => {
  await fetch(`https://${domain}/passwordless/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      client_id: env.VITE_AUTH0_CLIENT_ID,
      client_secret: env.VITE_AUTH0_CLIENT_SECRET,
      connection: "email",
      send: mode,
      authParams: {
        scope: "openid",
      },
    }),
  });
};

export type PasswordlessMode = Parameters<
  typeof startPasswordlessLogin
>[0]["mode"];

export const verifyPasswordlessCode = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    email,
    client_id: env.VITE_AUTH0_CLIENT_ID,
    connection: "email",
    verification_code: code,
  });

  return fetch(`https://test-rejoin.adrianluca.dev/passwordless/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  });
};
