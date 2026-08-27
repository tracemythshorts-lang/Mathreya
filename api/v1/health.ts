import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAppwriteServerClient } from '../../lib/appwrite/server';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET requests are allowed.',
      },
    });
  }

  try {
    const { users } = createAppwriteServerClient();

    // Lightweight authenticated Appwrite request to verify backend connectivity.
    await users.list();

    return res.status(200).json({
      success: true,
      data: {
        service: 'mathreya-api',
        appwrite: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Appwrite health check failed:', error);

    return res.status(503).json({
      success: false,
      error: {
        code: 'APPWRITE_UNAVAILABLE',
        message: 'Unable to connect to backend services.',
      },
    });
  }
}

