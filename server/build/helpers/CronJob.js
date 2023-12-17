"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
const userRepository = new UserRepository_1.default();
class CronJob {
    static async userIsExpired() {
        console.log('cron job started');
        const users = await userRepository.findAll({});
        const currentDate = new Date();
        for (const user of users) {
            if (user.subscription.endDate && user.subscription.endDate <= currentDate) {
                await userRepository.update({ _id: user._id }, { isExpired: true, planType: 'purple' });
            }
        }
    }
}
exports.default = CronJob;
