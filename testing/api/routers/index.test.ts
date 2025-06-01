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

test("Rate limit: 2 requests per second should get 429", async () => {
  const firstResponse = await axios.get(`${API_DOMAIN}/status`);
  expect(firstResponse.status).toBe(200);

  try {
    await axios.get(`${API_DOMAIN}/status`);
  } catch (error) {
    expect(error.response.status).toBe(429);
    expect(error.response.data).toEqual({
      success: false,
      message: "too many requests",
      data: null,
    });
  }
});

test("Rate limit: 1 request per second should pass", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const firstResponse = await axios.get(`${API_DOMAIN}/status`);
  expect(firstResponse.status).toBe(200);
  expect(firstResponse.data).toEqual({
    success: true,
    message: "socialify status",
    data: null,
  });

  await new Promise((resolve) => setTimeout(resolve, 1100));

  const secondResponse = await axios.get(`${API_DOMAIN}/status`);
  expect(secondResponse.status).toBe(200);
  expect(secondResponse.data).toEqual({
    success: true,
    message: "socialify status",
    data: null,
  });
});

test("POST /status with JSON body over 10kb should return 413", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  
  const largeData = {
    data: "a".repeat(12000)
  };
  
  try {
    await axios.post(`${API_DOMAIN}/status`, largeData);
  } catch (error) {
    expect(error.response.status).toBe(413);
    expect(error.response.data).toEqual({
      success: false,
      message: "request body too large",
      data: null,
    });
  }
});

test("POST /status with text body over 10kb should return 413", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  
  const largeText = "a".repeat(12000);
  
  try {
    await axios.post(`${API_DOMAIN}/status`, largeText, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    expect(error.response.status).toBe(413);
    expect(error.response.data).toEqual({
      success: false,
      message: "request body too large",
      data: null,
    });
  }
});

test("POST /status with JSON body under 10kb should return 200", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1100));
  
  const smallData = {
    data: "a".repeat(5000)
  };
  
  const response = await axios.post(`${API_DOMAIN}/status`, smallData);
  expect(response.status).toBe(200);
  expect(response.data).toEqual({
    success: true,
    message: "socialify status",
    data: null,
  });
});
