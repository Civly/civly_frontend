import z from 'zod'
import {encode} from 'html-entities';

export const skillGroupItemSchema = z.object({
  order: z
    .number()
    .int({ message: "Order must be an integer" })
    .nonnegative({ message: "Order must be zero or positive" }),
  name: z
    .string()
    .min(1, { message: "Skill name is required" })
    .max(20, { message: "Skill name must not exceed 20 characters" }).transform((val) => {
            return val ? encode(val) : undefined;
        }),
});

export const skillGroupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Skill group name is required" })
    .max(20, { message: "Skill group name must not exceed 20 characters" }).transform((val) => {
            return val ? encode(val) : undefined;
        }),
  order: z
    .number()
    .int({ message: "Order must be an integer" })
    .nonnegative({ message: "Order must be zero or positive" }),
  skills: z
    .array(skillGroupItemSchema)
    .min(1, { message: "Each group must have at least one skill" }),
});

export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type SkillGroupItem = z.infer<typeof skillGroupItemSchema>;
