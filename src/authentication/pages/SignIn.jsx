import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../api_service/auth/auth";
import { 
  FiMail, 
  FiLock, 
  FiArrowRight, 
  FiShield, 
  FiActivity, 
  FiHeadphones,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import { MdOutlineHealthAndSafety } from "react-icons/md";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="h-screen bg-gradient-to-br from-blue-50 to-white flex">
      {/* Left Side - Branding */}
      <div className="flex-1 flex items-center justify-center p-12 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <MdOutlineHealthAndSafety className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome Back to
            <br />
            <span className="text-blue-100">ASF System</span>
          </h1>
          
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Access your dashboard and manage animal health reports efficiently
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center text-blue-100">
              <FiShield className="w-4 h-4 mr-3" />
              <span className="text-sm">Secure login process</span>
            </div>
            <div className="flex items-center text-blue-100">
              <FiActivity className="w-4 h-4 mr-3" />
              <span className="text-sm">Real-time dashboard</span>
            </div>
            <div className="flex items-center text-blue-100">
              <FiHeadphones className="w-4 h-4 mr-3" />
              <span className="text-sm">24/7 support available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-8">
              <div className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <MdOutlineHealthAndSafety className="w-6 h-6" />
                ASF System
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Welcome Back 👋
            </h2>
            <div className="w-12 h-1 bg-blue-600 mb-8"></div>
            <p className="text-blue-600 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white border-2 border-blue-200 rounded-lg text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center text-base ${
                isLoading 
                  ? "bg-blue-300 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-blue-100">
            <p className="text-center text-sm text-blue-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-800 hover:text-blue-900 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-blue-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        theme="light"
        toastStyle={{
          backgroundColor: '#ffffff',
          color: '#1e40af',
          border: '1px solid #dbeafe'
        }}
      />
    </div>
  );
}