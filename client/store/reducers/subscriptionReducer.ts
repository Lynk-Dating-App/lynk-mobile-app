import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import {
    getTransactionByRefAction,
    initTransactionAction,
    subscriptionAction
} from '../actions/subscriptionAction';

interface ISubState {
    subscribeStatus: IThunkAPIStatus;
    subscribeSuccess: string;
    subscribeError?: string;

    initializeTransactionStatus: IThunkAPIStatus;
    initializeTransactionSuccess: string;
    initializeTransactionError?: string;

    getTransactionStatus: IThunkAPIStatus;
    getTransactionSuccess: string;
    getTransactionError?: string;

    transaction: any;
};

const initialState: ISubState = {
    subscribeError: '',
    subscribeSuccess: '',
    subscribeStatus: 'idle',

    initializeTransactionError: '',
    initializeTransactionSuccess: '',
    initializeTransactionStatus: 'idle',

    getTransactionError: '',
    getTransactionSuccess: '',
    getTransactionStatus: 'idle',

    transaction: null
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        clearSubscribeStatus(state: ISubState) {
            state.subscribeStatus = 'idle';
            state.subscribeSuccess = '';
            state.subscribeError = '';
        },

        clearInitializetransactionStatus(state: ISubState) {
            state.initializeTransactionStatus = 'idle';
            state.initializeTransactionSuccess = '';
            state.initializeTransactionError = '';
        },

        clearGetTransactionStatus(state: ISubState) {
            state.getTransactionStatus = 'idle';
            state.getTransactionSuccess = '';
            state.getTransactionError = '';
        },
    },

    extraReducers: builder => {
        builder
            .addCase(subscriptionAction.pending, state => {
                state.subscribeStatus = 'loading';
            })
            .addCase(subscriptionAction.fulfilled, (state, action) => {
                state.subscribeStatus = 'completed';
                state.subscribeSuccess = action.payload.message;

                state.transaction = action.payload.result;
            })
            .addCase(subscriptionAction.rejected, (state, action) => {
                state.subscribeStatus = 'failed';

                if (action.payload) {
                state.subscribeError = action.payload.message;
                } else state.subscribeError = action.error.message;
            });

        builder
            .addCase(initTransactionAction.pending, state => {
                state.initializeTransactionStatus = 'loading';
            })
            .addCase(initTransactionAction.fulfilled, (state, action) => {
                state.initializeTransactionStatus = 'completed';
                state.initializeTransactionSuccess = action.payload.message;
            })
            .addCase(initTransactionAction.rejected, (state, action) => {
                state.initializeTransactionStatus = 'failed';

                if (action.payload) {
                state.initializeTransactionError = action.payload.message;
                } else state.initializeTransactionError = action.error.message;
            });

        builder
            .addCase(getTransactionByRefAction.pending, state => {
                state.getTransactionStatus = 'loading';
            })
            .addCase(getTransactionByRefAction.fulfilled, (state, action) => {
                state.getTransactionStatus = 'completed';
                state.getTransactionSuccess = action.payload.message;
            })
            .addCase(getTransactionByRefAction.rejected, (state, action) => {
                state.getTransactionStatus = 'failed';

                if (action.payload) {
                state.getTransactionError = action.payload.message;
                } else state.getTransactionError = action.error.message;
            });
    }
});

export const {
    clearSubscribeStatus,
    clearInitializetransactionStatus,
    clearGetTransactionStatus
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;