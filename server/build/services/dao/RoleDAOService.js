"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoleDAOService {
    roleRepository;
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.roleRepository.bulkCreate(records);
    }
    create(values) {
        return this.roleRepository.save(values);
    }
    findAll(filter, options) {
        return this.roleRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.roleRepository.findById(id, options);
    }
    findByIdPopulatePermissions(id, options) {
        return this.roleRepository.findByIdPopulatePermissions(id, options);
    }
    findByAnyPopulatePermissions(filter, options) {
        return this.roleRepository.findByAnyPopulatePermissions(filter, options);
    }
    findByAny(filter, options) {
        return this.roleRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.roleRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.roleRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.roleRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.roleRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.roleRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.roleRepository.exist(filter, options);
    }
}
exports.default = RoleDAOService;
