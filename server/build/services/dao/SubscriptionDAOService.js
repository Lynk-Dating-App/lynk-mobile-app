"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriptionDAOService {
    subscriptionRepository;
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.subscriptionRepository.bulkCreate(records);
    }
    create(values) {
        return this.subscriptionRepository.save(values);
    }
    findAll(filter, options) {
        return this.subscriptionRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.subscriptionRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.subscriptionRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.subscriptionRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.subscriptionRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.subscriptionRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.subscriptionRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.subscriptionRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.subscriptionRepository.exist(filter, options);
    }
}
exports.default = SubscriptionDAOService;
