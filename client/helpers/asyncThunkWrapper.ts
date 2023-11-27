import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponseError } from '@app-interfaces';

export default function asyncThunkWrapper<Returned, Args>(
  prefix: string,
  handler: (args: Args, thunkAPI?: any) => Promise<any>,
) {
  return createAsyncThunk<Returned, Args, { rejectValue: ApiResponseError }>(prefix, async (args, thunkAPI) => {
    try {
      return await handler(args, thunkAPI);
    } catch (e: any | unknown) {
      if (e.response) return thunkAPI.rejectWithValue(e.response.data);
      return Promise.reject(e);
    }
  });
}
