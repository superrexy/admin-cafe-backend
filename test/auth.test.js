const request = require("supertest");
const app = require("../app");

describe("Auth Controller", () => {
  it("User can register", async () => {
    const res = await request(app).post("/api/auth/register").send({
      first_name: "User",
      last_name: "Testing",
      email: "usertesting@testing.com",
      password: "testing123",
      phone_number: "081333444555",
      address: "Jalan Testing No 123",
      birth_date: "1990-01-01",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "usertesting@testing.com",
      password: "testing123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can upload profile image", async () => {
    const res = await request(app)
      .post("/api/auth/image-update")
      .set(
        "Authorization",
        `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VydGVzdGluZ0B0ZXN0aW5nLmNvbSIsImlhdCI6MTY3MDk0MTE0MSwiZXhwIjoxNjczNTMzMTQxfQ.0IOvCvkfYOQwePAK11ZgRrmME3joCK9w80wntgDzjU4`
      )
      .attach("image", "test/images/user.png");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can request reset password", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password/request")
      .send({
        email: "usertesting@testing.com",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });
});
