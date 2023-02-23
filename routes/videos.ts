import express from 'express'
import multer from 'multer'
import path from 'path'

export const uploadRouter = express.Router()

// Set up the multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

// Define the video upload route
uploadRouter.post('/', upload.single('video'), (req, res) => {
  // This route handles video uploads
  const videoFile = req.file

  // Do something with the video file...

  res.json({ message: 'Video uploaded successfully.' })
})