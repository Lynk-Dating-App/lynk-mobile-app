import { IThunkAPIStatus } from '@app-types';
import { createSlice } from '@reduxjs/toolkit';
import { 
    createCardAction, 
    deleteCardAction, 
    findDefaultCardAction, 
    findUserCardsAction, 
    updateCardAction 
} from '../actions/cardAction';

interface ICardState {
    createCardStatus: IThunkAPIStatus;
    createCardSuccess: string;
    createCardError?: string;

    updateCardStatus: IThunkAPIStatus;
    updateCardSuccess: string;
    updateCardError?: string;

    deleteCardStatus: IThunkAPIStatus;
    deleteCardSuccess: string;
    deleteCardError?: string;

    getDefaultCardStatus: IThunkAPIStatus;
    getDefaultCardSuccess: string;
    getDefaultCardError?: string;

    findUserCardsStatus: IThunkAPIStatus;
    findUserCardsSuccess: string;
    findUserCardsError?: string;
};

const initialState: ICardState = {
    createCardError: '',
    createCardSuccess: '',
    createCardStatus: 'idle',

    updateCardError: '',
    updateCardSuccess: '',
    updateCardStatus: 'idle',

    deleteCardError: '',
    deleteCardSuccess: '',
    deleteCardStatus: 'idle',

    getDefaultCardError: '',
    getDefaultCardSuccess: '',
    getDefaultCardStatus: 'idle',

    findUserCardsError: '',
    findUserCardsSuccess: '',
    findUserCardsStatus: 'idle',
};

const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        clearCreateCardStatus(state: ICardState) {
            state.createCardStatus = 'idle';
            state.createCardSuccess = '';
            state.createCardError = '';
        },
        clearUpdateCardStatus(state: ICardState) {
            state.updateCardStatus = 'idle';
            state.updateCardSuccess = '';
            state.updateCardError = '';
        },
        clearDeleteCardStatus(state: ICardState) {
            state.deleteCardStatus = 'idle';
            state.deleteCardSuccess = '';
            state.deleteCardError = '';
        },
        clearGetDefaultCardStatus(state: ICardState) {
            state.getDefaultCardStatus = 'idle';
            state.getDefaultCardSuccess = '';
            state.getDefaultCardError = '';
        },
        clearFindUserCardsStatus(state: ICardState) {
            state.findUserCardsStatus = 'idle';
            state.findUserCardsSuccess = '';
            state.findUserCardsError = '';
        },
    },

    extraReducers: builder => {
        builder
            .addCase(createCardAction.pending, state => {
                state.createCardStatus = 'loading';
            })
            .addCase(createCardAction.fulfilled, (state, action) => {
                state.createCardStatus = 'completed';
                state.createCardSuccess = action.payload.message;

                // state.transaction = action.payload.result;
            })
            .addCase(createCardAction.rejected, (state, action) => {
                state.createCardStatus = 'failed';

                if (action.payload) {
                state.createCardError = action.payload.message;
                } else state.createCardError = action.error.message;
            });

        builder
            .addCase(updateCardAction.pending, state => {
                state.updateCardStatus = 'loading';
            })
            .addCase(updateCardAction.fulfilled, (state, action) => {
                state.updateCardStatus = 'completed';
                state.updateCardSuccess = action.payload.message;

                // state.transaction = action.payload.result;
            })
            .addCase(updateCardAction.rejected, (state, action) => {
                state.updateCardStatus = 'failed';

                if (action.payload) {
                state.updateCardError = action.payload.message;
                } else state.updateCardError = action.error.message;
            });

        builder
            .addCase(deleteCardAction.pending, state => {
                state.deleteCardStatus = 'loading';
            })
            .addCase(deleteCardAction.fulfilled, (state, action) => {
                state.deleteCardStatus = 'completed';
                state.deleteCardSuccess = action.payload.message;

                // state.transaction = action.payload.result;
            })
            .addCase(deleteCardAction.rejected, (state, action) => {
                state.deleteCardStatus = 'failed';

                if (action.payload) {
                state.deleteCardError = action.payload.message;
                } else state.deleteCardError = action.error.message;
            });

        builder
            .addCase(findDefaultCardAction.pending, state => {
                state.getDefaultCardStatus = 'loading';
            })
            .addCase(findDefaultCardAction.fulfilled, (state, action) => {
                state.getDefaultCardStatus = 'completed';
                state.getDefaultCardSuccess = action.payload.message;

                // state.transaction = action.payload.result;
            })
            .addCase(findDefaultCardAction.rejected, (state, action) => {
                state.getDefaultCardStatus = 'failed';

                if (action.payload) {
                state.getDefaultCardError = action.payload.message;
                } else state.getDefaultCardError = action.error.message;
            });

        builder
            .addCase(findUserCardsAction.pending, state => {
                state.findUserCardsStatus = 'loading';
            })
            .addCase(findUserCardsAction.fulfilled, (state, action) => {
                state.findUserCardsStatus = 'completed';
                state.findUserCardsSuccess = action.payload.message;

                // state.transaction = action.payload.result;
            })
            .addCase(findUserCardsAction.rejected, (state, action) => {
                state.findUserCardsStatus = 'failed';

                if (action.payload) {
                state.findUserCardsError = action.payload.message;
                } else state.findUserCardsError = action.error.message;
            });
    }
});

export const {
    clearCreateCardStatus,
    clearDeleteCardStatus,
    clearFindUserCardsStatus,
    clearGetDefaultCardStatus,
    clearUpdateCardStatus
} = cardSlice.actions;

export default cardSlice.reducer;