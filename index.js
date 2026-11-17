const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'GET') {

        fs.readFile('message', 'utf8', (err, data) => {

            if (err && err.code !== 'ENOENT') {
                res.writeHead(500);
                return res.end('Error reading file');
            }

            let messages = data ? data.split('\n').filter(Boolean).reverse() : [];

            res.setHeader('Content-Type', 'text/html');

            res.end(`
                <html>
                <body>
                    <h1>Messages</h1>

                    ${messages.map(msg => `<p>${msg}</p>`).join('')}

                    <form action="/message" method="POST">
                        <input type="text" name="message" required>
                        <button type="submit">Send</button>
                    </form>

                </body>
                </html>
            `);
        });

    } else if (req.url === '/message' && req.method === 'POST') {

        let body = '';

        req.on('data', (chunks) => {
            body += chunks.toString();
        });

        req.on('end', () => {

            const message = new URLSearchParams(body).get('message');

            fs.appendFile('message', message + '\n', (err) => {

                if (err) {
                    res.writeHead(500);
                    return res.end('Error writing file');
                }

                res.writeHead(302, {
                    'Location': '/'
                });

                res.end();
            });
        });

    } else {
        res.writeHead(404);
        res.end('Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});