import axios from "axios";
import { ENDPOINTS } from "@/constants/api";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer <token>`,
  },
});

export const signup = async (data: {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}) => {
  const response = await api.post(ENDPOINTS.signup, data);
  return response.data;
};
