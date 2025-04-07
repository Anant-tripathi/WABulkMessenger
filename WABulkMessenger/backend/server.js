const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

let browser;
let page;

// Launch WhatsApp Web
const startWhatsApp = async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("https://web.whatsapp.com");
  console.log("Scan the QR code on WhatsApp Web.");
};

startWhatsApp();

// Delay between messages
const getRandomDelay = () => {
  return Math.floor(Math.random() * (90000 - 30000 + 1)) + 30000; // 30s to 90s
};

//Send to a single contact
const sendToContact = async (contact, message, attachmentPath, location) => {
  try {
    const fullMessage = location ? `${message}\n${location}` : message;

    await page.goto(
      `https://web.whatsapp.com/send?phone=${contact}&text=${encodeURIComponent(fullMessage)}`,
    );
    await page.waitForSelector("div[contenteditable='true'][data-tab='10']", {
      timeout: 15000,
    });

    // Send the message
    await page.evaluate(() => {
      const messageBox = document.querySelector(
        "div[contenteditable='true'][data-tab='10']",
      );
      messageBox.focus();
    });

    await page.keyboard.press("Enter");

    if (attachmentPath) {
      try {
        browser = await puppeteer.launch({
          headless: false,
          slowMo: 100,
        });
        // Step 1: Click the attach icon
        const clipButton = await page.waitForSelector("div[title='Attach']", {
          timeout: 20000,
        });
        await clipButton.click();

        // Step 2: Select the document input field (accept="*")
        const documentInput = await page.waitForSelector('input[accept="*"]', {
          timeout: 10000,
        });

        // Step 3: Upload the file
        await documentInput.uploadFile(attachmentPath);
        console.log("File uploaded");

        // Step 4: Wait before clicking send
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Step 5: Click the send button (paper plane icon)
        const sendButton = await page.waitForSelector(
          "span[data-icon='send']",
          {
            timeout: 10000,
          },
        );
        await sendButton.click();

        console.log("Attachment sent");
      } catch (err) {
        console.error("Error while uploading and sending document:", err);
      }
    }

    console.log(`Message sent to ${contact}`);
    const delay = getRandomDelay();
    console.log(`Waiting for ${delay / 1000} seconds...`);
    await page.waitForTimeout(delay);
    return { contact, success: true };
  } catch (error) {
    console.error(`Failed to send message to ${contact}:`, error);
    return { contact, success: false, error: error.message };
  }
};

// Main route for sending message
app.post("/send", upload.single("attachment"), async (req, res) => {
  const { contact, message, location } = req.body;
  const attachment = req.file;

  if (!contact || !message) {
    return res.status(400).json({ error: "Contact and message are required." });
  }

  const contacts = Array.isArray(contact) ? contact : [contact];
  const attachmentPath = attachment ? attachment.path : null;

  console.log("== Sending to contacts ==");
  console.log("Contacts:", contacts);
  console.log("Message:", message);
  console.log("Attachment:", attachmentPath || "None");
  console.log("Location:", location || "None");

  const results = [];
  for (let number of contacts) {
    const result = await sendToContact(
      number,
      message,
      attachmentPath,
      location,
    );
    results.push(result);
  }

  // Clean up uploaded file
  if (attachmentPath) {
    fs.unlink(attachmentPath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
  }

  res.json({ success: true, results });
});

// Clean up on shutdown
process.on("SIGINT", async () => {
  if (browser) await browser.close();
  process.exit();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
