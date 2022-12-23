const request = require("supertest");
const app = require("../app");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VydGVzdGluZ0B0ZXN0aW5nLmNvbSIsImlhdCI6MTY3MDk0MTE0MSwiZXhwIjoxNjczNTMzMTQxfQ.0IOvCvkfYOQwePAK11ZgRrmME3joCK9w80wntgDzjU4";

describe("Room Controller", () => {
  it("User can create room", async () => {
    const res = await request(app)
      .post("/api/rooms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Testing Room",
        fasilitas: "Testing",
        kapasitas: "Testing",
        waktu: "Testing",
        harga: "100000",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can create food & drink id 1", async () => {
    const res = await request(app)
      .post("/api/foods-drinks/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Testing Food & Drink 1",
        harga: "10000",
        deskripsi: "Testing Deskripsi",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can create food & drink id 2", async () => {
    const res = await request(app)
      .post("/api/foods-drinks/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Testing Food & Drink 2",
        harga: "20000",
        deskripsi: "Testing Deskripsi",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can create food & drink id 3", async () => {
    const res = await request(app)
      .post("/api/foods-drinks/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama: "Testing Food & Drink 3",
        harga: "30000",
        deskripsi: "Testing Deskripsi",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can create booking", async () => {
    const res = await request(app)
      .post("/api/bookings/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama_pemesan: "Testing",
        email_pemesan: "testing@testing.com",
        tgl_pemesanan: "2022-12-14T02:45:46Z",
        is_paid: true,
        room_id: 1,
        foodsndrinks: [1, 2, 3],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data.total", 160000);
  });

  it("User can get all bookings", async () => {
    const res = await request(app)
      .get("/api/bookings")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data[0].nama_pemesan", "Testing");
  });

  it("User can get booking by id", async () => {
    const res = await request(app)
      .get("/api/bookings/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data.nama_pemesan", "Testing");
  });

  it("User can update booking", async () => {
    const res = await request(app)
      .put("/api/bookings/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nama_pemesan: "Testing Updated",
        email_pemesan: "testing@testing.com",
        tgl_pemesanan: "2022-12-14T02:45:46Z",
        is_paid: true,
        room_id: 1,
        foodsndrinks: [1, 2],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data.total", 130000);
  });

  it("User can delete booking", async () => {
    const res = await request(app)
      .delete("/api/bookings/1/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });
});
