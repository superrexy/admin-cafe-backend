const request = require("supertest");
const app = require("../app");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VydGVzdGluZ0B0ZXN0aW5nLmNvbSIsImlhdCI6MTY3MDk0MTE0MSwiZXhwIjoxNjczNTMzMTQxfQ.0IOvCvkfYOQwePAK11ZgRrmME3joCK9w80wntgDzjU4";

describe("Food & Drink Controller", () => {
  it("User can create food & drink & upload file", async () => {
    const res = await request(app)
      .post("/api/foods-drinks/create")
      .set("Authorization", `Bearer ${token}`)
      .field("nama", "Testing Food & Drink")
      .field("harga", "10000")
      .field("deskripsi", "Testing Deskripsi")
      .attach("image", "test/images/img_makanan.jpeg");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can get all foods & drinks", async () => {
    const res = await request(app)
      .get("/api/foods-drinks")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data[0].nama", "Testing Food & Drink");
  });

  it("User can get food & drink by id", async () => {
    const res = await request(app)
      .get("/api/foods-drinks/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data.nama", "Testing Food & Drink");
  });

  it("User can update food & drink", async () => {
    const res = await request(app)
      .put("/api/foods-drinks/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Testing Food & Drink Updated",
        harga: "10000",
        deskripsi: "Testing Deskripsi",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty(
      "data.nama",
      "Testing Food & Drink Updated"
    );
  });

  it("User can delete food & drink", async () => {
    const res = await request(app)
      .delete("/api/foods-drinks/1/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });
});
