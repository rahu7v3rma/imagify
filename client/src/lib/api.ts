import axios from "axios";
import { getAccessToken } from "@/utils/cookies";
import { endpoints } from "@/constants/api";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

export const signup = async (data: {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}) => {
  const response = await api.post(endpoints.signup, data);
  return response.data;
};
