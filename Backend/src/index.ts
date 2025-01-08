import { Hono } from 'hono'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

app.use('/*', cors())

const signupBody = z.object({
  name: z.string(),
  username: z.string().email(),
  password: z.string().min(8)
})

app.post('/signup', async (c) => {
  const body = await c.req.json();
  const success = signupBody.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      msg: "Incorrect inputs"
    })
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const user = await prisma.user.findFirst({
    where: {
      username: body.username
    }
  })

  if (user) {
    return c.json({
      msg: "User already exists"
    })
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        password: body.password
      }
    })

    const jwt = await sign({
      id: newUser.id
    }, c.env.JWT_SECRET)

    return c.json({
      token: jwt,
      msg: "User created successfully"
    })
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({
      message: "Invalid"
    })
  }
})


app.post("/login", async (c)=>{
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const user = await prisma.user.findFirst({
    where : {
      username : body.username
    }
  })
  if(!user){
    return c.json({
      msg : "user doesnt exist"
    })
  }

  try {
    const jwt = await sign({
      id: user.id
    }, c.env.JWT_SECRET)

    return c.json({
      token: jwt,
      name : user.name,
      msg: "user login successful"
    })
  }
  catch(e){
    console.log(e);
    c.status(411);
    return c.json({
      message: "Invalid"
    })
  }
})

export default app