const request = require("supertest");
const app = require("../app");

var token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VydGVzdGluZ0B0ZXN0aW5nLmNvbSIsImlhdCI6MTY3MDk0MTE0MSwiZXhwIjoxNjczNTMzMTQxfQ.0IOvCvkfYOQwePAK11ZgRrmME3joCK9w80wntgDzjU4";

describe("MVP Testing 1", () => {
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
      .set("Authorization", `Bearer ${token}`)
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
        foodsndrinks: [
          {
            food_drink_id: 1,
            amount: 3,
          },
        ],
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data.total", 130000);
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
        is_paid: false,
        room_id: 1,
        foodsndrinks: [
          {
            food_drink_id: 1,
            amount: 1,
          },
        ],
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data.total", 110000);
    expect(res.body).toHaveProperty("data.is_paid", false);
  });

  it("User can delete booking", async () => {
    const res = await request(app)
      .delete("/api/bookings/1/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can delete food & drink", async () => {
    const res = await request(app)
      .delete("/api/foods-drinks/1/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });

  it("User can delete room", async () => {
    const res = await request(app)
      .delete("/api/rooms/1/delete")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", true);
  });
});
