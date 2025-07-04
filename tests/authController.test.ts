import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { getDB, saveDB } from "../src/utils/dbUtils";
import { roleTableMap } from "../src/config/constants";
import authController from "../src/controllers/authController";

process.env.JWT_SECRET = "mysecret";
// Setup express app for isolated testing
const app = express();
app.use(bodyParser.json());

app.post("/login", authController.Userlogin);
app.post("/sendotp", authController.sendOTP);
app.post("/verifyotp", authController.verifyOtp);

const testEmail = "superadmin@gmail.com";
const testPassword = "123456";
const testRole = "Admin"; // should match your roleTableMap
const OTP_VALUE = "1234"; // Matches your current hardcoded OTP logic

beforeEach(() => {
  const db = getDB();
  const table = roleTableMap[testRole];
  db[table] = [
    {
      id: 1,
      email: "superadmin@gmail.com",
      password: "superadmin123",
      otp: null,
    },
  ];
  saveDB(db);
});

describe("Auth Routes", () => {
  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/login").send({
        email: "superadmin@gmail.com",
        password: "superadmin123",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.email).toBe(testEmail);
    });

    it("should fail login with wrong password", async () => {
      const res = await request(app).post("/login").send({
        email: "superadmin@gmail.com",
        password: "student1293",
        roleName: "Student",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.message).toBe("Incorrect Password");
    });

    it("User not found", async () => {
      const res = await request(app).post("/login").send({
        email: "student1@gmail.com",
        password: "student@123",
      });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("POST /sendotp", () => {
    it("should send OTP successfully", async () => {
      const res = await request(app).post("/sendotp").send({
        email: testEmail,
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("OTP sent successfully.");
    });

    it("should fail to send OTP for unknown user", async () => {
      const res = await request(app).post("/sendotp").send({
        email: "unknown@example.com",
      });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found.");
    });
  });
  
  describe("POST /verifyotp", () => {
    it("OTP verify successfully", async () => {
      const res = await request(app).post("/verifyotp").send({
        email: testEmail,
        otp: "1234",
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("OTP verified successfully.");
    });

    it("Please add mail and otp", async () => {
      const res = await request(app).post("/verifyotp").send({
        email: "",
        otp: "",
      });
      console.log("rererrerre", res?.body);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email and OTP are required.");
    });

    it("User not available for verify otp", async () => {
      const res = await request(app).post("/verifyotp").send({
        email: "unknown@example.com",
        otp: "1234",
      });
      console.log("rererrerre", res?.body);
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
    it("Invalid Otp", async () => {
      const res = await request(app).post("/verifyotp").send({
        email: testEmail,
        otp: "12345",
      });
      console.log("rererrerre", res?.body);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid OTP");
    });

    // it("should fail to send OTP for unknown user", async () => {
    //   const res = await request(app).post("/sendotp").send({
    //     email: "unknown@example.com",
    //   });
    //   expect(res.statusCode).toBe(404);
    //   expect(res.body.message).toBe("User not found.");
    // });
  });

  // describe("POST /verify-otp", () => {
  //   it("should verify OTP successfully", async () => {
  //     const db = getDB();
  //     const table = roleTableMap[testRole];
  //     db[table][0].otp = OTP_VALUE;
  //     saveDB(db);

  //     const res = await request(app).post("/verify-otp").send({
  //       email: testEmail,
  //       otp: OTP_VALUE,
  //       roleName: testRole,
  //     });

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body.status).toBe(true);
  //     expect(res.body.data.token).toBeDefined();
  //     expect(res.body.data.email).toBe(testEmail);
  //   });

  //   it("should fail on invalid OTP", async () => {
  //     const db = getDB();
  //     const table = roleTableMap[testRole];
  //     db[table][0].otp = OTP_VALUE;
  //     saveDB(db);

  //     const res = await request(app).post("/verify-otp").send({
  //       email: testEmail,
  //       otp: "wrongOTP",
  //       roleName: testRole,
  //     });

  //     expect(res.statusCode).toBe(400);
  //     expect(res.body.message).toBe("Invalid OTP");
  //   });
  // });
});
