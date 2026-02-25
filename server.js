const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

// Very small static file server that serves the React landing page and assets
const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];

  // Map URL -> file path
  let filePath = urlPath === "/" ? "/index.html" : urlPath;
  const fullPath = path.join(__dirname, filePath);

  // Basic content-type mapping
  const ext = path.extname(fullPath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".jsx": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webm": "video/webm",
    ".ico": "image/x-icon",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("404 Not Found");
      } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("500 Internal Server Error");
      }
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", contentType);
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`BusyBuddy landing page available at http://localhost:${PORT}`);
});

