const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const genAI = new GoogleGenerativeAI("AIzaSyBG8ycitvNP3p7mM2W7C5IPJyyKzZYkTGE");



// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve HTML, CSS, and JS as part of the same backend route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Responsive Educational AI Assistant</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: #f4f4f9;
        }

        h1 {
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        .container {
          width: 90%;
          max-width: 600px;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        textarea, button {
          width: 100%;
          margin: 10px 0;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          background-color: #007BFF;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #0056b3;
        }

        .response {
          margin-top: 20px;
          padding: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
          font-size: 16px;
          color: #333;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          h1 {
            font-size: 1.5rem;
          }

          textarea, button {
            font-size: 14px;
            padding: 10px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.2rem;
          }

          textarea {
            height: 100px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Educational AI Assistant</h1>
        <textarea id="prompt" rows="4" placeholder="Enter your question here..."></textarea>
        <button id="submitBtn">Submit</button>
        <div class="response" id="response"></div>
      </div>

      <script>
        document.getElementById("submitBtn").addEventListener("click", async () => {
          const prompt = document.getElementById("prompt").value;

          if (!prompt) {
            alert("Please enter a prompt!");
            return;
          }

          document.getElementById("response").innerHTML = "Loading...";

          try {
            const response = await fetch("/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ prompt }),
            });

            if (response.ok) {
              const data = await response.text(); // Use text() instead of json()
              document.getElementById("response").innerHTML = \`<p>\${data}</p>\`;
            } else {
              document.getElementById("response").innerHTML = "Error: Could not get a response from the server.";
            }
          } catch (error) {
            console.error("Error:", error);
            document.getElementById("response").innerHTML = "An error occurred. Please try again.";
          }
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoint to generate AI response based on the prompt
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send("Prompt is required");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.send(result.response.text()); // Send plain text response
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to generate response");
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
