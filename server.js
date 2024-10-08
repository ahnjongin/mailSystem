require("dotenv").config(); // dotenv 패키지 추가

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
