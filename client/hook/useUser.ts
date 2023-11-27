import { useCallback, useEffect, useState } from "react"
import useAppDispatch from "./useAppDispatch";
import { getTokenFromSecureStore } from "../components/ExpoStore/SecureStore";
import settings from "../config/settings";
import { getLoggedInUserAction } from "../store/actions/userAction";
import useAppSelector from "./useAppSelector";
import { clearGetLoggedInUserStatus } from "../store/reducers/userReducer";
import { useFocusEffect } from "expo-router";

export default function useUser() {
    const [user, setUser] = useState<any | null>(null);
    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          try {
            const data = await getTokenFromSecureStore(settings.auth.admin);
            if (data) {
                
                // const payloadBase64 = data.split('.')[1];
                // const decodedPayload = base64Decode(payloadBase64);
                // const decodedPayloadJSON = JSON.parse(decodedPayload);

                dispatch(getLoggedInUserAction())

            }
          } catch (error) {
            console.error(error);
            // Handle the error (e.g., show an error message)
          }
        };
    
        fetchData();
      }, [])
    );

    useEffect(() => {
        if(userReducer.getLoggedInUserStatus === 'completed') {
            setUser(userReducer.loggedInuser)
            dispatch(clearGetLoggedInUserStatus())
        }
    })

    return {
      user
    }
}