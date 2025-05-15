const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle text submissions
app.post('/send-text', express.urlencoded({ extended: true }), (req, res) => {
  const text = req.body.text;
  console.log('Received text:', text);
  res.redirect('/');
});

// Handle file uploads
app.post('/upload-file', upload.single('file'), (req, res) => {
  console.log('Received file:', req.file.originalname);
  res.redirect('/');
});

// Create a simple HTML file to serve
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Simple File/Text Sender</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; }
    form { margin-bottom: 20px; }
    input, button { margin-top: 10px; }
    h2 { margin-top: 30px; }
  </style>
</head>
<body>
  <h1>Send Text or File</h1>
  
  <h2>Send Text</h2>
  <form action="/send-text" method="post">
    <textarea name="text" rows="4" cols="40" placeholder="Enter your text here"></textarea><br>
    <button type="submit">Send Text</button>
  </form>
  
  <h2>Upload File</h2>
  <form action="/upload-file" method="post" enctype="multipart/form-data">
    <input type="file" name="file"><br>
    <button type="submit">Upload File</button>
  </form>
</body>
</html>
`;

// Ensure the public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Write the HTML file
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
  console.log(`Access this server from your phone by using your computer's IP address`);
  console.log(`For example: http://192.168.1.X:${port} (replace with your actual IP)`);
});
