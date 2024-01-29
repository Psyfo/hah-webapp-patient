import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { IPatient } from '../components/patient/patient.interface';
import { PatientModel } from '../components/patient/patient.model';

// auth.middleware.ts

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Replace with your actual secret key
    },
    async (jwtPayload, done) => {
      try {
        const patient: IPatient | null = await PatientModel.findById(
          jwtPayload.sub
        );

        if (!patient) {
          return done(null, false);
        }

        return done(null, patient);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('jwt', { session: false }, (err: any, patient: any) => {
    if (err || !patient) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = patient;
    next();
  })(req, res, next);
};
