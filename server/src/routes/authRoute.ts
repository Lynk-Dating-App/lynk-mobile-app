import { NextFunction, Request, Response } from "express";
import AuthenticationController from "../controller/AuthenticationController";
import PasswordEncoder from "../utils/PasswordEncoder";
import passport from "passport";
import Generic from "../utils/Generic";
import datasources from '../services/dao';
import settings, {
  HOME_URL,
  LOGIN_FAILED_URL,
  LOGIN_TOKEN,
  SIGN_IN_SUCCESS_URL
} from "../config/settings";

const passwordEncoder = new PasswordEncoder();
const authController = new AuthenticationController(passwordEncoder);

export const signupUserBlackHandler = async (req: Request, res: Response) =>  {
    const response = await authController.signupUser_black(req);

    res.status(response.code).json(response);
};

export const signupUserRedHandler = async (req: Request, res: Response) =>  {
  const response = await authController.subscribeAndSignUp_red(req);

  res.status(response.code).json(response);
};

export const signupUserPurpleHandler = async (req: Request, res: Response) =>  {
  const response = await authController.subscribeAndSignUp_purple(req);

  res.status(response.code).json(response);
};

export const signInHandler_Admin = async (req: Request, res: Response) => {
    const response = await authController.admin_login(req);

    res.status(response.code).json(response)
};

export const signInHandler_User = async (req: Request, res: Response) => {
    const response = await authController.sign_in_user(req);

    res.status(response.code).json(response)
};

export const googleOAuthHandler = (passport.authenticate("google", { scope: ["email", "profile"] }))

export const googleOAutCallbackhHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/error' }, async (err: any, userId: any, newReg: any) => {
    if (err) {
      const error = 'An error occurred. Please try again'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL);
    }
    if (!userId) {
      const error = 'User not authenticated. Please try again'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL);
    }

    const user = await datasources.userDAOService.findById(userId);

    if(!user?.active) {
      const error = 'Account is disabled. Please contact the administrator.'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL)
    }
    const role = newReg.newReg
                  ? await datasources.roleDAOService.findByAnyPopulatePermissions({
                      slug: settings.roles[1],
                    })
                  : await datasources.roleDAOService.findByIdPopulatePermissions(user.role)

    if(user) {
      //generate JWT
      const _jwt = Generic.generateJwt({
        userId: user._id,
        isExpired: user.isExpired,
        permissions: role?.permissions,
        subscription: {
          plan: user.subscription.plan,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate
        }
      });
      res.cookie(LOGIN_TOKEN, _jwt);

      const updateValues = {
        loginDate: new Date(),
        loginToken: _jwt
      };
  
      await datasources.userDAOService.update({_id: user._id}, updateValues);
    };

    return res.redirect(newReg.newReg === false ? HOME_URL : SIGN_IN_SUCCESS_URL);
  })(req, res, next);
};

export const facebookOAuthHandler = (passport.authenticate("facebook", { scope: ["profile"] }))

export const facebookOAutCallbackhHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/error' }, async (err: any, userId: any, newReg: any) => {
    if (err) {
      const error = 'An error occurred. Please try again'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL);
    }
    if (!userId) {
      const error = 'User not authenticated. Please try again'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL);
    }

    const user = await datasources.userDAOService.findById(userId);

    if(!user?.active) {
      const error = 'Account is disabled. Please contact the administrator.'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL)
    }
    const role = newReg.newReg
                  ? await datasources.roleDAOService.findByAnyPopulatePermissions({
                      slug: settings.roles[1],
                    })
                  : await datasources.roleDAOService.findByIdPopulatePermissions(user.role)

    if(user) {
      //generate JWT
      const _jwt = Generic.generateJwt({
        userId: user._id,
        isExpired: user.isExpired,
        permissions: role?.permissions,
        subscription: {
          plan: user.subscription.plan,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate
        }
      });
      res.cookie(LOGIN_TOKEN, _jwt);

      const updateValues = {
        loginDate: new Date(),
        loginToken: _jwt
      };
  
      await datasources.userDAOService.update({_id: user._id}, updateValues);
    };

    return res.redirect(newReg.newReg === false ? HOME_URL : SIGN_IN_SUCCESS_URL);
  })(req, res, next);
};

export const instagramOAuthHandler = (passport.authenticate("instagram", { scope: ["profile"] }))

export const instagramOAutCallbackhHandler = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/error' }, async (err: any, userId: any, newReg: any) => {
    if (err) {
      const error = 'An error occurred. Please try again'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL);
    }
    if (!userId) {
      const error = 'User not authenticated. Please try again'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL);
    }

    const user = await datasources.userDAOService.findById(userId);

    if(!user?.active) {
      const error = 'Account is disabled. Please contact the administrator.'
      res.cookie('loginError', error)
      return res.redirect(LOGIN_FAILED_URL)
    }
    const role = newReg.newReg
                  ? await datasources.roleDAOService.findByAnyPopulatePermissions({
                      slug: settings.roles[1],
                    })
                  : await datasources.roleDAOService.findByIdPopulatePermissions(user.role)

    if(user) {
      //generate JWT
      const _jwt = Generic.generateJwt({
        userId: user._id,
        isExpired: user.isExpired,
        permissions: role?.permissions,
        subscription: {
          plan: user.subscription.plan,
          startDate: user.subscription.startDate,
          endDate: user.subscription.endDate
        }
      });
      res.cookie(LOGIN_TOKEN, _jwt);

      const updateValues = {
        loginDate: new Date(),
        loginToken: _jwt
      };
  
      await datasources.userDAOService.update({_id: user._id}, updateValues);
    };

    return res.redirect(newReg.newReg === false ? HOME_URL : SIGN_IN_SUCCESS_URL);
  })(req, res, next);
};

export const loginFailedHandler = async (req: Request, res: Response) => {
  const response = await authController.loginFailed(req, res);

  res.status(response.code).json(response)
}
