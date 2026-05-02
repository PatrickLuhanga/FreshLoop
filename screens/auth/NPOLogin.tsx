// screens/auth/NPOLogin.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  registerNPO,
  signInUser,
  AuthSession,
} from '../../services/authService';

type Tab = 'signin' | 'register';

const ACCENT = '#FB923C';

function FieldLabel({ label }: { label: string }) {
  return (
    <Text style={{
      fontSize: 11, fontWeight: '700', color: '#94A3B8',
      letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7,
    }}>
      {label}
    </Text>
  );
}

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  placeholder: string;
  value?: string;
  onChangeText?: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0',
      paddingHorizontal: 14, height: 50, marginBottom: 14,
      shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
    }}>
      <Feather name={icon} size={16} color="#94A3B8" style={{ marginRight: 10 }} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#CBD5E1"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(p => !p)}>
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={16} color="#94A3B8"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

function UploadCard({
  icon,
  title,
  sub,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  sub: string;
}) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setUploaded(p => !p)}
      activeOpacity={0.75}
      style={{
        backgroundColor: uploaded ? 'rgba(251,146,60,0.06)' : '#F8FAFC',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: uploaded ? 'rgba(251,146,60,0.4)' : '#E2E8F0',
        borderStyle: uploaded ? 'solid' : 'dashed',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 14,
      }}
    >
      <View style={{
        width: 44, height: 44, borderRadius: 13,
        backgroundColor: uploaded ? 'rgba(251,146,60,0.12)' : '#F1F5F9',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Feather
          name={uploaded ? 'check-circle' : icon}
          size={20}
          color={uploaded ? ACCENT : '#94A3B8'}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontWeight: '700', fontSize: 13,
          color: uploaded ? ACCENT : '#1E293B',
          marginBottom: 2,
        }}>
          {uploaded ? 'Uploaded ✓' : title}
        </Text>
        <Text style={{ fontSize: 11, color: '#94A3B8' }}>{sub}</Text>
      </View>
      {!uploaded && (
        <Feather name="upload" size={15} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );
}

function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: '#FEF2F2', borderRadius: 10,
      borderWidth: 1, borderColor: '#FECACA',
      padding: 10, marginBottom: 12,
    }}>
      <Feather name="alert-circle" size={14} color="#EF4444" />
      <Text style={{ flex: 1, color: '#EF4444', fontSize: 12, fontWeight: '500' }}>
        {message}
      </Text>
    </View>
  );
}

