import axios from "axios";
import { useLoader } from "../context/loader";
import { addToast } from "@heroui/react";
import { getAuthToken } from "./localStorage";

export const useApi = ({
  url,
  method,
  isFormData = false,
  showToast = true,
}: {
  url: string;
  method: string;
  isFormData?: boolean;
  showToast?: boolean;
}) => {
  const { setIsLoading } = useLoader();

  const callApi = async (data?: any) => {
    setIsLoading(true);
    try {
      if (isFormData) {
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        data = formData;
      }
      const response = await axios.request({
        baseURL: process.env.NEXT_PUBLIC_API_URL!,
        url,
        method,
        data,
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (showToast) {
        addToast({
          title: response.data.message,
        });
      }
      return response.data;
    } catch {
      if (showToast) {
        addToast({
          title: "Something went wrong",
        });
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return callApi;
};
