import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const CheckBiometricAvailability = async () => {
  try {
    const resultObject = await rnBiometrics.isSensorAvailable();
    const { available, biometryType } = resultObject;

    if (available) {
      console.log(`Biometric Type: ${biometryType}`);
      const promptMessage = `Sign in using ${biometryType === BiometryTypes.FaceID ? 'Face ID' : 'Touch ID'}`;
      const signatureResult = await rnBiometrics.createSignature({
        promptMessage: promptMessage,
        payload: 'Your payload to be signed',
      });

      const { success, signature } = signatureResult;

      if (success) {
        console.log('Signature:', signature);
        return signature;
      } else {
        console.warn('Signature creation failed or was canceled');
        return null;
      }
    } else {
      console.log('Biometric authentication is not available on this device.');
      return null;
    }
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return null;
  }
};

export const createAndStoreKeyInKeychain = async () => {
  try {
    const resultObject = await rnBiometrics.createKeys();
    const { publicKey } = resultObject;

    // Store the keys securely in the Keychain
    await Keychain.setGenericPassword('lynk_dating_app_keypair', JSON.stringify({ publicKey }));

    return { publicKey };
  } catch (error) {
    console.error('Error creating and storing keys:', error);
    throw error;
  }
};

export const BiometricKeysExist = async () => {
  try {
    rnBiometrics.biometricKeysExist()
    .then((resultObject) => {
      const { keysExist } = resultObject;

      if (keysExist) {
        console.log('Biometric keys exist');
        // Perform actions related to the existence of biometric keys.
      } else {
        console.log('Biometric keys do not exist or were deleted');
        // Handle the case where biometric keys do not exist.
      }
    })
    .catch((error) => {
      console.error('Error checking biometric keys existence:', error);
    });
  } catch (error) {
    console.error('Error getting keys:', error);
    throw error;
  }}

  export const RetrieveKeys = async (identifier: string) => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: identifier });
  
      if (credentials) {
        const { publicKey, privateKey } = JSON.parse(credentials.password);
        console.log(`Keys for identifier ${identifier}:`, { publicKey, privateKey });
      } else {
        console.log(`No keys found for identifier ${identifier}.`);
      }
    } catch (error) {
      console.error(`Error retrieving keys for identifier ${identifier}:`, error);
    }
  };

  export const SimplePrompt = async () => {
    try {
      const resultObject = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' });
      const { success } = resultObject;
  
      if (success) {
        console.log('Successful biometrics provided');
      } else {
        console.log('User cancelled biometric prompt');
      }
    } catch (error) {
      console.error('Error with biometrics:', error);
    }
  };

  export const enrollBiometrics = async () => {
    try {
      // const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      // console.log(available, 'available')
      // if(available === null) return;
  
      // if (available) {
      //   const promptMessage = `Enroll using ${biometryType === 'FaceID' ? 'Face ID' : 'Touch ID'}`;
        const resultObject = await rnBiometrics.createKeys();

        await Keychain.setGenericPassword('lynk_dating_app_keypair', JSON.stringify(resultObject.publicKey));

        return {message: `Biometrics enrolled successfully: `, pubKey: resultObject.publicKey};
      // } else {
      //   console.log('Biometrics not available on this device.');
      // }
    } catch (error) {
      console.error('Error enrolling biometrics:', error);
    }
  };

  

  const TwoButtonAlert = () => 
        Alert.alert('Welcome To the app', 'Subscribe Now', [
            {
                text: 'Back',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            {
                text: 'OK',
                onPress: () => console.log('Ok Pressed')
            }
        ]);

  // const [isBiometricSupport, setIsBiometricSupport] = useState(false);

  //for face detecttion or fingerprint scan
  // useEffect(() => {
  //     (async () => {
  //         const compatible = await LocalAuthentication.hasHardwareAsync();
  //         setIsBiometricSupport(compatible);
  //     })();
  // });

  const fallBackToDefaultAuth = () => {
      console.log('fall back to password auth')
  }

  const alertComponent = (title: string, mess: string, btnTxt: string, btnFunc: any) => {
      return Alert.alert(title, mess, [
          {
              text: btnTxt,
              onPress: btnFunc
          }
      ]);
  };
  export const handleBiometricAuth = async () => {
      // check if hardware supports biometric
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

      //fallback to default aith method (pass) if biometric is not available
      if(!isBiometricAvailable)
          return alertComponent(
              'Please Enter Your Passwpord',
              'Biometric Auth not Supported',
              'Ok',
              () => fallBackToDefaultAuth()
          );

          // check biometric types available (fingerprint, facial, iris recognition)
          let supportedBiometrics: any;
          if(isBiometricAvailable)
              supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync()

          // check biometric are saved locally in users device
          const savedBiometrics = await LocalAuthentication.isEnrolledAsync()
          if(!savedBiometrics)
              return alertComponent(
                  'Biometric record not found',
                  'Please Login With Password',
                  'Ok',
                  () => fallBackToDefaultAuth()
              );

          //authenthenticate with biometric
          const biometricAuth = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Login with biometric',
              cancelLabel: 'cancel',
              disableDeviceFallback: true
          })

          //Log the user in on success
          if(biometricAuth) {TwoButtonAlert()}
          console.log(isBiometricAvailable)
          console.log(supportedBiometrics)
          console.log(savedBiometrics)
          console.log(biometricAuth)

  };
