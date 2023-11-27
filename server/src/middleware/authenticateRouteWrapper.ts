import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { appCommonTypes } from '../@types/app-common';
import AppLogger from '../utils/AppLogger';
import settings from '../config/settings';
import CustomJwtPayload = appCommonTypes.CustomJwtPayload;
import AsyncWrapper = appCommonTypes.AsyncWrapper;
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import VendorRepository from '../repositories/UserRepository';
import UserRepository from '../repositories/AdminRepository';

const vendorRepository = new VendorRepository();
const userRepository = new UserRepository();

const logger = AppLogger.init(authenticateRouteWrapper.name).logger;

export default function authenticateRouteWrapper(handler: AsyncWrapper) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const headers = req.headers;

    const authorization = headers.authorization;
    const key = settings.jwt.key;

    if (authorization) {
      if (!authorization.startsWith('Bearer')) {
        logger.error(`malformed authorization: 'Bearer' missing`);

        return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
      }

      const jwt = authorization.split(' ')[1].trim();

      const payload = verify(jwt, key) as CustomJwtPayload;

      req.permissions = payload.permissions;
      req.subscription = payload.subscription;
      req.jwt = jwt;
      
      if (payload.userId) {
        const { userId } = payload;

        const user = await userRepository.findById(userId);
        
        if (user) {
          req.user = user;
          
          return await handler(req, res, next);
        }

        const vendor = await vendorRepository.findById(userId);
        if (vendor) {
          req.user = vendor;

          return await handler(req, res, next);
        }
      }
    }

    return next(CustomAPIError.response(HttpStatus.UNAUTHORIZED.value, HttpStatus.UNAUTHORIZED.code));
  };
}
