import app from '../../backend_express/server';

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  console.log('Next.js API Handler URL:', req.url);
  return app(req, res);
}
