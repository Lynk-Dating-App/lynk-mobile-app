import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString()
let payload = epochTimeSeconds + 'some message'


rnBiometrics.isSensorAvailable()
  .then((resultObject) => {
    const { available, biometryType } = resultObject;

    if (available) {
      console.log(`Biometric Type: ${biometryType}`);

      // Depending on the biometric type, you might customize the prompt message
      const promptMessage = `Sign in using ${biometryType === BiometryTypes.FaceID ? 'Face ID' : 'Touch ID'}`;

      // Use createSignature to generate a signature
      rnBiometrics.createSignature({
        promptMessage: promptMessage,
        payload: 'Your payload to be signed',
      })
        .then((resultObject) => {
          const { success, signature } = resultObject;

          if (success) {
            console.log('Signature:', signature);
            // Now you can send the signature to the server for verification
            // verifySignatureWithServer(signature, payload);
          } else {
            console.warn('Signature creation failed or was canceled');
            // Handle failure or cancellation
          }
        })
        .catch((error) => {
          console.error('Error creating signature:', error);
          // Handle error
        });
    } else {
      console.log('Biometric authentication is not available on this device.');
    }
  })
  .catch((error) => {
    console.error('Error checking biometric availability:', error);
  });


rnBiometrics.isSensorAvailable()
  .then((resultObject) => {
    const { available, biometryType } = resultObject

    if (available && biometryType === BiometryTypes.TouchID) {
      console.log('TouchID is supported')
    } else if (available && biometryType === BiometryTypes.FaceID) {
      console.log('FaceID is supported')
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      console.log('Biometrics is supported')
    } else {
      console.log('Biometrics not supported')
    }
  })

  rnBiometrics.createKeys()
    .then((resultObject) => {
      const { publicKey } = resultObject
      console.log(publicKey)
      // sendPublicKeyToServer(publicKey)
    })

  rnBiometrics.biometricKeysExist()
  .then((resultObject) => {
    const { keysExist } = resultObject

    if (keysExist) {
      console.log('Keys exist')
    } else {
      console.log('Keys do not exist or were deleted')
    }
  })

  rnBiometrics.deleteKeys()
  .then((resultObject) => {
    const { keysDeleted } = resultObject

    if (keysDeleted) {
      console.log('Successful deletion')
    } else {
      console.log('Unsuccessful deletion because there were no keys to delete')
    }
  })

  rnBiometrics.createSignature({
    promptMessage: 'Sign in',
    payload: payload
  })
  .then((resultObject) => {
    const { success, signature } = resultObject

    if (success) {
      console.log(signature)
      // verifySignatureWithServer(signature, payload)
    }
  })

  //**NOTE: This only validates a user's biometrics. This should not 
  //be used to log a user in or authenticate with a server, instead use 
  //createSignature. It should only be used to gate certain user actions within an app.
  rnBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
  .then((resultObject) => {
    const { success } = resultObject

    if (success) {
      console.log('successful biometrics provided')
    } else {
      console.log('user cancelled biometric prompt')
    }
  })
  .catch(() => {
    console.log('biometrics failed')
  })