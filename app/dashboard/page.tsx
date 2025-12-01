import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // If not logged in, redirect to home
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your assignment tracker dashboard
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Assignments</h2>
        <p className="text-gray-500">
          No assignments yet. Start by creating a task list!
        </p>
      </div>
    </div>
  );
}
