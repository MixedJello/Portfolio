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
    try {
    await app.prepare();
    const server = createHttpServer((req, res) => {
        console.log(`Handling request: ${req.url}`);
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl).catch((err) => {
            console.error(`Request error: ${err}`);
            res.statusCode = 500;
            res.end('Internal Server Error');
        });
        });
        server.listen(port, hostname, (err) => {
        if (err) throw err;
        console.log(`Next.js running on ${hostname}:${port}`);
        });
        server.on('error', (err) => console.error(`Server error: ${err}`));
    } catch (err) {
        console.error(`Startup error: ${err}`);
        process.exit(1);
    }
    }

start();
