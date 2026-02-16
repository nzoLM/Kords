import { PrismaClient, Prisma } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import express from 'express'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = new PrismaClient({ adapter: pool })

const app = express()

app.use(express.json())

// ... vos routes API REST iront ici

app.listen(5558, () =>
  console.log('REST API server ready at: http://localhost:5558'),
)