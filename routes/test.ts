import express from "express"
import { prismaClient } from "../index";
import { authMiddleware, AuthRequest } from "./auth";
export const birdsRouter = express.Router()

birdsRouter.use((req, res, next) => authMiddleware(req as AuthRequest, res, next));

birdsRouter.get('/', async (req, res) => {
  const user = await prismaClient.user.findMany();
  res.send(user)
})
// define the about route
birdsRouter.get('/about', (req, res) => {
  res.send('About birds')
})