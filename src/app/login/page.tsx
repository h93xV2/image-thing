import { login } from './actions';
import { Button } from '@components/ui/button'; // Example import, adapt as necessary

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4 p-6 max-w-md mx-auto bg-white shadow-md rounded-lg mt-10">
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-700">
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
        />
      </div>

      <div className="flex gap-2">
        <Button formAction={login} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg">
          Log in
        </Button>
      </div>
    </form>
  );
}