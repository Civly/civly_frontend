import z from 'zod';
import {encode} from 'html-entities';

export const personalInformationSchema = z.object({
  name: z.string().min(1, { message: "First name is required" }).transform((val: string) => {
            return val ? encode(val) : undefined;
        }),
  surname: z.string().min(1, { message: "Surname is required" }).transform((val: string) => {
            return val ? encode(val) : undefined;
        }),

  profileUrl: z.string().optional().transform((val?: string) => {
            return val ? encode(val) : undefined;
        }),

  birthdate: z
    .string()
    .min(1, { message: "Birthdate is required" })
    .refine((val: string) => !isNaN(Date.parse(val)), {
      message: "Birthdate must be a valid ISO date (YYYY-MM-DD)",
    }),

  email: z
    .email({ message: "Email must be a valid address" })
    .optional()
    .or(z.literal("")),

  phone: z.string().optional().transform((val?: string) => {
            return val ? encode(val) : undefined;
        }),

  location: z.string().optional().transform((val?: string) => {
            return val ? encode(val) : undefined;
        }),

  linkedin: z
    .url({ message: "LinkedIn must be a valid URL" })
    .optional()
    .or(z.literal("")),

  xing: z
    .url({ message: "Xing must be a valid URL" })
    .optional()
    .or(z.literal("")),

  website: z
    .url({ message: "Website must be a valid URL" })
    .optional()
    .or(z.literal("")),

  professionalTitle: z.string().optional().transform((val?: string) => {
            return val ? encode(val) : undefined;
        }),

  summary: z
    .string()
    .max(2000, {
      message: "Summary must not exceed 2000 characters",
    })
    .optional().transform((val?: string) => {
            return val ? encode(val) : undefined;
        }),
});

export type PersonalInformation = z.infer<typeof personalInformationSchema>;
