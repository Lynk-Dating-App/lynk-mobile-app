"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncErrorWrapper(handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res, next);
        }
        catch (e) {
            next(e);
        }
    };
}
exports.default = asyncErrorWrapper;
