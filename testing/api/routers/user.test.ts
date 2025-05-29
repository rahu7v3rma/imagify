import axios from "axios";
import { API_DOMAIN } from "../../utils/env";

describe("register routes", () => {
  test("GET /register should return 404 response", async () => {
    try {
      await axios.get(`${API_DOMAIN}/register`);
      // If no error is thrown, fail the test
      fail("Expected request to fail with 404, but it succeeded");
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toEqual({
          success: false,
          message: "route not found",
          data: null,
        });
      } else {
        // Fail the test with the error message if response is undefined
        fail(`Request failed without a response: ${error.message || error}`);
      }
    }
  });
});