"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserAddressDAOService {
    userAddressRepository;
    constructor(userAddressRepository) {
        this.userAddressRepository = userAddressRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.userAddressRepository.bulkCreate(records);
    }
    create(values) {
        return this.userAddressRepository.save(values);
    }
    findAll(filter, options) {
        return this.userAddressRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.userAddressRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.userAddressRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.userAddressRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.userAddressRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.userAddressRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.userAddressRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.userAddressRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.userAddressRepository.exist(filter, options);
    }
}
exports.default = UserAddressDAOService;
