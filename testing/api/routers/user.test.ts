import axios from "axios";
import { API_DOMAIN, TEST_EMAIL, TEST_PASSWORD } from "../../utils/env";
import { deleteUsers, getUsers, createUser } from "../../lib/mongodb";
import { comparePassword } from "../../lib/bcrypt";
import gmail from "../../lib/gmail";

describe("register routes", () => {
  const url = `${API_DOMAIN}/user/register`;

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

  test("POST /register with correct email and password", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    const response = await axios.post(url, { email: TEST_EMAIL, password: TEST_PASSWORD });
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
    const isMatch = await comparePassword(TEST_PASSWORD, users[0].password);
    expect(isMatch).toBe(true);
    expect(users[0].emailConfirmed).toBe(false);
    expect(users[0].emailConfirmationCode).toBeDefined();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const latestEmail = await gmail.getLatestEmail();
    expect(latestEmail.subject).toBe("Socialify email confirmation");
    expect(latestEmail.body).toContain(users[0].emailConfirmationCode);
    await deleteUsers({ email: TEST_EMAIL });
  }, 60000);

  test("POST /register with existing email should return 400 response", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    await createUser({ email: TEST_EMAIL, password: TEST_PASSWORD, emailConfirmationCode: "existing", emailConfirmed: false });
    let response;
    try {
      response = await axios.post(url, { email: TEST_EMAIL, password: TEST_PASSWORD });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "email already exists",
      data: null,
    });
    await deleteUsers({ email: TEST_EMAIL });
  }, 60000);

  afterAll(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });

});

describe("email confirmation routes", () => {
  const url = `${API_DOMAIN}/user/email/confirm`;

  test("POST /email/confirm with wrong email should return 400 response", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    await createUser({ email: 'wrong@email.com', password: TEST_PASSWORD, emailConfirmationCode: "correct", emailConfirmed: false });
    let response;
    try {
      response = await axios.post(url, { email: TEST_EMAIL, emailConfirmationCode: "correct" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "user not found",
      data: null,
    });
    await deleteUsers({ email: TEST_EMAIL });
  });

  test("POST /email/confirm with wrong code should return 400 response", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    await createUser({ email: TEST_EMAIL, password: TEST_PASSWORD, emailConfirmationCode: "correct", emailConfirmed: false });
    let response;
    try {
      response = await axios.post(url, { email: TEST_EMAIL, emailConfirmationCode: "wrong" });
    } catch (error) {
      response = error.response;
    }
    expect(response.status).toBe(400);
    expect(response.data).toEqual({
      success: false,
      message: "user not found",
      data: null,
    });
    await deleteUsers({ email: TEST_EMAIL });
  }, 60000);

  test("POST /email/confirm with correct code should return 200 response", async () => {
    await deleteUsers({ email: TEST_EMAIL });
    await createUser({ email: TEST_EMAIL, password: TEST_PASSWORD, emailConfirmationCode: "correct", emailConfirmed: false });
    const response = await axios.post(url, { email: TEST_EMAIL, emailConfirmationCode: "correct" });
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      success: true,
      message: "email confirmed successfully",
      data: null,
    });
    const users = await getUsers({ email: TEST_EMAIL });
    expect(users.length).toBe(1);
    expect(users[0].emailConfirmed).toBe(true);
    await deleteUsers({ email: TEST_EMAIL });
  }, 60000);

  afterAll(async () => {
    await deleteUsers({ email: TEST_EMAIL });
  });
});
