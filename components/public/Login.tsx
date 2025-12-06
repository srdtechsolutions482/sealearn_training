import React, { useState } from "react";
import { UserRole } from "../../types";
import { Button, Card, Input } from "../common/UI";
import { MOCK_USERS } from "../../constants";
import { AlertCircle, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { API_CONFIG } from "../../apiconfig";

export const LoginPage = ({ onLogin }: { onLogin: (r: UserRole) => void }) => {
  const [activeTab, setActiveTab] = useState<"seafarer" | "vendor">("seafarer");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // --- Helper for URLs ---
  const getUrl = (endpoint: string) => {
    const base = API_CONFIG.BASE_URL.replace(/\/$/, "");
    const path = endpoint.replace(/^\//, "");
    return `${base}/${path}`;
  };
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Admin Login (Mock)
      if (isAdmin) {
        // Simulate network delay for consistency
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (
          email === MOCK_USERS.admin.email &&
          password === MOCK_USERS.admin.password
        ) {
          onLogin(UserRole.ADMIN);
        } else {
          setError("Invalid admin credentials");
        }
        setIsLoading(false);
        return;
      }

      // 2. Vendor Login (Real API)
      if (activeTab === "vendor") {
        try {
          const url = `${getUrl(API_CONFIG.ENDPOINTS.INSTITUTE_LOGIN)}`;
          const response = await fetch(url, {
            method: "POST",
            headers: API_CONFIG.HEADERSURLCENCODE,
            body: new URLSearchParams({
              username: email,
              password: password,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            // Check for specific API status flags if they exist, otherwise assume HTTP 200 is success
            if (data && data.status === false) {
              setError(
                data.message || "Login failed. Please check your credentials."
              );
            } else {
              // Success - Proceed to Vendor Dashboard
              onLogin(UserRole.VENDOR);
            }
          } else {
            setError(
              data?.message || "Login failed. Please check your credentials."
            );
          }
        } catch (apiError) {
          console.error("Vendor login error:", apiError);
          setError(
            "Unable to connect to the login service. Please try again later."
          );
        }
        setIsLoading(false);
        return;
      }

      // 3. Seafarer Login (Mock)
      if (activeTab === "seafarer") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (
          email === MOCK_USERS.seafarer.email &&
          password === MOCK_USERS.seafarer.password
        ) {
          onLogin(UserRole.SEAFARER);
        } else {
          setError("Invalid seafarer credentials");
        }
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during login.");
      setIsLoading(false);
    }
  };

  const fillCredentials = (roleKey: "admin" | "vendor" | "seafarer") => {
    const user = MOCK_USERS[roleKey];
    setEmail(user.email);
    setPassword(user.password || "");
    setError("");

    if (roleKey === "admin") {
      setIsAdmin(true);
    } else if (roleKey === "vendor") {
      setIsAdmin(false);
      setActiveTab("vendor");
    } else {
      setIsAdmin(false);
      setActiveTab("seafarer");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-start">
        {/* Login Form */}
        <Card className="w-full">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "seafarer" && !isAdmin
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                setActiveTab("seafarer");
                setIsAdmin(false);
                setError("");
              }}
              type="button"
              disabled={isLoading}
            >
              Seafarer
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "vendor" && !isAdmin
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => {
                setActiveTab("vendor");
                setIsAdmin(false);
                setError("");
              }}
              type="button"
              disabled={isLoading}
            >
              Vendor
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm mb-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label={
                activeTab === "vendor" && !isAdmin
                  ? "Username / Email"
                  : "Email Address"
              }
              placeholder={
                activeTab === "vendor" && !isAdmin
                  ? "Enter username"
                  : "you@example.com"
              }
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded text-blue-600 focus:ring-blue-500"
                  checked={isAdmin}
                  onChange={(e) => {
                    setIsAdmin(e.target.checked);
                    setError("");
                  }}
                  disabled={isLoading}
                />
                <span className="text-gray-600">Login as Admin (Demo)</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Verifying...
                </div>
              ) : (
                `Login as ${
                  isAdmin
                    ? "Admin"
                    : activeTab === "seafarer"
                    ? "Seafarer"
                    : "Vendor"
                }`
              )}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials Helper */}
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-600" /> Demo
              Credentials
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Click any user below to autofill the login form.
            </p>

            <div className="space-y-3">
              {/* Seafarer Creds */}
              <div
                onClick={() => !isLoading && fillCredentials("seafarer")}
                className={`bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-all group ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-800">
                    Seafarer User
                  </span>
                  <Copy
                    size={14}
                    className="text-gray-400 group-hover:text-blue-500"
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1 font-mono">
                  <p>
                    Email:{" "}
                    <span className="text-gray-800">
                      {MOCK_USERS.seafarer.email}
                    </span>
                  </p>
                  <p>
                    Pass:{" "}
                    <span className="text-gray-800">
                      {MOCK_USERS.seafarer.password}
                    </span>
                  </p>
                </div>
              </div>

              {/* Vendor Creds */}
              <div
                onClick={() => !isLoading && fillCredentials("vendor")}
                className={`bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-all group ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-800">
                    Vendor (Institution)
                  </span>
                  <Copy
                    size={14}
                    className="text-gray-400 group-hover:text-blue-500"
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1 font-mono">
                  <p>
                    Email:{" "}
                    <span className="text-gray-800">
                      {MOCK_USERS.vendor.email}
                    </span>
                  </p>
                  <p>
                    Pass:{" "}
                    <span className="text-gray-800">
                      {MOCK_USERS.vendor.password}
                    </span>
                  </p>
                </div>
              </div>

              {/* Admin Creds */}
              <div
                onClick={() => !isLoading && fillCredentials("admin")}
                className={`bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-all group ${
                  isLoading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-gray-800">
                    System Admin
                  </span>
                  <Copy
                    size={14}
                    className="text-gray-400 group-hover:text-blue-500"
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1 font-mono">
                  <p>
                    Email:{" "}
                    <span className="text-gray-800">
                      {MOCK_USERS.admin.email}
                    </span>
                  </p>
                  <p>
                    Pass:{" "}
                    <span className="text-gray-800">
                      {MOCK_USERS.admin.password}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
