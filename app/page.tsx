import { auth } from "@/auth";
import { SignInButton } from "@/components/SignInButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="max-w-md w-full space-y-6 p-10 bg-white rounded-lg shadow-md border border-stone-200">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">
            Assignment Tracker
          </h1>
          <p className="text-stone-600 text-sm">
            Stay organized and manage your homework efficiently
          </p>
        </div>

        <div className="pt-4">
          <SignInButton />
        </div>

        <div className="text-center text-xs text-stone-500 pt-2">
          <p>Sign in with your Google account to get started</p>
        </div>
      </div>
    </div>
  );
}
