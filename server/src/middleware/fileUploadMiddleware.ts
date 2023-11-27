import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';

export default function fileUploadMiddleware(options?: formidable.Options) {
  const form = formidable(options);

  return async function (req: Request, res: Response, next: NextFunction) {
    form.parse(req, async (err: any, fields: any, files: any) => {
      return new Promise((resolve, reject) => {
        if (err) return reject(err);

        req.fields = fields;
        req.files = files;

        resolve(next());
      });
    });

    next();
  };
}
