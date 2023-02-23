import express, {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prismaClient } from '../index'

const secret = "secret";

interface JwtPayload {
  userId: string;
}

export interface AuthRequest extends Request {
  userId: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.userId = decoded.userId

    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Invalid token.' })
  }
}

export const authRouter = express.Router()
// User registration route
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    // Create the user
    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secret)

    res.json({ user, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while creating the user.' })
  }
})

// User login route
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Find the user by email
    const user = await prismaClient.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    // Compare the password hash
    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, secret)

    res.json({ user, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred while logging in.' })
  }
})