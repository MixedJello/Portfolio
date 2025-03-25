import { createServer } from 'next';
import { parse } from 'url';
import http from'https';

const port = process.env.FRONTEND_PORT || 3000;
const hostname = '0.0.0.0';

const app = createServer({
    dev: false,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    http.createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`Next.js running on ${hostname}:${port}`);
    })
})