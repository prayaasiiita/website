import { z } from 'zod';

export const hexColorSchema = z
  .string()
  .regex(/^#([0-9A-Fa-f]{6})$/, 'Invalid color hex');

export const tagCreateSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  color: hexColorSchema,
});

export type TagCreateInput = z.infer<typeof tagCreateSchema>;

export const empowermentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(160).trim(),
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(300, 'Short description must be at most 300 characters')
    .trim(),
  content: z.string().max(100000, 'Content too long').optional(),
  coverImageUrl: z.string().url('Invalid cover image URL').optional(),
  coverImageAlt: z.string().max(200).optional(),
  tagIds: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/)).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug')
    .toLowerCase(),
  metaTitle: z.string().max(160).optional(),
  metaDescription: z.string().max(200).optional(),
});

export type EmpowermentCreateInput = z.infer<typeof empowermentCreateSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
