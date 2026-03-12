import { LoginForm } from "@/components/authorize/login-form";
import { AuthPageLayout } from "@/components/ui/page-layout/auth-layout";

export default function Login() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  );
}
