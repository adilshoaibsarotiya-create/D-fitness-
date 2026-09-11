import { z } from 'zod';

export const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid 10-digit mobile number')
    .max(15, 'Mobile number too long'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  subject: z
    .string()
    .trim()
    .min(2, 'Please select or provide a subject'),
  message: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const freeTrialFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid 10-digit mobile number')
    .max(15, 'Mobile number too long'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  goal: z
    .string()
    .min(1, 'Please select your fitness goal'),
  preferredDate: z
    .string()
    .min(1, 'Please select your preferred workout date'),
  preferredTime: z
    .string()
    .min(1, 'Please select your preferred session time'),
  message: z
    .string()
    .trim()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
});

export type FreeTrialFormData = z.infer<typeof freeTrialFormSchema>;

export const membershipFormSchema = z.object({
  fullName: z
    .string({ error: 'Please enter your full name' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  name: z
    .string()
    .optional(),
  phone: z
    .string({ error: 'Please enter your mobile phone number' })
    .trim()
    .min(10, 'Please enter a valid 10-digit mobile number')
    .max(15, 'Mobile number too long'),
  email: z
    .string({ error: 'Please enter your email address' })
    .trim()
    .email('Please enter a valid email address'),
  selectedPlan: z
    .string({ error: 'Please select a membership plan' })
    .min(1, 'Please select a membership plan'),
  startDate: z
    .string()
    .optional(),
  message: z
    .string()
    .trim()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
});

export type MembershipFormData = z.infer<typeof membershipFormSchema>;

export const trainerBookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid 10-digit mobile number')
    .max(15, 'Mobile number too long'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  trainerName: z
    .string()
    .min(1, 'Please select a coach'),
  preferredDate: z
    .string()
    .min(1, 'Please select a preferred date'),
  preferredTime: z
    .string()
    .min(1, 'Please select a preferred time slot'),
  fitnessGoal: z
    .string()
    .optional(),
  message: z
    .string()
    .trim()
    .max(500, 'Message cannot exceed 500 characters')
    .optional()
});

export type TrainerBookingFormData = z.infer<typeof trainerBookingSchema>;
