import {Hono} from "hono";

export const web = new Hono().basePath('/web');

web.get('/a', (c) =>{
    const html =
        <html>
        <head>
            <title>Ini Kode HTML</title>
        </head>
        <body>
        <h1>Ini title</h1>
        </body>
        </html>

    return c.html(html);
})