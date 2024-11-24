import axios from 'axios';


export const forgotPassword = async (email, role) => {
  try {
    const response = await axios.post('http://localhost:4000/api/login/forgetPassword', { email, role });
    return response.data; // Contains the success message
  } catch (error) {
    console.error("Error in forgotPassword:", error.response?.data || error.message);
    throw error.response?.data || { message: "An error occurred." };
  }
};

export const verifyOTP = async (email, role, otp) => {
    try {
      const response = await axios.post('http://localhost:4000/api/login/verifyOTP', { email, role, otp });
      return response.data; // Contains the success message
    } catch (error) {
      console.error("Error in verifyOTP:", error.response?.data || error.message);
      throw error.response?.data || { message: "An error occurred." };
    }
  };

  export const resetPassword = async (email, role, newPassword) => {
    try {
      const response = await axios.post('http://localhost:4000/api/login/resetPassword', { email, role, newPassword });
      return response.data; // Contains the success message
    } catch (error) {
      console.error("Error in resetPassword:", error.response?.data || error.message);
      throw error.response?.data || { message: "An error occurred." };
    }
  };
  