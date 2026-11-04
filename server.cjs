const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    const filePath = path.join(
        __dirname,
        req.url === "/" ? "index.html" : req.url
    );

    const contentTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css"
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
            return;
        }

        const contentType =
            contentTypes[path.extname(filePath)] || "text/plain";

        res.writeHead(200, {
            "Content-Type": contentType
        });

        res.end(content);
    });
});

server.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});