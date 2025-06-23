import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../api_service/auth/auth";
import { WiMoonAltWaningCrescent1 } from "react-icons/wi";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    await loginUser(payload, navigate, setIsLoading);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 flex">
      {/* Left Side - Branding */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome Back to
            <br />
            <span className="text-cyan-400">ASF System</span>
          </h1>
          
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Access your user dashboard and manage your business
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              <span className="text-sm">Secure login process</span>
            </div>
            <div className="flex items-center text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              <span className="text-sm">Real-time dashboard</span>
            </div>
            <div className="flex items-center text-slate-300">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              <span className="text-sm">24/7 support available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-8">
              <div className="text-lg font-semibold text-white">ASF</div>
              {/* <div className="flex gap-1 items-center">
                <WiMoonAltWaningCrescent1 color="white" size={20} />
                <button className="text-slate-400 hover:text-white font-semibold text-sm">
                  theme
                </button>
              </div> */}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back 👋
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mb-8"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-3 w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
              <label className="block text-sm text-slate-400 mt-1 ml-1">Email Address</label>
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-3 w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-400 rounded"></div>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
              />
              <label className="block text-sm text-slate-400 mt-1 ml-1">Password</label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center text-base ${
                isLoading 
                  ? "bg-slate-600 cursor-not-allowed" 
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Create one
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        theme="dark"
        toastStyle={{
          backgroundColor: '#1e293b',
          color: '#f8fafc'
        }}
      />
    </div>
  );
}