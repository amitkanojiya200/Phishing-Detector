import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanHistoryContext = createContext();

export const useScanHistory = () => useContext(ScanHistoryContext);

export const ScanHistoryProvider = ({ children }) => {
  const [urlHistory, setUrlHistory] = useState([]);
  const [smsHistory, setSmsHistory] = useState([]);
  const [emailHistory, setEmailHistory] = useState([]);

  const loadHistory = async () => {
    const storedUrlHistory = await AsyncStorage.getItem('urlHistory');
    const storedSmsHistory = await AsyncStorage.getItem('smsHistory');
    const storedEmailHistory = await AsyncStorage.getItem('emailHistory');

    if (storedUrlHistory) setUrlHistory(JSON.parse(storedUrlHistory));
    if (storedSmsHistory) setSmsHistory(JSON.parse(storedSmsHistory));
    if (storedEmailHistory) setEmailHistory(JSON.parse(storedEmailHistory));
  };

  const saveHistory = async () => {
    await AsyncStorage.setItem('urlHistory', JSON.stringify(urlHistory));
    await AsyncStorage.setItem('smsHistory', JSON.stringify(smsHistory));
    await AsyncStorage.setItem('emailHistory', JSON.stringify(emailHistory));
  };

  const clearHistory = async () => {
    setUrlHistory([]);
    setSmsHistory([]);
    setEmailHistory([]);
    await AsyncStorage.removeItem('urlHistory');
    await AsyncStorage.removeItem('smsHistory');
    await AsyncStorage.removeItem('emailHistory');
  };

  return (
    <ScanHistoryContext.Provider
      value={{
        urlHistory,
        smsHistory,
        emailHistory,
        setUrlHistory,
        setSmsHistory,
        setEmailHistory,
        loadHistory,
        saveHistory,
        clearHistory,
      }}
    >
      {children}
    </ScanHistoryContext.Provider>
  );
};
