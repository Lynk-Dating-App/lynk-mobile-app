import { IUserChats } from "@app-models";
import { useEffect, useMemo, useState } from "react";
import useAppDispatch from "./useAppDispatch";
import useAppSelector from "./useAppSelector";
import { getUserAction } from "../store/actions/userAction";
import { clearGetUserStatus, setChatUsers } from "../store/reducers/userReducer";

interface IProps {
    chat: IUserChats,
    user: any
}

export default function useFetchChat ({chat, user}: IProps) {
    const [recipientUser, setRecipientUser] = useState<any>(null);
    const [error, setError] = useState(null);

    const dispatch = useAppDispatch();
    const userReducer = useAppSelector(state => state.userReducer);

    // const recipientId = chat?.members.find(id => id !== user?._id);
    const recipientId = useMemo(() => chat?.members?.find((id: string) => id !== user?._id), [chat, user]);
    
    // useEffect(() => {
    //     dispatch(getUserAction(recipientId))
    // },[recipientId]);

    // useEffect(() => {
    //     if(userReducer.getUserStatus === 'completed') {
    //         dispatch(setChatUsers(userReducer.user))
    //         setRecipientUser(userReducer.user)
    //         dispatch(clearGetUserStatus())
    //     } else if(userReducer.getUserStatus === 'failed') {
    //         setError(userReducer.getUserError)
    //         dispatch(clearGetUserStatus())
    //     }
    // },[userReducer.getUserStatus]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Dispatch the getUserAction and wait for it to complete
            await dispatch(getUserAction(recipientId));
    
            // Check the status after the dispatch is complete
            if (userReducer.getUserStatus === "completed") {
              setRecipientUser(userReducer.user);
            } else if (userReducer.getUserStatus === "failed") {
              setError(userReducer.getUserError);
            }
    
            // Clear the getUserStatus
            dispatch(clearGetUserStatus());
          } catch (error) {
            setError(error.message);
            dispatch(clearGetUserStatus());
          }
        };
    
        // Fetch data only when recipientId changes
        if (recipientId) {
          fetchData();
        }
        
      }, [recipientId]);

    return {
        recipientUser,
        error, recipientId
    }
}