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
exports.authRouter = exports.authMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../index");
const secret = "secret";
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token.' });
    }
}
exports.authMiddleware = authMiddleware;
exports.authRouter = express_1.default.Router();
// User registration route
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        // Create the user
        const user = yield index_1.prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
        res.json({ user, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the user.' });
    }
}));
// User login route
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = yield index_1.prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Compare the password hash
        const passwordMatches = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, secret);
        res.json({ user, token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while logging in.' });
    }
}));
