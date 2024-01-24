import moment from 'moment';
import { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.config';

const LoggerMiddleware = {
  reqLog(req: Request, res: Response, next: NextFunction) {
    logger.warn('========== REQ LOG START ==========');
    logger.info(
      `${req.protocol}://${req.get('host')}${
        req.originalUrl
      }: ${moment().format()}`
    );
    logger.info(`body: ${JSON.stringify(req.body)}`);
    logger.info(`params: ${JSON.stringify(req.params)}`);
    logger.info(`path: ${JSON.stringify(req.path)}`);
    logger.info(`query: ${JSON.stringify(req.query)}`);
    logger.warn('========== REQ LOG END ==========');
    next();
  },
};

export { LoggerMiddleware };
