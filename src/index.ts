import {Hono} from 'hono'

const app = new Hono()

app
    .get('/hello/:name', (c) => {
        const name = c.req.param('name')
        return c.text(`Hello ${name}`)
    })
    .post('/post', (c) => {
        return c.text("Post Hello")
    })

    .get('/products/:id{[0-9]+}', async (c) => {
        const id = c.req.param("id")
        return c.text(`Product ${id}`)
    })

    .get('/', (c) => {
        return c.text('Hello Hono!')
    })

const book = new Hono().basePath('/api');
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

app.route('/', book);
export default app
