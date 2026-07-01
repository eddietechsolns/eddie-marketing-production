import type { Metadata } from "next";
import Link from "next/link";
import UserForm from "@/components/admin/forms/UserForm";

export const metadata: Metadata = { title: "Add User" };

export default function NewUserPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/users"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Add New User</h1>
      </div>
      <UserForm />
    </div>
  );
}
