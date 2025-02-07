import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'; // Your database connection
import { users } from '@/db/schema'; // Import the Drizzle schema
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Handle the event based on type (user.created, user.updated, user.deleted)
  if (evt.type === 'user.created') {
    // Create new user in the database
    const { id, email, name } = evt.data as unknown as { id: string; email: string; name: string };
    await db.insert(users).values({
      id, 
      email, 
      name,
      password: '', // Set default or empty password as it's not coming from Clerk
    });
    console.log('User created in DB:', evt.data);
  } else if (evt.type === 'user.updated') {
    // Update the user data in the database
    const { id, email, name } = evt.data as unknown as { id: string; email: string; name: string };
    if (id) {
        await db.update(users)
        .set({ email, name })
        .where(eq(users.id,id));
      } else {
        console.error('Error: User ID is undefined');
      }
      console.log('User updated from DB:', id);
   
    console.log('User updated in DB:', evt.data);
  } else if (evt.type === 'user.deleted') {
    // Delete the user from the database
    const { id } = evt.data;
    if (id) {
      await db.delete(users).where(eq(users.id, id));
    } else {
      console.error('Error: User ID is undefined');
    }
    console.log('User deleted from DB:', id);
  }

  return new Response('Webhook received', { status: 200 });
}
