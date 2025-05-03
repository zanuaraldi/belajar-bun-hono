import {Hono} from 'hono'
import {HTTPException} from "hono/http-exception";
import {basicAuth} from "hono/basic-auth";
import { requestId } from 'hono/request-id'

class MyException extends Error {

}

const app = new Hono()

app.onError(async (err, c) =>{
    if(err instanceof HTTPException) {
        return err.getResponse()
    }

    if(err instanceof MyException) {
        c.status(401)
        return c.json({
            error: "Ups"
        })
    }

    c.status(500)
    return c.text("Ups")
})

app.get('/ups', (c) =>{
    throw new MyException();
})

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

app.get('/say-hello', async (c) => {
    const name = c.req.query('name')
    if (!name) {
        throw new HTTPException(400,{
            res: new Response(
                JSON.stringify({
                    error: "Name param must not empty"
                }),
                {
                    status: 400,
                    headers: {
                        "Author" : "Zanuar Aldi Syahputra",
                        "Content-Type" : "application/json"
                    }
                }
            )
        })
    }
    return c.text(`Hello ${name}`)
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


app
    .get('/context', async (c) => {
        c.header('Content-Type', 'application/json');
        c.status(200);

        return c.body(JSON.stringify({
            "first_name": "Zanuar",
            "last_name": "Aldi",
        }))
    })

    .get('/context/json', async (c) => {
        return c.json({
            "first_name": "Zanuar",
            "last_name": "Aldi",
        })
    })

app.post('users', async (c) => {
    const json = await c.req.json()
    return c.json({
        hello: `Hello ${json.name}`
    })
})

app.get('users', async (c) => {
    const page = c.req.query('page')
    const size = c.req.query('size')

    return c.text(`User with page ${page} and size ${size}`)
})

app
    .get('/response/text', (c) => {
        return c.text("Hello hono Response Text")
    })
    .get('/response/json', (c) => {
        c.status(201)
        c.header('X-Author', "Zanuar Aldi Syahputra")
        return c.json({
            data: "Hello Jono Response Json",
        })
    })
    .get('/response/html', (c) =>{
        return c.html("<html><body><h1>Hello Hono Respon HTML</h1></body></html>")
    })

const admin = new Hono().basePath('/admin');

admin.use(async (c, next) => {
    const token = c.req.header("Authorization");

    // jika token tidak ada akan muncul error
    if(!token) {
        throw new HTTPException(401);
    }
    //jika token ada maka akan akan lanjut
    await next()
})

admin.get('/a', (c) => c.text("Admin A"))
admin.get('/b', (c) => c.text("Admin B"))
admin.get('/c', (c) => c.text("Admin C"))

app.route('/', admin)

const operation = new Hono().basePath('/operation');
operation.use(basicAuth({
    username: "admin",
    password: "admin"
}))
operation.use(requestId())

operation.get('/a', (c) => c.text(`operation A : ${c.get('requestId')}`))
operation.get('/b', (c) => c.text(`operation B : ${c.get('requestId')}`))
operation.get('/c', (c) => c.text(`operation C : ${c.get('requestId')}`))

app.route('/', operation)
export default app
