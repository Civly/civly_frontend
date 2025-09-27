import z from 'zod';
import {encode} from 'html-entities';

export const experienceItemSchema = z
  .object({
    role: z.string().min(1, { message: "Role is required" }).transform((val) => {
            return val ? encode(val) : undefined;
        }),
    company: z.string().optional().transform((val) => {
            return val ? encode(val) : undefined;
        }),
    startDate: z
      .string()
      .min(1, { message: "Start date is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Start date must be a valid date (YYYY-MM-DD)",
      }),
    currentlyWorkingHere: z.boolean(),
    endDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "End date must be a valid date (YYYY-MM-DD)",
      }),
    location: z.string().optional().transform((val) => {
            return val ? encode(val) : undefined;
        }),
    description: z.string().optional().transform((val) => {
            return val ? encode(val) : undefined;
        }),
  })
  // Rule: endDate required unless currently working
  .refine((data) => data.currentlyWorkingHere || !!data.endDate, {
    message: "End date is required unless you are currently working here",
    path: ["endDate"],
  })
  // Rule: endDate must not be before startDate
  .refine(
    (data) =>
      !data.endDate || Date.parse(data.endDate) >= Date.parse(data.startDate),
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );

export type ExperienceItem = z.infer<typeof experienceItemSchema>;
