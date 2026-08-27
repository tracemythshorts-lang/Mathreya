import { Client, Account, Databases, Storage, Users } from 'node-appwrite';

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createAppwriteServerClient() {
  const client = new Client()
    .setEndpoint(getRequiredEnv('APPWRITE_ENDPOINT'))
    .setProject(getRequiredEnv('APPWRITE_PROJECT_ID'))
    .setKey(getRequiredEnv('APPWRITE_API_KEY'));

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
}