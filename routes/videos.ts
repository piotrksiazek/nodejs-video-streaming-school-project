import express, {Request, Response} from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs';

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

uploadRouter.get('/:videoName', (req: Request<{videoName: string}>, res: Response) => {
  const videoName = req.params.videoName;
  const videoPath = path.join(__dirname, '../uploads/', videoName);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});
