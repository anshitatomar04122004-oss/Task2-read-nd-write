const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {

    //url, method
    const url = req.url;
    const method = req.method;

    if (req.url === '/') {

        //read from file
        fs.readFile('message', (err, data) => {

            let messages = '';

            if (!err) {
                messages = data.toString();
            }

            //form
            res.setHeader('Content-Type', 'text/html');

            res.end(`
                <p>${messages.replace(/\n/g, '<br>')}</p>
                <form action="/message" method="POST">
                    <label>Message:</label>
                    <input type="text" name="message">
                    <button type="submit">Add</button>
                </form>
            `);
        });

    } else {

        if (req.url === '/message') {

            let body = [];

            req.on('data', (chunks) => {
                //console.log(chunks);
                body.push(chunks);
            });

            req.on('end', () => {

                let buffer = Buffer.concat(body);
                let formData = buffer.toString();

                const formValues = decodeURIComponent(
                    formData.split('=')[1].replace(/\+/g, ' ')
                );

                fs.appendFile('message', formValues + '\n', (err) => {

                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    res.end();

                });

            });

        }

    }

});

server.listen(3000, () => {
    console.log("Server is running");
});