import z from 'zod';
import {encode} from 'html-entities';
import { educationItemSchema } from "./educationItemSchema";
import { experienceItemSchema } from "./experienceItemSchema";
import { layoutConfigsSchema } from "./layoutSchema";
import { personalInformationSchema } from "./personalInformationSchema";
import { skillGroupSchema } from "./skillsSchema";

export const cvDataSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).optional().transform((val?: string) => {
              return val ? encode(val) : undefined;
          }),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  visibility: z.enum(["draft", "private", "public"]).optional(),
  password: z.string().optional(),
  // Subschemas
  layoutConfigs: layoutConfigsSchema.optional(),
  personalInformation: personalInformationSchema.optional(),
  experience: z.array(experienceItemSchema).optional(),
  education: z.array(educationItemSchema).optional(),
  skillGroups: z.array(skillGroupSchema).optional(),
});

export type CvData = z.infer<typeof cvDataSchema>;
