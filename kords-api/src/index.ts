import { PrismaClient, Prisma } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import express from 'express'
import cors from 'cors';
import routes from './routes/index.routes'
import "dotenv/config";
const pool = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
export const prisma = new PrismaClient({ adapter: pool })

const app = express()
app.use(cors())

// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? 'https://votre-domaine.com' 
//     : '*',
//   credentials: true
// }));

app.use((req, res, next) => {
  if (req.headers['content-type']?.startsWith('multipart/form-data')) return next();
  express.json()(req, res, next);
})
app.use("/api", routes)

app.listen(8081, () =>
  console.log('REST API server ready at: http://localhost:8081'),
)