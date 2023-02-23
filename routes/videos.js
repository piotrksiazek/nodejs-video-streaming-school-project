"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
exports.uploadRouter = express_1.default.Router();
// Set up the multer middleware to handle file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// Define the video upload route
exports.uploadRouter.post('/', upload.single('video'), (req, res) => {
    // This route handles video uploads
    const videoFile = req.file;
    // Do something with the video file...
    res.json({ message: 'Video uploaded successfully.' });
});
