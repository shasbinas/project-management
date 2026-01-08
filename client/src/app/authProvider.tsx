"use client";

import React, { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setAuth } from "@/state";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const user = useAppSelector((state) => state.global.user);
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ username, password }).unwrap();
      dispatch(setAuth({ user: result.user, token: result.token }));
    } catch (err: any) {
      setError(err.data?.message || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, email, password }).unwrap();
      setIsLoginView(true);
      setError("Registration successful! Please login.");
    } catch (err: any) {
      setError(err.data?.message || "Registration failed");
    }
  };

  if (user) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-dark-bg p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-2xl dark:bg-black">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLoginView ? "Sign in to your account" : "Create new account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLoginView ? "Or " : "Already have an account? "}
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {isLoginView ? "start your 14-day free trial" : "Sign in"}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isLoginView ? handleLogin : handleRegister}>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                type="text"
                required
                className="relative block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {!isLoginView && (
              <div>
                <input
                  type="email"
                  required
                  className="relative block w-full border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            <div>
              <input
                type="password"
                required
                className="relative block w-full rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            </div>

          <div>
            <button
              type="submit"
              disabled={isLoginLoading || isRegisterLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {isLoginView ? "Sign in" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthProvider;
