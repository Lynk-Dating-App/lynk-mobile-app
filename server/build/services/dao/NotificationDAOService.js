"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NotificationDAOService {
    notificationRepository;
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.notificationRepository.bulkCreate(records);
    }
    create(values) {
        return this.notificationRepository.save(values);
    }
    findAll(filter, options) {
        return this.notificationRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.notificationRepository.findById(id, options);
    }
    findByIdPopulatePermissions(id, options) {
        return this.notificationRepository.findByIdPopulatePermissions(id, options);
    }
    findByAnyPopulatePermissions(filter, options) {
        return this.notificationRepository.findByAnyPopulatePermissions(filter, options);
    }
    findByAny(filter, options) {
        return this.notificationRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.notificationRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.notificationRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.notificationRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.notificationRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.notificationRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.notificationRepository.exist(filter, options);
    }
}
exports.default = NotificationDAOService;
