import express, {Request, Response} from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs';
import { uid } from 'uid';
import { authMiddleware, AuthRequest } from './auth';
import { prismaClient } from '..';

export const uploadRouter = express.Router()

uploadRouter.use((req, res, next) => authMiddleware(req as AuthRequest, res, next));

// Set up the multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: (req, file, cb) => {
    cb(null, uid(32) + ".mp4")
  },
})
const upload = multer({ storage })

uploadRouter.post('/', upload.single('video'), async (req: AuthRequest, res: Express.Response) => {
  const videoFile = req.file;

  if(!videoFile) return;

  await prismaClient.video.create({
    data: {
      userId: Number(req.userId),
      path: videoFile.filename,
    },
  })
})

uploadRouter.get("/all", async (req: Request<{userId: number}>, res) => {
  const userId = req.params.userId;
  const paths = await prismaClient.video.findMany({
    where: {
      userId: userId
    }
  });

  res.json(paths);
})

uploadRouter.get('/:videoName', (req: Request<{videoName: string}>, res: express.Response) => {
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
