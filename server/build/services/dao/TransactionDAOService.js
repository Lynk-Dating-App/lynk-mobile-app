"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TransactionDAOService {
    transactionRepository;
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.transactionRepository.bulkCreate(records);
    }
    create(values) {
        return this.transactionRepository.save(values);
    }
    findAll(filter, options) {
        return this.transactionRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.transactionRepository.findById(id, options);
    }
    findByAny(filter, options) {
        return this.transactionRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.transactionRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.transactionRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.transactionRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.transactionRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.transactionRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.transactionRepository.exist(filter, options);
    }
}
exports.default = TransactionDAOService;
