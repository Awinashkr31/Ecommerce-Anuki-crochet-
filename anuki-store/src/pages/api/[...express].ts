import app from '../../backend_express/server';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error('CRITICAL NEXT.JS API CRASH:', error);
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Express Crash' });
    } else {
      res.status(500).json({ error: 'Express Crash', details: error.message, stack: error.stack });
    }
  }
}
