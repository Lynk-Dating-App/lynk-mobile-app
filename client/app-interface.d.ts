declare module '@app-interfaces' {
    import React from 'react';
    import { JwtPayload } from 'jsonwebtoken';
    import { IPermission } from '@app-models';

    export interface IComponentErrorState {
        hasError: boolean;
        errorMessage: string;
    }

    interface ApiResponseSuccess<T> {
        message: string;
        code: number;
        timestamp?: string;
        result?: T;
        results?: T[];
        tokens?: {
            jwt: string;
        }
    }

    interface ApiResponseError {
        message: string;
        code: number;
    }

    interface HttpResponse<T> {
        message: string;
        code: number;
        timestamp?: string;
        result?: T | null;
        results?: T[];
    }

    type CustomJwtPayload = JwtPayload & {
        permissions: IPermission[];
        userId: number;
        isExpired: boolean;
        level: 1;
        subscription: any
        [p: string]: any;
    }
}