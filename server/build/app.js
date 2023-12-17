"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const settings_1 = __importDefault(require("./config/settings"));
const globalExceptionHandler_1 = __importDefault(require("./middleware/globalExceptionHandler"));
const routes_1 = __importDefault(require("./routes"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
// import { default as connectMongoDBSession} from 'connect-mongodb-session';
require('./services/PassportService');
// const MongoDBStore = connectMongoDBSession(session);
// const store = new MongoDBStore({
//   uri: 'mongodb://localhost/zues_dev_db',
//   collection: 'sessions'
// });
// store.on('error', function(error) {
//   console.error('Session store error:', error);
// });
const app = (0, express_1.default)();
exports.corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
        process.env.CLIENT_URL
    ],
    credentials: true,
};
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(exports.corsOptions)); //handle cors operations
app.use((0, express_1.json)()); // Parse incoming requests data
app.use((0, morgan_1.default)('dev')); //Route debugger
app.use((0, express_session_1.default)({
    secret: 's8up_app',
    resave: false,
    saveUninitialized: false,
    // store
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/uploads', (0, express_1.static)(path_1.default.resolve('uploads')));
app.use(`${settings_1.default.service.apiRoot}`, routes_1.default); //All routes middleware
app.use(globalExceptionHandler_1.default); //Handle error globally
exports.default = app;
