import z from 'zod';
import {encode} from 'html-entities';

export const educationItemSchema = z
  .object({
    degree: z.string().min(1, { message: "Degree field is required" }).transform((val) => {
            return val ? encode(val) : undefined;
        }),
    institution: z.string().optional().transform((val) => {
            return val ? encode(val) : undefined;
        }),
    startDate: z
      .string()
      .min(1, { message: "Start date is required" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Start date must be a valid date (YYYY-MM-DD)",
      }),
    currentlyStudyingHere: z.boolean(),
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
  .refine(
    (data) => {
      if (!data.currentlyStudyingHere && !data.endDate) return false;
      return true;
    },
    {
      message: "End date is required unless you are currently studying here",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return Date.parse(data.endDate) >= Date.parse(data.startDate);
      }
      return true;
    },
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    }
  );

export type EducationItem = z.infer<typeof educationItemSchema>;
