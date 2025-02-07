import { db } from './index';
import { users, projects, tasks } from './schema';
import { randomUUID, UUID } from 'crypto';

async function seed() {
  try {
    // Clear existing data
    await db.delete(tasks);
    await db.delete(projects);
    await db.delete(users);

    console.log('🗑️ Cleaned up existing data');

    // Create users
    // const user1Id = randomUUID();
    // const user2Id = randomUUID();

    // const insertedUsers = await db.insert(users).values([
    //   {
    //     id: user1Id as UUID,
    //     name: 'John Doe',
    //     email: 'john@example.com',
    //     password: '12346789',
    //   },
    //   {
    //     id: user2Id as UUID,
    //     name: 'Jane Smith',
    //     email: 'jane@example.com',
    //     password: '12346',
    //   },
    // ]).returning();

    // console.log('👥 Created users:', insertedUsers);

    // // Create projects
    // const insertedProjects = await db.insert(projects).values([
    //   {
    //     name: 'Project Alpha',
    //     description: 'First project for testing',
    //     userId: user1Id as UUID,
    //   },
    //   {
    //     name: 'Project Beta',
    //     description: 'Second project assigned to Jane',
    //     userId: user2Id as UUID,
    //   },
    // ]).returning();

    // console.log('📂 Created projects:', insertedProjects);

    // const projectAlphaId = insertedProjects[0].id;
    // const projectBetaId = insertedProjects[1].id;

    // // Create tasks with just the date
    // const insertedTasks = await db.insert(tasks).values([
    //   {
    //     title: 'Setup Project Alpha',
    //     description: 'Initialize repo, set up CI/CD pipeline',
    //     dueDate: new Date('2025-02-03'),
    //     priority: 'HIGH',
    //     projectId: projectAlphaId,
    //     userId: user1Id as UUID,
    //   },
    //   {
    //     title: 'Implement Authentication',
    //     description: 'Develop authentication using OAuth2',
    //     dueDate: new Date('2025-02-03'),
    //     priority: 'URGENT',

    //     projectId: projectAlphaId,
    //     userId: user1Id as UUID,
    //   },
    //   {
    //     title: 'Fix UI Bugs in Project Beta',
    //     description: 'Resolve layout issues in dashboard',
    //     dueDate: new Date('2025-02-04'),
    //     priority: 'MEDIUM',
    //     projectId: projectBetaId,
    //     userId: user2Id as UUID,
    //   },
    //   {
    //     title: 'Optimize Database Queries',
    //     description: 'Improve performance of SQL queries',
    //     dueDate: new Date('2025-02-05'),
    //     priority: 'HIGH',

    //     projectId: projectBetaId,
    //     userId: user2Id as UUID,
    //   },
    //   {
    //     title: 'Deploy Backend Services',
    //     description: 'Deploy microservices to production environment',
    //     dueDate: new Date('2025-03-10'),
    //     priority: 'HIGH',

    //     projectId: projectAlphaId,
    //     userId: user1Id as UUID,
    //   },
    //   {
    //     title: 'Refactor Codebase',
    //     description: 'Improve code readability and structure',
    //     dueDate: new Date('2025-03-10'),
    //     priority: 'MEDIUM',

    //     projectId: projectAlphaId,
    //     userId: user1Id as UUID,
    //   },
    //   {
    //     title: 'Write API Documentation',
    //     description: 'Document REST API endpoints',
    //     dueDate: new Date('2025-03-10'),
    //     priority: 'LOW',

    //     projectId: projectBetaId,
    //     userId: user2Id as UUID,
    //   },
    
    //   // April tasks
    //   {
    //     title: 'Implement Dark Mode',
    //     description: 'Add dark mode support to frontend',
    //     dueDate: new Date('2025-04-15'),
    //     priority: 'MEDIUM',

    //     projectId: projectAlphaId,
    //     userId: user1Id as UUID,
    //   },
    //   {
    //     title: 'Improve CI/CD Pipeline',
    //     description: 'Optimize build and deployment process',
    //     dueDate: new Date('2025-04-15'),
    //     priority: 'HIGH',

    //     projectId: projectBetaId,
    //     userId: user2Id as UUID,
    //   },
    //   {
    //     title: 'Integrate WebSockets',
    //     description: 'Enable real-time updates in chat feature',
    //     dueDate: new Date('2025-04-15'),
    //     priority: 'URGENT',

    //     projectId: projectBetaId,
    //     userId: user2Id as UUID,
    //   },        
    // ]).returning();

    // console.log('✅ Created tasks:', insertedTasks);

    console.log('🌱 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Failed to seed the database:', error);
  process.exit(1);
});