export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { SignJWT, importPKCS8, decodeJwt } from "jose";
import fs from "fs";

const getClientSecret = async () => {
  const privateKeyPath = `${process.cwd()}/AuthKey_WFX575VD73.p8`;
  const privateKeyPem = fs.readFileSync(privateKeyPath, "utf8");
  const privateKey = await importPKCS8(privateKeyPem, "ES256");

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_KEY_ID })
    .setIssuedAt()
    .setIssuer(process.env.APPLE_ISSUER!)
    .setAudience("https://appleid.apple.com")
    .setSubject(process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!)
    .setExpirationTime("180d")
    .sign(privateKey);

  return token;
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);
  const code = params.get("code");
  const user = params.get("user");
  const userJson = user ? JSON.parse(user) : null;
  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing." },
      { status: 400 },
    );
  }

  try {
    const clientSecret = await getClientSecret();
    // Exchange the authorization code for tokens
    const response = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || "",
      }),
    });

    const resToken = await response.json();

    // user: {"name":{"firstName":"Bilegsaikhan","lastName":"Erdenebaatar"},"email":"bilegsaikhan.e@gmail.com"}
    const { id_token } = resToken;
    const { firstName, lastName } = userJson ? userJson.name : {};

    // extract email from id_token
    const decodedToken: any = decodeJwt(id_token);
    const is_private_email = decodedToken?.is_private_email;

    if (is_private_email && !userJson) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/register-failed`,
        302,
      );
    }

    const requestBody = JSON.stringify({
      idToken: id_token,
      firstName,
      lastName,
    });
    // Process the id_token as needed, e.g., verify it, fetch user info, etc.

    // request to access token local server /app/auth/login/apple
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/app/auth/login/apple`,
      {
        method: "POST",
        body: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();
    const { accessToken, sessionScope } = data;

    if (sessionScope === "AUTHORIZED" && accessToken) {
      // Redirect to /auth-token with the access token as a query parameter
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/auth-token?token=${accessToken}`,
        302,
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/register-failed`,
        302,
      );
    }
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}/register-failed`,
      302,
    );
  }
}
