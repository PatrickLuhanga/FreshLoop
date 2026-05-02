// navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthSession } from '../services/authService';
import { SignOutContext, useSignOut } from '../context/SignOutContext';
import HomeUserNavigator from './HomeUserNavigator';
import LandingScreen from '../screens/auth/LandingScreen';
import GeneralUserLogin from '../screens/auth/GeneralUserLogin';
import OnboardSecurity from '../screens/auth/OnboardSecurity';
import BusinessLogin from '../screens/auth/BusinessLogin';
import NPOLogin from '../screens/auth/NPOLogin';
import BusinessUserNavigator from './BusinessUserNavigator';
import NPOUserNavigator      from './NPOUserNavigator';
import AdminUserNavigator    from './AdminUserNavigator';
import AdminLogin            from '../screens/auth/AdminLogin';

type RootScreen =
  | 'landing'
  | 'generalLogin'
  | 'businessLogin'
  | 'npoLogin'
  | 'adminLogin'
  | 'onboardSecurity'
  | 'homeUser'
  | 'business'
  | 'npo'
  | 'admin';

export { useSignOut };

export default function RootNavigator() {
  const { session, isLoading, setSession, signOut } = useAuth();
  const [screen, setScreen] = useState<RootScreen>('landing');
  const [pendingUserId, setPendingUserId] = useState('');

  // Restore persisted session on launch
  useEffect(() => {
    if (!isLoading && session) {
      if (session.role === 'home')     setScreen('homeUser');
      else if (session.role === 'business') setScreen('business');
      else if (session.role === 'npo')      setScreen('npo');
      else if (session.role === 'admin')    setScreen('admin');
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1C3A2E' }}>
        <ActivityIndicator size="large" color="#4ADE80" />
      </View>
    );
  }

  const handleSignOut = () => {
    signOut();
    setScreen('landing');
  };

  if (screen === 'landing') {
    return (
      <LandingScreen
        onContinue={(role: string) => {
          if (role === 'home')     setScreen('generalLogin');
          if (role === 'business') setScreen('businessLogin');
          if (role === 'npo')      setScreen('npoLogin');
          if (role === 'admin')    setScreen('adminLogin');
        }}
      />
    );
  }

  if (screen === 'adminLogin') {
    return (
      <AdminLogin
        onBack={() => setScreen('landing')}
        onSignIn={(s: AuthSession) => { setSession(s); setScreen('admin'); }}
      />
    );
  }

  if (screen === 'generalLogin') {
    return (
      <GeneralUserLogin
        onBack={() => setScreen('landing')}
        onSignIn={(s: AuthSession) => { setSession(s); setScreen('homeUser'); }}
        onRegister={(s: AuthSession) => {
          setSession(s);
          setPendingUserId(s.userId);
          setScreen('onboardSecurity');
        }}
      />
    );
  }

  if (screen === 'businessLogin') {
    return (
      <BusinessLogin
        onBack={() => setScreen('landing')}
        onSignIn={(s: AuthSession) => { setSession(s); setScreen('business'); }}
        onRegister={(s: AuthSession) => { setSession(s); setScreen('business'); }}
      />
    );
  }

  if (screen === 'npoLogin') {
    return (
      <NPOLogin
        onBack={() => setScreen('landing')}
        onSignIn={(s: AuthSession) => { setSession(s); setScreen('npo'); }}
        onRegister={(s: AuthSession) => { setSession(s); setScreen('npo'); }}
      />
    );
  }

  if (screen === 'onboardSecurity') {
    return (
      <OnboardSecurity
        userId={pendingUserId}
        onContinue={() => setScreen('homeUser')}
        onSkip={() => setScreen('homeUser')}
      />
    );
  }

  return (
    <SignOutContext.Provider value={handleSignOut}>
      <NavigationContainer>
        {screen === 'homeUser' && <HomeUserNavigator />}
        {screen === 'business' && <BusinessUserNavigator />}
        {screen === 'npo'      && <NPOUserNavigator />}
        {screen === 'admin'    && <AdminUserNavigator />}
      </NavigationContainer>
    </SignOutContext.Provider>
  );
}
