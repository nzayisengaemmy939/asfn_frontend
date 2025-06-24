import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const registerUser = async (
  formData,
  navigate,

  setIsLoading
) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);
    await axios.post(`${frontend}/auth/register`, formData);

    toast.success("Signup successful!");

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};

export const loginUser = async (formData, navigate, setIsLoading) => {
  setIsLoading(true);

  try {
    const frontend = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${frontend}/auth/login`, formData);
    localStorage.setItem("token", response.data.token);
    console.log(response.data);

    toast.success("Login successful!");
    const token = localStorage.getItem("token");
    let decoded = jwtDecode(token);
    setTimeout(() => {
      if (decoded.role == "farmer") {
        navigate("/dashboard");
      }
      if (decoded.role == "authority") {
         navigate("/authority-dashboard");
      }
      if (decoded.role == "veterinarian") {
        navigate("/veteri-dashboard");
      }

      console.log("Navigating to dashboard");
    }, 1000);
  } catch (error) {
    console.error("Error submitting form:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An unexpected error occurred.");
    }
  } finally {
    setIsLoading(false);
  }
};

// export const resetPassword = async (formData, setIsLoading) => {
//   const frontend = import.meta.env.VITE_BACKEND_URL;

//   setIsLoading(true);

//   try {
//     const frontend = import.meta.env.VITE_BACKEND_URL;
//     const id = localStorage.getItem("id");
//     const response = await axios.post(`${frontend}/auth/send/email`, formData);
//     toast.success("Reset email sent!");
//   } catch (error) {
//     console.error("Error submitting form:", error);

//     if (axios.isAxiosError(error)) {
//       const errorMessage =
//         error.response?.data?.message || "An error occurred. Please try again.";
//       toast.error(errorMessage);
//     } else if (error instanceof Error) {
//       toast.error(error.message);
//     } else {
//       toast.error("An unexpected error occurred.");
//     }
//   } finally {
//     setIsLoading(false);
//   }
// };

export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const getProfile = async (setProfile, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  try {
    setIsLoading(true);
    if (!token) {
      console.error("No token found");
      return;
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Token decode failed", err);
      return;
    }

    const userId = decoded.userId;

    const response = await axios.get(`${frontend}/auth/get/profile/${userId}`);

    setProfile(response.data.data);
  } catch (err) {
    console.error("Error fetching user data:", err);
  } finally {
    setIsLoading(false);
  }
};

export const getUsers = async (setData, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);

    const response = await axios.get(`${frontend}/auth/get/all`);

    setData(response.data.data);
    setIsLoading(false)
    console.log(response.data, "all users");
  } catch (err) {
    console.error("Error in getting all users:", err);
  }
};



export const deleteUser = async (userId, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;

  try {
    setIsLoading(true);

    const response = await axios.delete(`${frontend}/auth/delete/${userId}`);

    toast.success("User deleted successfully! ✅");
    setIsLoading(false);


  } catch (error) {
    toast.error("Failed to delete user ❌");
    setIsLoading(false);

    
  }
};
export const updateProfile = async (userId, userData, setIsLoading) => {
  try {
    setIsLoading(true);
    console.log(userData,'data to update')
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const response = await axios.put(
      `${backendUrl}/auth/update/profile/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Profile updated successfully! ✅");
    return response.data;
  } catch (error) {
    toast.error("Failed to update profile ❌");
    console.error("Error updating profile:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

// export const updatePassword = async (passData, setIsLoading) => {
//   try {
//     setIsLoading(true);
//     const frontend = import.meta.env.VITE_BACKEND_URL;
//     const userId = localStorage.getItem("id");
//     const response = await axios.put(
//       `${frontend}/auth/update/password/${userId}`,
//       passData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     setIsLoading(false);
//     return response.data;
//   } catch (error) {
//     setIsLoading(false);
//     console.error("Error updating password:", error);
//     throw error;
//   }
// };

//get user by id

export const getUserById = async (userId, setUser, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/auth/get/profile/${userId}`
    );
    setUser(response.data.data);
    // console.log("User data:", response.data.data); // Check console for data
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};


export function getUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId; // Returns user ID from token
  } catch {
    return null;
  }
}