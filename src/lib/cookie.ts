import { cookies } from "next/headers";

export const setCookieToken = async (value: string) => {
  const cookie = await cookies();
  cookie.set("sb:token", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
