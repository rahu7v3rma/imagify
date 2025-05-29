import axios from "axios";
import { API_DOMAIN } from "../../utils/env";
import gmail from "../../lib/gmail";

test("GET /status should return success response", async () => {
  const response = await axios.get(`${API_DOMAIN}/status`);

  expect(response.status).toBe(200);
  expect(response.data).toEqual({
    success: true,
    message: "socialify status",
    data: null,
  });
});

test("GET /nonexistent should return 404 response", async () => {
  try {
    await axios.get(`${API_DOMAIN}/nonexistent`);
  } catch (error) {
    expect(error.response.status).toBe(404);
    expect(error.response.data).toEqual({
      success: false,
      message: "route not found",
      data: null,
    });
  }
});

test("GET /error should return 500 response", async () => {
  try {
    await axios.get(`${API_DOMAIN}/error`);
  } catch (error) {
    expect(error.response.status).toBe(500);
    expect(error.response.data).toEqual({
      success: false,
      message: "internal server error",
      data: null,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const email = await gmail.getLatestEmail();
    expect(email.subject).toContain("internal server error");
  }
}, 120000);
