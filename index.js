const express = require("express");
const { Resend } = require("resend");
const app = express();
require("dotenv").config();

// Add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const resendApiKey = process.env.API_KEY;
const recepientEmail = process.env.RECEPIENT_EMAIL;

const resend = new Resend(resendApiKey);

app.get("/", (req, res) => {
  res.send(`
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align:center;color:purple;">Resend API Server</h1>
      <p>Fill out the form below to send an email:</p>
      
      <form action="/send" method="POST" style="display: flex; flex-direction: column; gap: 10px;">
        <input type="text" name="name" placeholder="Your Name" required style="padding: 8px;">
        <input type="email" name="email" placeholder="Your Email" required style="padding: 8px;">
        <textarea name="message" placeholder="Your Message" required style="padding: 8px; min-height: 100px;"></textarea>
        <button type="submit" style="padding: 10px; background: purple; color: white; border: none; cursor: pointer;">
          Send Message
        </button>
      </form>

      <p style="margin-top: 20px;">
        <a href="https://github.com/Unrealrojo234/ResendAPI">View Repository</a>
      </p>
    </div>
  `);
});

// Replace the GET route with a POST route
app.post("/send", async (req, res) => {
  const { email, message: msg, name } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: "Rojo's Ltd <onboarding@resend.dev>",
      to: [recepientEmail],
      subject: "New Job Application",
      html: `
      <h1 style='text-align:center;color:rebeccapurple;'>New Job Applicant</h1>
      <p>Name: ${name}</p>
      <h3>Message</h3>
      <p>${msg}</p>
      <a href="mailto:${email}">Reply to Applicant</a>
      `,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    // Redirect back to homepage with success message
    res.send(`
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: green;">Message sent successfully!</h2>
        <a href="/">Back to Home</a>
      </div>
    `);
  } catch (err) {
    res.status(500).send(`
      <div style="text-align: center; padding: 20px;">
        <h2 style="color: red;">Error sending message</h2>
        <p>${err.message}</p>
        <a href="/">Back to Home</a>
      </div>
    `);
  }
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
