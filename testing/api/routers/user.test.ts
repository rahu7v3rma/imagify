import axios from "axios";
import jwt from "jsonwebtoken";
import { API_DOMAIN, TEST_EMAIL, TEST_PASSWORD } from "../../utils/env";
import { deleteUsers, getUsers, createUser, updateUser } from "../../lib/mongodb";
import gmail from "../../lib/gmail";
import { comparePassword } from "../../lib/bcrypt";
import { generateJWT } from "../../lib/jwt";

describe("register routes", () => {
  const url = `${API_DOMAIN}/user/register`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
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
      response = await axios.post(url, {
        email: "not-an-email",
        password: "invalid-password",
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Invalid email address"],
        password: [
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
        ]
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
    expect(users[0].password?.length).toBeGreaterThan(1);
    expect(await comparePassword(TEST_PASSWORD, users[0].password)).toBe(true);
    expect(users[0].registerEmailConfirmed).toBe(false);
    expect(users[0].registerEmailConfirmationCode?.length).toBeGreaterThan(1);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const latestEmail = await gmail.getLatestEmail();
    expect(latestEmail.subject).toBe("Socialify email confirmation");
    expect(latestEmail.body).toContain(users[0].registerEmailConfirmationCode);
  }, 60000);

  test("POST /register with existing email should return 400 response", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    await createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      registerEmailConfirmationCode: "existing",
      registerEmailConfirmed: false,
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

describe("profile routes", () => {
  const url = `${API_DOMAIN}/user/profile`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("GET /profile without authorization header should return 401 response", async () => {
    let response;
    try {
      response = await axios.get(url);
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      success: false,
      message: "unauthorized",
      data: null,
    });
  });

  test("GET /profile with empty authorization header should return 401 response", async () => {
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          authorization: "",
        },
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      success: false,
      message: "unauthorized",
      data: null,
    });
  });

  test("GET /profile with invalid auth header should return 401 response", async () => {
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          authorization: "invalid-token",
        },
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      success: false,
      message: "unauthorized",
      data: null,
    });
  });

  test("GET /profile with valid jwt but invalid object should return 401 response", async () => {
    const invalidToken = jwt.sign({ id: "something" }, process.env.JWT_SECRET);
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          authorization: `${invalidToken}`,
        },
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      success: false,
      message: "unauthorized",
      data: null,
    });
  });

  test("GET /profile with valid jwt but invalid userId should return 401 response", async () => {
    const invalidUserId = "507f1f77bcf86cd799439011";
    const invalidToken = generateJWT({ userId: invalidUserId });
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          authorization: `${invalidToken}`,
        },
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      success: false,
      message: "unauthorized",
      data: null,
    });
  });

  test("GET /profile with unconfirmed email should return 401 response", async () => {
    await createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      registerEmailConfirmationCode: "test-code",
      registerEmailConfirmed: false,
    });
    const getUser = await getUsers({ email: TEST_EMAIL });
    const validToken = generateJWT({ userId: getUser[0]._id.toString() });
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          authorization: `${validToken}`,
        },
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(401);
    expect(response.data).toEqual({
      success: false,
      message: "unauthorized",
      data: null,
    });
  });

  test("GET /profile with valid user id should return 200 response with email", async () => {
    await createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      registerEmailConfirmationCode: "test-code",
      registerEmailConfirmed: true,
    });
    const getUser = await getUsers({ email: TEST_EMAIL });
    const validToken = generateJWT({ userId: getUser[0]._id.toString() });
    const response = await axios.get(url, {
      headers: {
        authorization: `${validToken}`,
      },
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "profile retrieved",
      data: { email: TEST_EMAIL },
    });
  });

  afterEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});

