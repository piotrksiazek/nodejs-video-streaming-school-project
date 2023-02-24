"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const test_1 = require("./routes/test");
const client_1 = require("@prisma/client");
const auth_1 = require("./routes/auth");
const videos_1 = require("./routes/videos");
// ...
const app = (0, express_1.default)();
exports.prismaClient = new client_1.PrismaClient();
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
app.use(express_1.default.json());
app.use('/birds', test_1.birdsRouter);
app.use('/auth', auth_1.authRouter);
app.use('/upload', videos_1.uploadRouter);
app.use('/static', express_1.default.static(__dirname + "/uploads"));
var corsOptions = {
    origin: '*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => {
    res.send('Hello Worlds From the Typescript Server!');
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
