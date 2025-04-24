import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api_service/auth/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { WiMoonAltWaningCrescent1 } from "react-icons/wi";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    await registerUser(payload, navigate, setIsLoading);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-semibold text-blue-700">ASFN</div>
        <div className="flex gap-1 items-center">
          <WiMoonAltWaningCrescent1 color="blue" size={20} />
          <button className="text-blue-600 hover:text-blue-700 font-semibold">
            theme
          </button>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="flex-grow flex items-center justify-center">
        <div className="w-[580px] bg-white rounded-lg border-[1px] border-gray-100 px-8 py-4">
          <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
            Create ASF Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. Emmanuel"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Nzayisenga"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. you@example.com"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 ${
                isLoading ? "bg-blue-100" : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold rounded-lg transition duration-300`}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already registered?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
