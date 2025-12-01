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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Assignment Tracker
          </h1>
          <p className="text-gray-600 mb-8">
            Stay organized and manage your homework efficiently
          </p>
        </div>

        <div className="space-y-4">
          <SignInButton />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Sign in with your Google account to get started</p>
        </div>
      </div>
    </div>
  );
}
