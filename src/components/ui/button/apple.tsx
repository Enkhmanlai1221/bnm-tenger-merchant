import { IconBrandApple } from "@tabler/icons-react";
import qs from "qs";
const AppleButton = () => {
  const stringifiedParams = qs.stringify({
    client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    response_type: "code",
    scope: "name email",
    response_mode: "form_post",
    state: "asd", // Generate a random state for security
  });

  const oauthLink = `https://appleid.apple.com/auth/authorize?${stringifiedParams}`;

  return (
    <a
      onClick={() => (window.location.href = oauthLink)}
      className="items-center inline-flex w-full cursor-pointer justify-center space-x-2 rounded-md border border-black bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
    >
      <IconBrandApple />

      <span>{"Sign in with Apple"}</span>
    </a>
  );
};

AppleButton.displayName = "AppleButton";

export default AppleButton;
