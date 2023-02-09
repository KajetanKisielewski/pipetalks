const useLocalStorage = (): UseLocalStorage => {
  const setLocalStorage = (signInResponse: SignInResponse): void =>
    window.localStorage.setItem('signInResponse', JSON.stringify(signInResponse));

  const getLocalStorage = (): SignInResponse =>
    JSON.parse(window.localStorage.getItem('signInResponse') as string);

  return { getLocalStorage, setLocalStorage };
};

export default useLocalStorage;
