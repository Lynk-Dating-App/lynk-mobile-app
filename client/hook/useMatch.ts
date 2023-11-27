import { IMatch } from "@app-models"
import { useCallback, useEffect, useState } from "react"
import useAppDispatch from "./useAppDispatch";
import useAppSelector from "./useAppSelector";
import { getMatchesAction } from "../store/actions/userAction";
import { clearGetMatchesStatus } from "../store/reducers/userReducer";
import { getTokenFromSecureStore } from "../components/ExpoStore/SecureStore";
import settings from "../config/settings";
import { decode as base64Decode } from 'base-64';
import { useFocusEffect } from "expo-router";

export default function useMatch() {
    const [matches, setMatches] = useState<IMatch[]>([]);
    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    useFocusEffect(
        useCallback(() => {
          dispatch(getMatchesAction())
          return () => {
            // Clean up if necessary
            console.log('Screen is unfocused. Clean up if needed.');
          };
        }, [])
    );

    useEffect(() => {
        if(userReducer.getMatchesStatus === 'completed') {
            setMatches(userReducer.matches)
            dispatch(clearGetMatchesStatus())
        }
    },[userReducer.getMatchesStatus]);
    
    return {
        matches
    }
}