export default function NPOLogin({
  onSignIn,
  onRegister,
  onBack,
}: {
  onSignIn: (session: AuthSession) => void;
  onRegister: (session: AuthSession) => void;
  onBack?: () => void;
}) {
  const [tab,         setTab]         = useState<Tab>('signin');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [orgName,     setOrgName]     = useState('');
  const [regNumber,   setRegNumber]   = useState('');
  const [phone,       setPhone]       = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [agreeTerms,  setAgreeTerms]  = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const handleSignIn = async () => {
    setError('');
    setLoading(true);
    const result = await signInUser(email, password, 'npo');
    setLoading(false);
    if (!result.success) { setError(result.error ?? 'Sign in failed.'); return; }
    onSignIn(result.session!);
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    const result = await registerNPO({ orgName, regNumber, email, phone, password, confirmPass });
    setLoading(false);
    if (!result.success) { setError(result.error ?? 'Registration failed.'); return; }
    onRegister(result.session!);
  };

  const switchTab = (t: Tab) => { setTab(t); setError(''); };

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>
      <StatusBar barStyle="light-content" backgroundColor="#1C3A2E" />

      {/* ── Dark header ── */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#1C3A2E' }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <View style={{
              width: 38, height: 38, borderRadius: 11, overflow: 'hidden',
              borderWidth: 1.5, borderColor: 'rgba(134,239,172,0.3)', marginRight: 10,
            }}>
              <Image
                source={require('../../assets/Logo.jpeg')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', letterSpacing: -0.5 }}>
              Fresh<Text style={{ color: '#4ADE80' }}>Loop</Text>
            </Text>
          </TouchableOpacity>

          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(251,146,60,0.12)',
            borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5,
            borderWidth: 1, borderColor: 'rgba(251,146,60,0.25)',
          }}>
            <Feather name="heart" size={12} color={ACCENT} />
            <Text style={{ color: ACCENT, fontSize: 11, fontWeight: '700' }}>
              NPO / Coordinator
            </Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)' }} />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Welcome text ── */}
        <View style={{ marginBottom: 24, marginTop: 4 }}>
          <Text style={{
            color: '#1E293B', fontSize: 24,
            fontWeight: '800', letterSpacing: -0.5,
          }}>
            {tab === 'signin' ? 'Welcome back 🤝' : 'Register your NPO'}
          </Text>
          <Text style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>
            {tab === 'signin'
              ? 'Sign in to manage donations and coordinate pickups.'
              : 'Join FreshLoop to connect your organisation with surplus food donors.'}
          </Text>
        </View>

        {/* ── Tab switcher ── */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,0.06)',
          borderRadius: 14, padding: 3,
          marginBottom: 20,
        }}>
          {(['signin', 'register'] as Tab[]).map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => switchTab(t)}
              activeOpacity={0.8}
              style={{
                flex: 1, paddingVertical: 10, borderRadius: 12,
                alignItems: 'center',
                backgroundColor: tab === t ? '#fff' : 'transparent',
                shadowColor: tab === t ? '#000' : 'transparent',
                shadowOpacity: tab === t ? 0.06 : 0,
                shadowRadius: 4,
                elevation: tab === t ? 2 : 0,
              }}
            >
              <Text style={{
                fontWeight: '700', fontSize: 13,
                color: tab === t ? '#1C3A2E' : '#94A3B8',
              }}>
                {t === 'signin' ? 'Sign In' : 'Register NPO'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Form card ── */}
        <View style={{
          backgroundColor: '#fff', borderRadius: 22,
          padding: 20, marginBottom: 16,
          shadowColor: '#000', shadowOpacity: 0.05,
          shadowRadius: 10, elevation: 2,
        }}>

          {tab === 'signin' ? (
            <>
              <FieldLabel label="Organisation Email" />
              <InputField
                icon="mail" placeholder="info@yournpo.org.za"
                value={email} onChangeText={setEmail}
                keyboardType="email-address"
              />

              <FieldLabel label="Password" />
              <InputField
                icon="lock" placeholder="••••••••"
                value={password} onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginBottom: 20, marginTop: -6 }}
              >
                <Text style={{ fontSize: 12, color: ACCENT, fontWeight: '600' }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <ErrorBanner message={error} />

              <TouchableOpacity
                onPress={loading ? undefined : handleSignIn}
                activeOpacity={0.85}
                style={{
                  backgroundColor: ACCENT,
                  borderRadius: 14, paddingVertical: 15,
                  alignItems: 'center', marginBottom: 16,
                  shadowColor: ACCENT,
                  shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Sign In</Text>
                }
              </TouchableOpacity>

              <View style={{
                flexDirection: 'row', alignItems: 'flex-start', gap: 10,
                backgroundColor: 'rgba(251,146,60,0.07)',
                borderRadius: 14, borderWidth: 1,
                borderColor: 'rgba(251,146,60,0.15)',
                padding: 12,
              }}>
                <Feather name="info" size={14} color={ACCENT} style={{ marginTop: 1 }} />
                <Text style={{
                  flex: 1, color: '#92400E',
                  fontSize: 12, lineHeight: 18,
                }}>
                  NPO accounts require admin approval. If your account is pending, contact{' '}
                  <Text style={{ fontWeight: '700' }}>support@freshloop.co.za</Text>
                </Text>
              </View>
            </>
          ) : (
            <>
              <FieldLabel label="Organisation Name" />
              <InputField
                icon="users" placeholder="e.g. Durban Food Bank"
                value={orgName} onChangeText={setOrgName}
              />

              <FieldLabel label="NPO Registration Number" />
              <InputField
                icon="hash" placeholder="e.g. 123-456 NPO"
                value={regNumber} onChangeText={setRegNumber}
                keyboardType="default"
              />

              <FieldLabel label="Organisation Email" />
              <InputField
                icon="mail" placeholder="info@yournpo.org.za"
                value={email} onChangeText={setEmail}
                keyboardType="email-address"
              />

              <FieldLabel label="Contact Number" />
              <InputField
                icon="phone" placeholder="+27 31 000 0000"
                value={phone} onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <FieldLabel label="Password" />
              <InputField
                icon="lock" placeholder="Min. 8 characters"
                value={password} onChangeText={setPassword}
                secureTextEntry
              />

              <FieldLabel label="Confirm Password" />
              <InputField
                icon="lock" placeholder="Repeat password"
                value={confirmPass} onChangeText={setConfirmPass}
                secureTextEntry
              />

              {password.length > 0 && (
                <View style={{ marginBottom: 14, marginTop: -6 }}>
                  <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map(i => (
                      <View key={i} style={{
                        flex: 1, height: 4, borderRadius: 2,
                        backgroundColor:
                          password.length >= i * 3
                            ? i <= 1 ? '#EF4444'
                            : i <= 2 ? '#F97316'
                            : i <= 3 ? '#FBBF24'
                            : '#2D6A4F'
                            : '#E2E8F0',
                      }} />
                    ))}
                  </View>
                  <Text style={{ fontSize: 11, color: '#94A3B8' }}>
                    {password.length < 4 ? 'Weak' : password.length < 7 ? 'Fair' : password.length < 10 ? 'Good' : 'Strong'} password
                  </Text>
                </View>
              )}

              <Text style={{
                fontSize: 11, fontWeight: '700', color: '#94A3B8',
                letterSpacing: 0.8, textTransform: 'uppercase',
                marginBottom: 10, marginTop: 2,
              }}>
                Verification Documents
              </Text>

              <UploadCard
                icon="file-text"
                title="NPO Registration Certificate"
                sub="Issued by the Department of Social Development"
              />
              <UploadCard
                icon="shield"
                title="Food Handling Certificate"
                sub="Optional but accelerates approval"
              />
              <UploadCard
                icon="map-pin"
                title="Proof of Operating Address"
                sub="Utility bill or lease — max 10MB"
              />

              <TouchableOpacity
                onPress={() => setAgreeTerms(p => !p)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row', alignItems: 'flex-start',
                  gap: 10, marginBottom: 20, marginTop: 4,
                }}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: agreeTerms ? ACCENT : '#CBD5E1',
                  backgroundColor: agreeTerms ? ACCENT : '#fff',
                  alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  {agreeTerms && <Feather name="check" size={11} color="#fff" />}
                </View>
                <Text style={{ flex: 1, fontSize: 12, color: '#64748B', lineHeight: 18 }}>
                  I confirm this organisation is a registered NPO and I agree to the{' '}
                  <Text style={{ color: ACCENT, fontWeight: '700' }}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={{ color: ACCENT, fontWeight: '700' }}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <ErrorBanner message={error} />

              <TouchableOpacity
                onPress={agreeTerms && !loading ? handleRegister : undefined}
                activeOpacity={0.85}
                style={{
                  backgroundColor: agreeTerms ? ACCENT : '#CBD5E1',
                  borderRadius: 14, paddingVertical: 15,
                  alignItems: 'center',
                  shadowColor: ACCENT,
                  shadowOpacity: agreeTerms ? 0.3 : 0,
                  shadowRadius: 10, elevation: agreeTerms ? 4 : 0,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Submit for Review</Text>
                }
              </TouchableOpacity>

              <Text style={{
                textAlign: 'center', fontSize: 11,
                color: '#94A3B8', marginTop: 10, lineHeight: 17,
              }}>
                Applications are reviewed within 1–2 business days.{'\n'}
                You'll receive a confirmation email once approved.
              </Text>
            </>
          )}
        </View>

        {/* ── Switch hint ── */}
        <TouchableOpacity
          onPress={() => switchTab(tab === 'signin' ? 'register' : 'signin')}
          activeOpacity={0.7}
          style={{ alignItems: 'center', paddingVertical: 8 }}
        >
          <Text style={{ color: '#64748B', fontSize: 13 }}>
            {tab === 'signin' ? "Don't have an account? " : 'Already registered? '}
            <Text style={{ color: ACCENT, fontWeight: '700' }}>
              {tab === 'signin' ? 'Register NPO' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
