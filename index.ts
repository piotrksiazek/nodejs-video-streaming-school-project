import "reflect-metadata";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import { birdsRouter } from "./routes/test";
import { PrismaClient } from "@prisma/client";
import { authRouter } from "./routes/auth";
import { uploadRouter } from "./routes/videos";

// ...


const app: Express = express();

export const prismaClient = new PrismaClient();

// async function main() {
//   const users = await prismaClient.user.findMany()
//   if (users.length === 0) {
//     const newUsers = await prismaClient.user.create({data: {
//           name: 'John Doe',
//           email: 'john.doe@example.com'
//     }})
//   } else {
//     console.log('User table already has data.')
//   }
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prismaClient.$disconnect()
//   })

app.use('/birds', birdsRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

app.use('/static', express.static(__dirname + "/uploads"));

app.use(express.json());

var corsOptions = {
  origin: 'http://localhost:3000/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Worlds From the Typescript Server!')
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
