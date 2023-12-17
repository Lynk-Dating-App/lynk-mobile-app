"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatDAOService {
    chatRepository;
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.chatRepository.bulkCreate(records);
    }
    create(values) {
        return this.chatRepository.save(values);
    }
    findAll(filter, options) {
        return this.chatRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.chatRepository.findById(id, options);
    }
    findByIdPopulatePermissions(id, options) {
        return this.chatRepository.findByIdPopulatePermissions(id, options);
    }
    findByAnyPopulatePermissions(filter, options) {
        return this.chatRepository.findByAnyPopulatePermissions(filter, options);
    }
    findByAny(filter, options) {
        return this.chatRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.chatRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.chatRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.chatRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.chatRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.chatRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.chatRepository.exist(filter, options);
    }
}
exports.default = ChatDAOService;
