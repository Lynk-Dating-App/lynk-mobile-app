"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
function fileUploadMiddleware(options) {
    const form = (0, formidable_1.default)(options);
    return async function (req, res, next) {
        form.parse(req, async (err, fields, files) => {
            return new Promise((resolve, reject) => {
                if (err)
                    return reject(err);
                req.fields = fields;
                req.files = files;
                resolve(next());
            });
        });
        next();
    };
}
exports.default = fileUploadMiddleware;
