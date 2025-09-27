import z from 'zod';

export const layoutConfigsSchema = z
  .object({
    templateId: z.number().int().nonnegative(),
    colorId: z.number().int().nonnegative(),
    fontId: z.number().int().nonnegative(),
    fontSizeId: z.number().int().nonnegative(),
  })

export type LayoutConfigs = z.infer<typeof layoutConfigsSchema>;
