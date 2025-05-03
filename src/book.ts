import {Hono} from "hono";

export const book = new Hono().basePath('/api');
book
    .get('/book', (c) => {
        return c.text("Ini halaman Book")
    })

    .get('/book/a', (c) => {
        return c.text("Ini halaman Book A")
    })

    .get('/book/:id', (c) => {
        return c.text("Ini halaman Book ID")
    })
