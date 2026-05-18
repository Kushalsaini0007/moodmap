import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account — MoodMap AI",
  description: "Join MoodMap AI and start understanding your mind.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="A few details and you can begin journaling with gentle AI support."
    >
      <SignupForm />
    </AuthShell>
  );
}
