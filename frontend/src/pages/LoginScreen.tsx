import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/context/AuthContext';
import {PageWrapper} from '../components/PageWrapper';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import logoImage from '@/assets/Logo.png';
import {APP_ROUTES} from '@/helpers/constants';
import type {APIError} from '@/interfaces/apiErrorsInterfaces.ts';
import {useForm} from "react-hook-form";
import {FullScreenLoader} from "@/components/FullScreenLoader.tsx";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const {loginUser, isLoading: isAuthContextLoading, isAuthenticated} = useAuth();
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {register, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthContextLoading && isAuthenticated) {
      navigate(APP_ROUTES.PROJECTS, {replace: true});
    }
  }, [isAuthenticated, isAuthContextLoading, navigate]);

  const handleFormSubmit = async ({email, password}: LoginFormData) => {
    setIsSubmitting(true);
    setFormSubmitError(null);
    try {
      await loginUser({email, password});
    } catch (err) {
      const apiError = err as APIError;
      console.error('Login failed on screen:', apiError);
      let errorMessage = apiError.message || 'Login failed. Please try again.';
      if (apiError.statusCode === 401) {
        errorMessage = "Invalid email or password.";
      }
      setFormSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthContextLoading || (!isMounted && isAuthenticated)) {
    return <FullScreenLoader/>;
  }

  return (
    <PageWrapper
      className="flex flex-col justify-center items-center p-4"
      omitFooter={true}
    >
      <div
        className={`w-full max-w-sm mx-auto transition-opacity duration-700 ease-out ${
          isMounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex flex-col items-center m-12">
          <img src={logoImage} alt="ConstruView Logo" className="w-28 h-28" />
          <h1 className="mt-5 text-4xl font-extrabold tracking-tighter">
            <span className="text-cyan-400">Constru</span>
            <span className="text-white">VIEW</span>
          </h1>
        </div>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8 mt-10">
          {formSubmitError && (
            <p className="text-sm text-red-400 text-center bg-red-900 bg-opacity-30 p-2 rounded-md">
              {formSubmitError}
            </p>
          )}
          <div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="Email"
              className="h-9 w-full min-w-0 bg-transparent px-1 py-2 text-white placeholder:text-white border-0 border-b border-slate-300 rounded-none text-base md:text-sm outline-none focus:ring-0 focus:border-white transition-colors duration-150 ease-in-out disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              placeholder="Password"
              className="h-9 w-full min-w-0 bg-transparent px-1 py-2 text-white placeholder:text-white border-0 border-b border-slate-300 rounded-none text-base md:text-sm outline-none focus:ring-0 focus:border-white transition-colors duration-150 ease-in-out disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gray-100 text-sky-800 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-800 focus:ring-gray-400 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:scale-[1.02] hover:brightness-95 active:scale-[0.98] active:brightness-90 disabled:opacity-75 disabled:cursor-not-allowed"
            disabled={isSubmitting || isAuthContextLoading}
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <footer className="py-8 text-center text-sm text-white">
          www.construview.ai
        </footer>
      </div>
    </PageWrapper>
  );
};
