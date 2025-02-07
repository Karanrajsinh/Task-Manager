import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'; 
import { projects, tasks, users } from '@/db/schema'; 
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

  if (evt.type === 'user.created') {
    // Extract user details correctly
    const { id, first_name, last_name, email_addresses } = evt.data 
  
    // Get primary email (first email in the array)
    const email = email_addresses.length > 0 ? email_addresses[0].email_address : null;
  
    if (!email) {
      console.error('Error: User does not have an email address.');
      return new Response('Error: Missing email address', { status: 400 });
    }
  
    // Insert user into DB
    await db.insert(users).values({
      id,
      email,
      name: `${first_name} ${last_name}`,
      password: '', // Default empty password
    });
  
    console.log('User created in DB:', evt.data);
  } else if (evt.type === 'user.updated') {
    // Extract user details correctly
    const { id, first_name, last_name, email_addresses } = evt.data
  
    // Get primary email (first email in the array)
    const email = email_addresses.length > 0 ? email_addresses[0].email_address : null;
  
    if (!email) {
      console.error('Error: User does not have an email address.');
      return new Response('Error: Missing email address', { status: 400 });
    }
  
    if (id) {
      await db.update(users)
        .set({ email, name: `${first_name} ${last_name}` })
        .where(eq(users.id, id));
  
      console.log('User updated in DB:', evt.data);
    } else {
      console.error('Error: User ID is undefined');
    }
  }else if (evt.type === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
      console.error('Error: User ID is undefined for deletion');
      return new Response('Error: Missing user ID', { status: 400 });
    }

    // Delete tasks associated with the user's projects
    await db.delete(tasks).where(eq(tasks.userId, id));

    // Delete projects associated with the user
    await db.delete(projects).where(eq(projects.userId, id));

    // Finally, delete the user
    await db.delete(users).where(eq(users.id, id));

    console.log(`User ${id} and all associated data deleted from DB`);
  }
  

  return new Response('Webhook received', { status: 200 });
}
