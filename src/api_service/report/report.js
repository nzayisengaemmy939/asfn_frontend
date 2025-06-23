import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const registerReport = async (formData, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  try {
    setIsLoading(true);

    await axios.post(`${frontend}/report/register`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    toast.success("Report submitted successfully!");
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

export const getReport = async (setData, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found.");
    return;
  }

  try {
    setIsLoading(true);
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    const response = await axios.get(`${frontend}/report/${userId}`);
    setData(response.data);
    console.log(response.data, "data to know");
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    setIsLoading(false);
  }
};

export const getReports = async (setReports, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found.");
    return;
  }

  try {
    setIsLoading(true);

    const response = await axios.get(`${frontend}/report/all`);
    setReports(response.data);
    console.log(response.data, "report data");
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    setIsLoading(false);
  }
};

//delete report

export const deleteReport = async (reportId, setIsLoading) => {
  try {
    setIsLoading(true);
    const frontend = import.meta.env.VITE_BACKEND_URL;

    const response = await axios.delete(
      `${frontend}/report/delete/${reportId}`
    );

    if (response.status === 200) {
      setIsLoading(false);
      toast.success("report deleted successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to delete report");
    }
  } catch (error) {
    setIsLoading(false);
    console.error("Error deleting report", error);
  }
};

//update report
export const updateReport = async (reportId, updatedData, setIsLoading) => {
  try {
    setIsLoading(true);
    const frontend = import.meta.env.VITE_BACKEND_URL;
    console.log("report ID:", reportId);
    const response = await axios.put(
      `${frontend}/report/edit/${reportId}`,
      updatedData
    );

    if (response.status === 200) {
      setIsLoading(false);
      toast.success("report updated successfully");
      return true;
    } else {
      setIsLoading(false);
      toast.success("Error in updating report");

      return false;
    }
  } catch (error) {
    setIsLoading(false);
    toast.error("error in editing report");
    console.error("Error updating transaction:", error);
    return false;
  }
};

export const assignReportToVet = async (reportId, email, setIsLoading) => {
  try {
    setIsLoading(true);
    const frontend = import.meta.env.VITE_BACKEND_URL;
    console.log("Assigning report with ID:", reportId);

    const response = await axios.put(`${frontend}/report/assign/${reportId}`, {
      vetEmail: email,
    });

    if (response.status === 200) {
      toast.success("Report assigned to veterinarian successfully.");
      return true;
    } else {
      toast.error("Failed to assign report.");
      return false;
    }
  } catch (error) {
    toast.error("An error occurred while assigning the report.");
    console.error("Assignment error:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const vetReport = async (setAssigned, setIsLoading) => {
  const frontend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found.");
    return;
  }

  try {
    setIsLoading(true);

    const decoded = jwtDecode(token);
    const email = decoded.email;

    if (!email) {
      console.error("Email not found in token.");
      return;
    }

    const response = await axios.get(`${frontend}/report/get/assign/${email}`);
    setAssigned(response.data);
    console.log(response.data, "data to know");
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    setIsLoading(false);
  }
};



export const sendReply = async (reportId, message, senderRole, token) => {
  try {
  const frontend = import.meta.env.VITE_BACKEND_URL;
console.log('token',token)
    const response = await axios.post(
      `${frontend}/report/reply/${reportId}`,
      {
        message,
        senderRole,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    toast.success('Reply successfully')
    return response.data;
  } catch (error) {
    console.error("Failed to send reply:", error);
    toast.error(error.response?.data || { message: "An error occurred" })
  }
};

export const updateReportStatus = async (reportId, status, setIsLoading) => {
  const validStatuses = ["pending", "received", "resolved"];
  if (!validStatuses.includes(status)) {
    toast.error("Invalid status. Must be one of: pending, received, resolved");
    return false;
  }

  setIsLoading(true);
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.put(`${backendUrl}/report/status/${reportId}`, { status });

    if (response.status === 200) {
      toast.success(`Report status updated to ${status} successfully`);
      return true;
    } else {
      toast.error("Failed to update report status");
      return false;
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "An error occurred while updating status");
    console.error("Error updating report status:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
}