declare module '@app-types' {
  type IThunkAPIStatus = 'idle' | 'loading' | 'completed' | 'failed';
  type CallableFunction = () => void;
  type CustomHookMessage = { message: string | undefined };
  type AnyObjectType = { [t: string]: any };
}