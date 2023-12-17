"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Job_1 = __importDefault(require("../models/Job"));
const CrudRepository_1 = __importDefault(require("../helpers/CrudRepository"));
class JobRepository extends CrudRepository_1.default {
    constructor() {
        super(Job_1.default);
    }
}
exports.default = JobRepository;
