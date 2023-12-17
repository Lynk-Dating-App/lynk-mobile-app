"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobDAOService {
    jobRepository;
    constructor(jobRepository) {
        this.jobRepository = jobRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.jobRepository.bulkCreate(records);
    }
    create(values) {
        return this.jobRepository.save(values);
    }
    findAll(filter, options) {
        return this.jobRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.jobRepository.findById(id, options);
    }
    findByIdPopulatePermissions(id, options) {
        return this.jobRepository.findByIdPopulatePermissions(id, options);
    }
    findByAnyPopulatePermissions(filter, options) {
        return this.jobRepository.findByAnyPopulatePermissions(filter, options);
    }
    findByAny(filter, options) {
        return this.jobRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.jobRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.jobRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.jobRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.jobRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.jobRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.jobRepository.exist(filter, options);
    }
}
exports.default = JobDAOService;
