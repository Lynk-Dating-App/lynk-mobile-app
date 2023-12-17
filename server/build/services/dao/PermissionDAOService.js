"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PermissionDAOService {
    permissionRepository;
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.permissionRepository.bulkCreate(records);
    }
    create(values) {
        return this.permissionRepository.save(values);
    }
    findAll(filter, options) {
        return this.permissionRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.permissionRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.permissionRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.permissionRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.permissionRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.permissionRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.permissionRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.permissionRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.permissionRepository.exist(filter, options);
    }
}
exports.default = PermissionDAOService;
