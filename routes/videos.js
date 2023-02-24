"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uid_1 = require("uid");
const auth_1 = require("./auth");
const __1 = require("..");
exports.uploadRouter = express_1.default.Router();
exports.uploadRouter.use((req, res, next) => (0, auth_1.authMiddleware)(req, res, next));
// Set up the multer middleware to handle file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, (0, uid_1.uid)(32) + ".mp4");
    },
});
const upload = (0, multer_1.default)({ storage });
exports.uploadRouter.post('/', upload.single('video'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const videoFile = req.file;
    if (!videoFile)
        return;
    yield __1.prismaClient.video.create({
        data: {
            userId: Number(req.userId),
            path: videoFile.filename,
        },
    });
}));
exports.uploadRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const paths = yield __1.prismaClient.video.findMany({
        where: {
            userId: userId
        }
    });
    res.json(paths);
}));
exports.uploadRouter.get('/:videoName', (req, res) => {
    const videoName = req.params.videoName;
    const videoPath = path_1.default.join(__dirname, '../uploads/', videoName);
    const stat = fs_1.default.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs_1.default.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs_1.default.createReadStream(videoPath).pipe(res);
    }
});
