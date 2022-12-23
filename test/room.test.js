const request = require("supertest");
const app = require("../app");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VydGVzdGluZ0B0ZXN0aW5nLmNvbSIsImlhdCI6MTY3MDk0MTE0MSwiZXhwIjoxNjczNTMzMTQxfQ.0IOvCvkfYOQwePAK11ZgRrmME3joCK9w80wntgDzjU4";

describe("Room Controller", () => {
  it("User can create room & upload image", async () => {
    const res = await request(app)
      .post("/api/rooms/create")
      .set("Authorization", `Bearer ${token}`)
      .field("nama", "Testing Room")
      .field("fasilitas", "Testing")
      .field("kapasitas", "Testing")
      .field("waktu", "Testing")
      .field("harga", "100000")
      .attach("image", "test/images/img_room_meeting.png");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can get all rooms", async () => {
    const res = await request(app)
      .get("/api/rooms")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data[0].nama", "Testing Room");
  });

  it("User can get room by id", async () => {
    const res = await request(app)
      .get("/api/rooms/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data.nama", "Testing Room");
  });

  it("User can update room", async () => {
    const res = await request(app)
      .put("/api/rooms/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Testing Room Updated",
        fasilitas: "Testing",
        kapasitas: "Testing",
        waktu: "Testing",
        harga: "100000",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data.nama", "Testing Room Updated");
  });

  it("User can delete room", async () => {
    const res = await request(app)
      .delete("/api/rooms/1/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });
});
