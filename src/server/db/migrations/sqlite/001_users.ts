import { Kysely } from "kysely"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  // Create user table
  await db.schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('username', 'text', (col) => col.notNull().unique())
    .addColumn('displayUsername', 'text')
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('emailVerified', 'integer', (col) => col.notNull())
    .addColumn('image', 'text')
    .addColumn('createdAt', 'date', (col) => col.notNull())
    .addColumn('updatedAt', 'date', (col) => col.notNull())
    .execute()

  // Create session table
  await db.schema
    .createTable('session')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('expiresAt', 'date', (col) => col.notNull())
    .addColumn('token', 'text', (col) => col.notNull().unique())
    .addColumn('createdAt', 'date', (col) => col.notNull())
    .addColumn('updatedAt', 'date', (col) => col.notNull())
    .addColumn('ipAddress', 'text')
    .addColumn('userAgent', 'text')
    .addColumn('userId', 'text', (col) => 
      col.notNull().references('user.id'))
    .execute()

  // Create account table
  await db.schema
    .createTable('account')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('accountId', 'text', (col) => col.notNull())
    .addColumn('providerId', 'text', (col) => col.notNull())
    .addColumn('userId', 'text', (col) => 
      col.notNull().references('user.id'))
    .addColumn('accessToken', 'text')
    .addColumn('refreshToken', 'text')
    .addColumn('idToken', 'text')
    .addColumn('accessTokenExpiresAt', 'date')
    .addColumn('refreshTokenExpiresAt', 'date')
    .addColumn('scope', 'text')
    .addColumn('password', 'text')
    .addColumn('createdAt', 'date', (col) => col.notNull())
    .addColumn('updatedAt', 'date', (col) => col.notNull())
    .execute()

  // Create verification table
  await db.schema
    .createTable('verification')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('identifier', 'text', (col) => col.notNull())
    .addColumn('value', 'text', (col) => col.notNull())
    .addColumn('expiresAt', 'date', (col) => col.notNull())
    .addColumn('createdAt', 'date')
    .addColumn('updatedAt', 'date')
    .execute()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order to handle foreign key constraints
  await db.schema.dropTable('verification').execute()
  await db.schema.dropTable('account').execute()
  await db.schema.dropTable('session').execute()
  await db.schema.dropTable('user').execute()
}