import { appModelTypes } from './app-model';
import Permission from '../models/Permission';
import type { Fields, Files } from 'formidable';
import type { Attributes } from 'sequelize';
import IncomingForm from 'formidable/Formidable';
import User from '../models/Admin';
import { Response, Request, NextFunction } from 'express';
 
import CheckList from '../models/CheckList';
import Transaction from '../models/Transaction';

export declare namespace appCommonTypes {
  import IPermission = appModelTypes.IPermission;

  type DatabaseEnv = 'development' | 'production' | 'test';
  type CheckListAnswerType = {
    id: string;
    answer: string;
    weight: string;
    color: string;
    selected?: boolean;
  };
  type CheckListQuestionType = {
    id: string;
    question: string;
    media: boolean;
    note?: boolean;
    images?: Array<IImageButtonData>;
    text?: string;
    answers: Array<CheckListAnswerType>;
  };
  type CheckListSectionType = {
    id: string;
    title: string;
    questions: Array<CheckListQuestionType>;
  };
  type CheckListType = Partial<Omit<CheckList, 'sections'>> & {
    sections: Array<CheckListSectionType>;
  };
  type Roles =
    | 'SUPER_ADMIN_ROLE'
    | 'USER_ROLE'
  type Permissions =
    | 'manage_all'
    | 'create_admin_user'
    | 'read_admin_user'
    | 'update_admin_user'
    | 'delete_admin_user'
    | 'user_permission'
    | 'create_user'
    | 'read_user'
    | 'update_user'
    | 'delete_user'
    | 'read_transaction'
    | 'fetch_permissions';

  type AuthPayload = {
    permissions: IPermission[];
    userId: number;
    partnerId?: number;
    rideShareDriverId?: number;
    customer?: number;
    pass?: string;
  };

  type CustomJwtPayload = JwtPayload & AuthPayload;

  type AppRequestParams = {
    customerId: string;
    appointmentId: string;
    driverId: string;
  };

  type QueueMailTypes = 'DEFAULT' | 'WEBSITE' | 'BOOKING' | 'CUSTOMER';
  type AnyObjectType = { [p: string]: any };

  interface DatabaseConfig {
    host?: string;
    username?: string;
    password?: string;
    port?: string;
    dialect?: string;
    database?: string;
  }

  interface AppSettings {
    termii: {
      host: string;
      key: string;
      from: string;
      message: string;
    };
    redis: Record<DatabaseEnv, DatabaseConfig>;
    mongo: Record<DatabaseEnv, DatabaseConfig>;
    queue: Record<DatabaseEnv, DatabaseConfig>;
    roles: Roles[];
    permissions: Permissions[];
    service: {
      port: string;
      env: string;
      apiRoot?: string;
    };
    jwt: { key: string; expiry: string };
    jwtAccessToken: { key: string; expiry: string };
    jwtRefreshToken: { key: string; expiry: string };
    twilio: {
      twilioSid: string;
      twilioAuthToken: string;
      phoneNumber: string;
    };
    paystack: {
      apiKey: string
    }
    nodemailer: {
      email: string;
      password: string;
      service: string;
    },
    googleOAuth: {
      google_client_id: string,
      google_client_secret: string,
      google_callbackURL: string
    },
    facebookAuth: {
      client_ID: string,
      client_secret: string,
      facebook_callbackURL: string
    },
    instagramAuth: {
      client_ID: string,
      client_secret: string,
      instagram_callbackURL: string
    },
    rabbitMq: {
      connection: string
    }
  }

  interface HttpResponse<T> {
    message: string;
    code: number;
    timestamp?: string;
    result?: T | null;
    results?: T[];
  }

  type AsyncWrapper = (req: Request, res: Response, next: NextFunction) => Promise<void>;

  interface RouteEndpointConfig {
    name: string;
    path: string;
    method: string;
    handler: AsyncWrapper;
    hasRole?: string;
    hasAuthority?: string;
    hasAnyRole?: string[];
    hasAnyAuthority?: string[];
  }

  type RouteEndpoints = RouteEndpointConfig[];

  interface RedisDataStoreOptions {
    PX: number | string; //Expiry date in milliseconds
  }

  interface BcryptPasswordEncoder {
    encode(rawPassword: string): Promise<string>;

    match(rawPassword: string, hash: string): Promise<boolean>;
  }

  interface QueueEvents {
    name: QueueMailTypes;
  }
}

declare global {
  namespace Express {
    export interface Request {
      files: Files;
      fields: Fields;
      permissions: Attributes<Permission>[];
      user: User;
      form: IncomingForm;
      jwt: string;
      subscription: any;
      jwtToken: string;
      data: string;
    }
  }
}
