import { axiosInstance } from "../../../utils/axios";

export const handleError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      message:
        error.response.data.message ||
        "Something went wrong. Please try again.",
    };
  }
  return {
    status: 500,
    message: error.message || "Unexpected error occurred. Please try again.",
  };
};

const addNewJounal = async (jounalData) => {
  try {
    const response = await axiosInstance.post("/v1/jounal/", jounalData);
    return response;

  } catch (error) {
    return handleError(error);
  }
};
const editJounal = async (id,jounalData) => {
    try {
      const response = await axiosInstance.put(`/v1/jounal/${id}`, jounalData);
      return response;
  
    } catch (error) {
      return handleError(error);
    }
  };
  const deletejounal = async (id) => {
    try {
      const response = await axiosInstance.delete(`/v1/jounal/${id}`);
      return response;
  
    } catch (error) {
      return handleError(error);
    }
  };
const getMyJounal = async () => {
    try {
      const response = await axiosInstance.get("/v1/jounal/my");
      return response;
  
    } catch (error) {
      return handleError(error);
    }
  };
  const getPublicJounals = async () => {
    try {
      const response = await axiosInstance.get("/v1/jounal/public");
      return response;
  
    } catch (error) {
      return handleError(error);
    }
  };
  


const JounalService = {
    addNewJounal,getMyJounal,getPublicJounals,editJounal,deletejounal
};

export default JounalService;
