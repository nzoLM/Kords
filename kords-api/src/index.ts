import { PrismaClient, Prisma } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import express from 'express'
import router from './routes/users.routes'
import "dotenv/config";
const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = new PrismaClient({ adapter: pool })

const app = express()
app.use(express.json())
app.use("/users", router)

app.listen(8081, () =>
  console.log('REST API server ready at: http://localhost:8081'),
)