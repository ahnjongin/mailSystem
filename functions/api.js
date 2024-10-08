require("dotenv").config(); // dotenv 패키지 추가
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const router = express.Router();

app.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("App is running ... 2");
});

router.post("/send-email", async (req, res) => {
  const { to, subject, text, password } = req.body;
  console.log(req.body);
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);
  console.log(process.env.PASSWORD);
  if (password !== process.env.PASSWORD) {
    return res.status(403).send("Invalid password");
  }
  // Nodemailer transporter 설정
  const transporter = nodemailer.createTransport({
    service: "gmail", // 사용하고자 하는 이메일 서비스
    auth: {
      user: process.env.EMAIL_USER, // 본인의 이메일
      pass: process.env.EMAIL_PASS, // 본인의 이메일 비밀번호
    },
  });

  // 이메일 옵션 설정
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.use("/api/", router);

module.exports.handler = serverless(app);
