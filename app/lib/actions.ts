'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customer_id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customer_id, amount, status } = UpdateInvoice.parse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amout'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  console.log(amount);
  await sql`
    UPDATE invoices
    SET customer_id = ${customer_id}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}`;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
export async function createInvoice(formData: FormData) {
  const { customer_id, amount, status } = CreateInvoice.parse({
    customer_id: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customer_id}, ${amountInCents}, ${status}, ${date})`;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
