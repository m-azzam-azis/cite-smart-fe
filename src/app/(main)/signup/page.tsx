import { signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">Create a new account</p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="user@domain.com"
            />
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
            <label
              htmlFor="password-confirmation"
              className="block text-sm font-medium text-gray-700"
            >
              Password confirmation
            </label>
            <Input
              id="password-confirm"
              name="password-confirm"
              type="password"
              minLength={6}
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
          <Button
            className="w-full text-white font-semibold py-2 px-4 rounded-md transition-all"
            formAction={signup}
            variant={"default"}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
