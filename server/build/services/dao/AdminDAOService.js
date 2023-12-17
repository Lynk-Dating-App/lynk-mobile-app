"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDAOService {
    adminRepository;
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.adminRepository.bulkCreate(records);
    }
    create(values) {
        return this.adminRepository.save(values);
    }
    findAll(filter, options) {
        return this.adminRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.adminRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.adminRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.adminRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.adminRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.adminRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.adminRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.adminRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.adminRepository.exist(filter, options);
    }
}
exports.default = UserDAOService;
