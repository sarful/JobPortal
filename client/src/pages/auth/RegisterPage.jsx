import { UserPlus } from "lucide-react";
import RegisterForm from "../../components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white">
            <UserPlus size={27} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-950">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Register as a candidate or employer to access JobPortal.
          </p>
        </div>

        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}