describe("forgot password routes", () => {
  const url = `${API_DOMAIN}/user/forgot-password`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("POST /forgot-password without body should return 400 response", async () => {
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
      },
    });
  });

  test("POST /forgot-password with invalid email should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, {
        email: "not-an-email",
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Invalid email address"],
      },
    });
  });

  test("POST /forgot-password with user not found should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, {
        email: "nonexistent@example.com",
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

  test("POST /forgot-password with unconfirmed email should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    let response;
    try {
      response = await axios.post(url, {
        email: TEST_EMAIL,
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "email not confirmed",
      data: null,
    });
  }, 60000);

  test("POST /forgot-password with valid request should return 200 response and send email", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await axios.post(`${API_DOMAIN}/user/email/confirm`, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: (await getUsers({ email: TEST_EMAIL }))[0].registerEmailConfirmationCode,
    });
    const response = await axios.post(url, {
      email: TEST_EMAIL,
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "forgot password email sent",
      data: null,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    expect(users.length).toBe(1);
    expect(users[0].forgotPasswordEmailConfirmationCode?.length).toBeGreaterThan(1);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const latestEmail = await gmail.getLatestEmail();
    expect(latestEmail.subject).toBe("Socialify forgot password");
    expect(latestEmail.body).toContain(users[0].forgotPasswordEmailConfirmationCode);
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

  test("POST /login with unconfirmed email should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
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
      message: "email not confirmed",
      data: null,
    });
  }, 60000);

  test("POST /login with correct email and password should return 200 and token", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await axios.post(`${API_DOMAIN}/user/email/confirm`, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: (await getUsers({ email: TEST_EMAIL }))[0].registerEmailConfirmationCode,
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
        registerEmailConfirmationCode: ["Required"],
      },
    });
  });

  test("POST /email/confirm with wrong email should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const usersBefore = await getUsers({ email: TEST_EMAIL });
    const confirmationCode = usersBefore[0].registerEmailConfirmationCode;
    let response;
    try {
      response = await axios.post(url, {
        email: "socialify@gmail.com",
        registerEmailConfirmationCode: confirmationCode,
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
        registerEmailConfirmationCode: "wrong",
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
    const confirmationCode = usersBefore[0].registerEmailConfirmationCode;
    const response = await axios.post(url, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: confirmationCode,
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "email confirmed successfully",
      data: null,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    expect(users.length).toBe(1);
    expect(users[0].registerEmailConfirmed).toBe(true);
  }, 60000);

  afterEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});

describe("reset password routes", () => {
  const url = `${API_DOMAIN}/user/reset-password`;
  beforeEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("POST /reset-password without body should return 400 response", async () => {
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
        forgotPasswordEmailConfirmationCode: ["Required"],
        password: ["Required"],
      },
    });
  });

  test("POST /reset-password with invalid email, forgotPasswordEmailConfirmationCode and password should return 400 response", async () => {
    let response;
    try {
      response = await axios.post(url, {
        email: "not-an-email",
        forgotPasswordEmailConfirmationCode: "",
        password: "weak",
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "invalid request body",
      data: {
        email: ["Invalid email address"],
        forgotPasswordEmailConfirmationCode: ["String must contain at least 1 character(s)"],
        password: [
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
        ],
      },
    });
  });

  test("POST /reset-password with valid email but invalid forgotPasswordEmailConfirmationCode should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await axios.post(`${API_DOMAIN}/user/email/confirm`, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: (await getUsers({ email: TEST_EMAIL }))[0].registerEmailConfirmationCode,
    });
    await axios.post(`${API_DOMAIN}/user/forgot-password`, {
      email: TEST_EMAIL,
    });
    let response;
    try {
      response = await axios.post(url, {
        email: TEST_EMAIL,
        forgotPasswordEmailConfirmationCode: "invalid-code",
        password: "NewPass123!",
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

  test("POST /reset-password with invalid email but valid forgotPasswordEmailConfirmationCode should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await axios.post(`${API_DOMAIN}/user/email/confirm`, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: (await getUsers({ email: TEST_EMAIL }))[0].registerEmailConfirmationCode,
    });
    await axios.post(`${API_DOMAIN}/user/forgot-password`, {
      email: TEST_EMAIL,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    const forgotPasswordCode = users[0].forgotPasswordEmailConfirmationCode;
    let response;
    try {
      response = await axios.post(url, {
        email: "wrong@example.com",
        forgotPasswordEmailConfirmationCode: forgotPasswordCode,
        password: "NewPass123!",
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
  
  test("POST /reset-password with unconfirmed email should return 400 response", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await axios.post(`${API_DOMAIN}/user/email/confirm`, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: (await getUsers({ email: TEST_EMAIL }))[0].registerEmailConfirmationCode,
    });
    await axios.post(`${API_DOMAIN}/user/forgot-password`, {
      email: TEST_EMAIL,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    const forgotPasswordCode = users[0].forgotPasswordEmailConfirmationCode;
    await updateUser({ email: TEST_EMAIL }, { registerEmailConfirmed: false });
    let response;
    try {
      response = await axios.post(url, {
        email: TEST_EMAIL,
        forgotPasswordEmailConfirmationCode: forgotPasswordCode,
        password: "NewPass123!",
      });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "email not confirmed",
      data: null,
    });
  }, 60000);

  test("POST /reset-password with all valid inputs should return 200 and update password", async () => {
    await axios.post(`${API_DOMAIN}/user/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    await axios.post(`${API_DOMAIN}/user/email/confirm`, {
      email: TEST_EMAIL,
      registerEmailConfirmationCode: (await getUsers({ email: TEST_EMAIL }))[0].registerEmailConfirmationCode,
    });
    await axios.post(`${API_DOMAIN}/user/forgot-password`, {
      email: TEST_EMAIL,
    });
    const usersBefore = await getUsers({ email: TEST_EMAIL });
    const forgotPasswordCode = usersBefore[0].forgotPasswordEmailConfirmationCode;
    const newPassword = "NewPass123!";
    const response = await axios.post(url, {
      email: TEST_EMAIL,
      forgotPasswordEmailConfirmationCode: forgotPasswordCode,
      password: newPassword,
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "password reset successfully",
      data: null,
    });
    const usersAfter = await getUsers({ email: TEST_EMAIL });
    expect(usersAfter.length).toBe(1);
    expect(await comparePassword(newPassword, usersAfter[0].password)).toBe(true);
    expect(await comparePassword(TEST_PASSWORD, usersAfter[0].password)).toBe(false);
  }, 60000);

  afterEach(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});
