import { CvData, cvDataSchema } from "../schema/cvDataSchema";

export function validateCV(cv: CvData){
    try {
        return cvDataSchema.parse(cv);
    } catch (error) {
        throw error;
    }
}