import z from "zod";
import { educationItemSchema } from "./education_schema";
import { experienceItemSchema } from "./experience_schema";
import { layoutConfigsSchema } from "./layout_schema";
import { personalInformationSchema } from "./personal_information_schema";
import { skillGroupSchema } from "./skills_schema";

export const cvDataSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1),
  userId: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  visibility: z.enum(["draft", "private", "public"]).optional(),
  password: z.string().optional(),
  // Subschemas
  layoutConfigs: layoutConfigsSchema,
  personalInformation: personalInformationSchema,
  experience: z.array(experienceItemSchema),
  education: z.array(educationItemSchema),
  skillGroups: z.array(skillGroupSchema),
});

export type CvData = z.infer<typeof cvDataSchema>;
