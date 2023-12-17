"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDAOService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.userRepository.bulkCreate(records);
    }
    create(values) {
        return this.userRepository.save(values);
    }
    findAll(filter, options) {
        return this.userRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.userRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.userRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.userRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.userRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.userRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.userRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.userRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.userRepository.exist(filter, options);
    }
}
exports.default = UserDAOService;
