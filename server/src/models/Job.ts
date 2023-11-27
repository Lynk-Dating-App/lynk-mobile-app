import mongoose, { Document, Schema } from 'mongoose';

interface IJob {
    name: string;
    slug: string;
    status: string;
};

const jobSchema = new Schema<IJob>({
    name: { type: String },
    slug: { type: String },
    status: { type: String }
});

export interface IJobModel extends Document, IJob {}

const Job = mongoose.model<IJobModel>('Job', jobSchema as any);

export default Job;
