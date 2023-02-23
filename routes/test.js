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
exports.birdsRouter = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const auth_1 = require("./auth");
exports.birdsRouter = express_1.default.Router();
exports.birdsRouter.use((req, res, next) => (0, auth_1.authMiddleware)(req, res, next));
exports.birdsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield index_1.prismaClient.user.findMany();
    res.send(user);
}));
// define the about route
exports.birdsRouter.get('/about', (req, res) => {
    res.send('About birds');
});
