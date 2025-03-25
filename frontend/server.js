import next from 'next';
import { parse } from 'url';
import { createServer as createHttpServer } from'https';

const port = process.env.FRONTEND_PORT || 3000;
const hostname = '0.0.0.0';

const app = next({
    dev: false,
});

const handle = app.getRequestHandler();

async function start() {
    await app.prepare().then(() => {
        createHttpServer((req, res) => {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        }).listen(port, hostname, (err) => {
            if (err) throw err;
            console.log(`Next.js running on ${hostname}:${port}`);
        })
    })
}

start().catch((err) => {
    console.error(err);
    process.exit(1);
})
