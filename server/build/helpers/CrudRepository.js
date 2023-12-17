"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrudRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async bulkCreate(records) {
        //@ts-ignore
        return this.model.insertMany(records);
    }
    async save(values, options) {
        const result = await this.model.create([values], options);
        return result[0];
    }
    async findAll(filter, options) {
        let query = filter ? this.model.find(filter) : this.model.find({}, options);
        if (options?.search && options?.searchFields) {
            const searchRegex = new RegExp(options?.search, 'i');
            const searchConditions = options.searchFields.map((field) => ({ [field]: searchRegex }));
            query = query.find({ $or: searchConditions });
        }
        // Sorting
        if (options?.sort) {
            query.sort(options.sort);
        }
        else {
            query.sort({ createdAt: -1 });
        }
        // Limiting
        if (options?.limit) {
            query.limit(options.limit);
        }
        return query.exec();
    }
    async findById(id, options) {
        return this.model.findById(id, null, options).exec();
    }
    async findByIdPopulatePermissions(id, options) {
        return this.model.findById(id, null, options).populate({ path: 'permissions', options: { strictPopulate: false } }).exec();
    }
    async findByAnyPopulatePermissions(filter, options) {
        return this.model.findOne(filter, null, options).populate({ path: 'permissions', options: { strictPopulate: false } }).exec();
    }
    async findOne(filter, options) {
        return this.model.findOne(filter, null, options).exec();
    }
    async update(update, options) {
        return this.model.updateOne(update, { new: true, ...options }).exec();
    }
    async updateByAny(filter, update, options) {
        return this.model.findOneAndUpdate(filter, update, { new: true, ...options }).exec();
    }
    async deleteByAny(filter, options) {
        await this.model.deleteOne(filter, options);
    }
    async deleteAll(options) {
        await this.model.deleteMany({}, options);
    }
    async deleteById(id, options) {
        await this.model.findByIdAndDelete(id, options);
    }
    async exist(filter, options) {
        const count = await this.model.countDocuments(filter, options).exec();
        return count > 0;
    }
}
exports.default = CrudRepository;
