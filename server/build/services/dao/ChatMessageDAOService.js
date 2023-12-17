"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatMessageDAOService {
    chatMessageRepository;
    constructor(chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }
    //@ts-ignore
    insertMany(records) {
        return this.chatMessageRepository.bulkCreate(records);
    }
    create(values) {
        return this.chatMessageRepository.save(values);
    }
    findAll(filter, options) {
        return this.chatMessageRepository.findAll(filter, options);
    }
    findById(id, options) {
        return this.chatMessageRepository.findById(id, options);
    }
    findByIdPopulatePermissions(id, options) {
        return this.chatMessageRepository.findByIdPopulatePermissions(id, options);
    }
    findByAnyPopulatePermissions(filter, options) {
        return this.chatMessageRepository.findByAnyPopulatePermissions(filter, options);
    }
    findByAny(filter, options) {
        return this.chatMessageRepository.findOne(filter, options);
    }
    update(update, options) {
        return this.chatMessageRepository.update(update, { new: true, ...options });
    }
    updateByAny(filter, update, options) {
        return this.chatMessageRepository.updateByAny(filter, update, options);
    }
    deleteByAny(filter, options) {
        return this.chatMessageRepository.deleteByAny(filter, options);
    }
    deleteAll(options) {
        return this.chatMessageRepository.deleteAll(options);
    }
    deleteById(id, options) {
        return this.chatMessageRepository.deleteById(id, options);
    }
    exist(filter, options) {
        return this.chatMessageRepository.exist(filter, options);
    }
}
exports.default = ChatMessageDAOService;
