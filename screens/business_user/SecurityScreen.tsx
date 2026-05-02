// screens/business_user/SecurityScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';



const SESSIONS = [
  { device: 'iPhone 15 Pro',  location: 'Durban, ZA',       icon: 'smartphone' as const, current: true  },
  { device: 'MacBook Pro',    location: 'Durban, ZA',       icon: 'monitor'    as const, current: false },
  { device: 'iPad Air',       location: 'Johannesburg, ZA', icon: 'tablet'     as const, current: false },
];

function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={{
      color: '#94A3B8', fontSize: 11, fontWeight: '700',
      letterSpacing: 1, textTransform: 'uppercase',
      marginBottom: 10, marginTop: 4, paddingLeft: 2,
    }}>
      {text}
    </Text>
  );
}

function PasswordField({
  label, placeholder, value, onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{
        fontSize: 11, fontWeight: '700', color: '#94A3B8',
        letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7,
      }}>
        {label}
      </Text>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F8FAFC', borderRadius: 14,
        borderWidth: 1, borderColor: '#E2E8F0',
        paddingHorizontal: 14, height: 50,
      }}>
        <Feather name="lock" size={15} color="#94A3B8" style={{ marginRight: 10 }} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
          style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
        />
        <TouchableOpacity onPress={() => setShow(p => !p)}>
          <Feather name={show ? 'eye-off' : 'eye'} size={15} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SecurityScreen() {
  const navigation = useNavigation();
  const [biometric,   setBiometric]   = useState(true);
  const [faceID,      setFaceID]      = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass,     setNewPass]     = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const card = {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    marginBottom: 16,
    shadowColor: '#000' as const,
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>
      <CustomHeader 
        settingsScreen="BusinessSecurity" 
        profileScreen="Profile" 
        notificationsScreen="BusinessNotifications" 
      />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}
        >
          <Feather name="arrow-left" size={16} color="#2D6A4F" />
          <Text style={{ color: '#2D6A4F', fontWeight: '700', fontSize: 14 }}>
            Back to Profile
          </Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={{
          color: '#1E293B', fontSize: 22, fontWeight: '800',
          letterSpacing: -0.5, marginBottom: 4,
        }}>
          Security Settings
        </Text>
        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 24 }}>
          Manage authentication, sessions and your password.
        </Text>

        {/* ── Authentication ── */}
        <SectionLabel text="Authentication" />
        <View style={card}>
          {[
            {
              label: 'Biometric Login',
              sub: 'Fingerprint / Touch ID',
              icon: 'smartphone' as const,
              value: biometric,
              set: setBiometric,
            },
            {
              label: 'Face ID',
              sub: 'Facial recognition login',
              icon: 'smile' as const,
              value: faceID,
              set: setFaceID,
            },
          ].map((item, i) => (
            <View key={item.label}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', paddingVertical: 10,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: item.value
                      ? 'rgba(45,106,79,0.1)' : '#F1F5F9',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Feather
                      name={item.icon}
                      size={17}
                      color={item.value ? '#2D6A4F' : '#94A3B8'}
                    />
                  </View>
                  <View>
                    <Text style={{ fontWeight: '700', fontSize: 14, color: '#1E293B' }}>
                      {item.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 1 }}>
                      {item.sub}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={() => item.set((v: boolean) => !v)}
                  trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
                  thumbColor="#fff"
                />
              </View>
              {i === 0 && (
                <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />
              )}
            </View>
          ))}
        </View>

        {/* ── 2FA ── */}
        <SectionLabel text="Two-Factor Authentication" />
        <View style={{
          ...card,
          backgroundColor: 'rgba(45,106,79,0.07)',
          borderWidth: 1, borderColor: 'rgba(45,106,79,0.15)',
        }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Feather name="shield" size={15} color="#2D6A4F" />
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#2D6A4F' }}>
                  2FA is Mandatory
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#64748B' }}>
                Required for all business accounts
              </Text>
            </View>
            <View style={{
              paddingHorizontal: 10, paddingVertical: 4,
              borderRadius: 20, backgroundColor: '#F0FDF4',
              borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#10B981' }}>Active</Text>
            </View>
          </View>
        </View>

        {/* ── Active sessions ── */}
        <SectionLabel text="Active Sessions" />
        <View style={card}>
          {SESSIONS.map((s, i) => (
            <View key={s.device}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', paddingVertical: 10,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: s.current
                      ? 'rgba(45,106,79,0.1)' : '#F1F5F9',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Feather
                      name={s.icon}
                      size={17}
                      color={s.current ? '#2D6A4F' : '#94A3B8'}
                    />
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontWeight: '700', fontSize: 13, color: '#1E293B' }}>
                        {s.device}
                      </Text>
                      {s.current && (
                        <View style={{
                          backgroundColor: '#F0FDF4', borderRadius: 6,
                          paddingHorizontal: 6, paddingVertical: 2,
                          borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)',
                        }}>
                          <Text style={{ fontSize: 9, fontWeight: '800', color: '#10B981' }}>
                            THIS DEVICE
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                      {s.location}
                    </Text>
                  </View>
                </View>
                {!s.current && (
                  <TouchableOpacity activeOpacity={0.7}>
                    <Feather name="log-out" size={15} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              {i < SESSIONS.length - 1 && (
                <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />
              )}
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              marginTop: 14, backgroundColor: '#FEF2F2',
              borderRadius: 12, paddingVertical: 12,
              alignItems: 'center', flexDirection: 'row',
              justifyContent: 'center', gap: 8,
              borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
            }}
          >
            <Feather name="log-out" size={15} color="#EF4444" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#EF4444' }}>
              Sign Out All Other Devices
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Change password ── */}
        <SectionLabel text="Change Password" />
        <View style={card}>
          <PasswordField
            label="Current Password"
            placeholder="••••••••"
            value={currentPass}
            onChangeText={setCurrentPass}
          />
          <PasswordField
            label="New Password"
            placeholder="Min. 8 characters"
            value={newPass}
            onChangeText={setNewPass}
          />
          <PasswordField
            label="Confirm New Password"
            placeholder="Repeat new password"
            value={confirmPass}
            onChangeText={setConfirmPass}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: '#2D6A4F', borderRadius: 12,
              paddingVertical: 13, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
              shadowColor: '#2D6A4F', shadowOpacity: 0.3,
              shadowRadius: 8, elevation: 3,
            }}
          >
            <Feather name="check" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
              Update Password
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}