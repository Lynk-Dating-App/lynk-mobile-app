import UserRepository from "../repositories/UserRepository";

const userRepository = new UserRepository()

export default class CronJob {
    public static async userIsExpired () {
        console.log('cron job started')
        const users = await userRepository.findAll({});
        const currentDate = new Date();

        for (const user of users) {
            if (user.subscription.endDate && user.subscription.endDate <= currentDate) {
                await userRepository.update({_id: user._id}, {isExpired: true, planType: 'purple'});
            }
        }
    }
}

