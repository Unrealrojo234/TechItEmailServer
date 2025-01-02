const { Resend } = require("resend");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
const resendApiKey = process.env.API_KEY;
const recepientEmail = process.env.RECEPIENT_EMAIL;

const resend = new Resend(resendApiKey);

app.get("/", (req, res) => {
  res.send(
    `
      <h1 style="text-align:center;color:purple;">Resend Api Server</h1>
      <p>This server enables you to intagrate emails to your websites</p>
      <a href="https://github.com/Unrealrojo234/ResendAPI">Repository</a>
      `
  );
});

app.get("/send/:email/:msg/:name", async (req, res) => {
  const { email, msg, name } = req.params;

  try {
    const { data, error } = await resend.emails.send({
      from: "Tech It <onboarding@resend.dev>",
      to: [`${recepientEmail}`],
      subject: "Tech It",
      html: `
      <h1 style='text-align:center;color:rebeccapurple;'>Tech Gurus Message</h1>
      <p>Name: ${name},</p>
      <h3>Message</h3>
      <p>${msg}</p>
      <a target_='blank' href="mailto:${email}">Sender Email</a>
      `,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({ data });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
