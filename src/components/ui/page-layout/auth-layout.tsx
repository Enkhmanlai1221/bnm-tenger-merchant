import clsx from "clsx";
import AuthLayout from "../auth-layout/auth-layout";

export function AuthPageLayout({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <AuthLayout>
      <div
        className={clsx("h-full flex flex-col justify-between", className)}
        {...props}
      />
    </AuthLayout>
  );
}
