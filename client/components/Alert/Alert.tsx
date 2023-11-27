import { Alert } from 'react-native';

const AlertComponent = (title: string, mess: string, btnTxt: string, btnFunc: any) => {
    return Alert.alert(title, mess, [
        {
            text: btnTxt,
            onPress: btnFunc
        }
    ]);
};

export default AlertComponent;