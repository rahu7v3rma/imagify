import axios from "axios";
import { API_DOMAIN, TEST_EMAIL, TEST_PASSWORD } from "../../utils/env";
import { deleteUsers, getUsers, createUser } from "../../lib/mongodb";
import gmail from "../../lib/gmail";

describe("register routes", () => {
  const url = `${API_DOMAIN}/user/register`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("non-POST methods should fail", async () => {
    let response;
    const methods = ["get", "put", "patch", "delete"];
    for (const method of methods) {
      try {
        response = await axios[method](url);
      } catch (error) {
        response = error.response;
      }
      expect(response.status).not.toBe(200);
    }
  });

  test("POST /register without body should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url);
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
        password: ["Required"],
      },
    });
  });

  test("POST /register with only email - invalid email should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { email: "not-an-email" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Invalid email address"],
        password: ["Required"],
      },
    });
  });

  test("POST /register with only email - valid email should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { email: "socialify@gmail.com" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        password: ["Required"],
      },
    });
  });

  test("POST /register with only password - invalid password should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { password: "123" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
        password: [
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
        ],
      },
    });
  });

  test("POST /register with only password - valid password should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { password: "Socialify1!" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
      },
    });
  });

  test("POST /register with correct email and password", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    const response = await axios.post(url, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "user registered",
      data: null,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    expect(users.length).toBe(1);
    expect(users[0].email).toBe(TEST_EMAIL);
    expect(users[0].password).toBeDefined();
    expect(users[0].emailConfirmed).toBe(false);
    expect(users[0].emailConfirmationCode).toBeDefined();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const latestEmail = await gmail.getLatestEmail();
    expect(latestEmail.subject).toBe("Socialify email confirmation");
    expect(latestEmail.body).toContain(users[0].emailConfirmationCode);
  }, 60000);

  test("POST /register with existing email should return 400 response", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    await createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      emailConfirmationCode: "existing",
      emailConfirmed: false,
    });
    let response;
    try {
      response = await axios.post(url, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "email already exists",
      data: null,
    });
  }, 60000);

  afterEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});

describe("login routes", () => {
  const url = `${API_DOMAIN}/user/login`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("non-POST methods should fail", async () => {
    let response;
    const methods = ["get", "put", "patch", "delete"];
    for (const method of methods) {
      try {
        response = await axios[method](url);
      } catch (error) {
        response = error.response;
      }
      expect(response.status).not.toBe(200);
    }
  });

  test("POST /login without body should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url);
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
        password: ["Required"],
      },
    });
  });

  test("POST /login without email should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { password: TEST_PASSWORD });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
      },
    });
  });

  test("POST /login without password should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { email: TEST_EMAIL });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        password: ["Required"],
      },
    });
  });

  test("POST /login with right email and wrong password should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    let response;
    try {
      response = await axios.post(url, {
        email: TEST_EMAIL,
        password: "WrongPass1!",
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid credentials",
      data: null,
    });
  }, 60000);

  test("POST /login with wrong email and right password should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    let response;
    try {
      response = await axios.post(url, {
        email: "nonexistent@example.com",
        password: TEST_PASSWORD,
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid credentials",
      data: null,
    });
  }, 60000);

  test("POST /login with correct email and password should return 200 and token", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const response = await axios.post(url, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.data.token).toBeDefined();
  }, 60000);

  afterEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});

describe("email confirmation routes", () => {
  const url = `${API_DOMAIN}/user/email/confirm`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("non-POST methods should fail", async () => {
    let response;
    const methods = ["get", "put", "patch", "delete"];
    for (const method of methods) {
      try {
        response = await axios[method](url);
      } catch (error) {
        response = error.response;
      }
      expect(response.status).not.toBe(200);
    }
  });

  test("POST /email/confirm without body should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url);
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
        emailConfirmationCode: ["Required"],
      },
    });
  });

  test("POST /email/confirm without email should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { emailConfirmationCode: "correct" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Required"],
      },
    });
  });

  test("POST /email/confirm without emailConfirmationCode should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, { email: TEST_EMAIL });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        emailConfirmationCode: ["Required"],
      },
    });
  });

  test("POST /email/confirm with wrong email should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const usersBefore = await getUsers({ email: TEST_EMAIL });
    const confirmationCode = usersBefore[0].emailConfirmationCode;
    let response;
    try {
      response = await axios.post(url, {
        email: "socialify@gmail.com",
        emailConfirmationCode: confirmationCode,
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "user not found",
      data: null,
    });
  });

  test("POST /email/confirm with wrong code should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    let response;
    try {
      response = await axios.post(url, {
        email: TEST_EMAIL,
        emailConfirmationCode: "wrong",
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "user not found",
      data: null,
    });
  }, 60000);

  test("POST /email/confirm with correct code should return 200 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const usersBefore = await getUsers({ email: TEST_EMAIL });
    const confirmationCode = usersBefore[0].emailConfirmationCode;
    const response = await axios.post(url, {
      email: TEST_EMAIL,
      emailConfirmationCode: confirmationCode,
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "email confirmed successfully",
      data: null,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    expect(users.length).toBe(1);
    expect(users[0].emailConfirmed).toBe(true);
  }, 60000);

  afterEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});
