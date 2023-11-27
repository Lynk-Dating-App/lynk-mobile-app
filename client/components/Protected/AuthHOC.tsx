import React, { useEffect, useState } from 'react';
import { getTokenFromSecureStore } from '../ExpoStore/SecureStore';
import settings from '../../config/settings';
import LoadingIndicator from '../LoadingIndicator';

const AuthHOC = (WrappedComponent: any) => {
  const AuthenticationWrapper = (props: any) => {
    const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          const jwtToken = await getTokenFromSecureStore(settings.auth.admin);
          setAuthenticated(!!jwtToken);
        } catch (error) {
          console.error('Error checking authentication:', error);
          setAuthenticated(false);
        }
      };

      checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
      // Still checking authentication, you can return a loading component or null
      return <LoadingIndicator />;
    }

    return <WrappedComponent isAuthenticated={isAuthenticated} {...props} />;
  };

  return AuthenticationWrapper;
};

export default AuthHOC;