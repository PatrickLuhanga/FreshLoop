// screens/npo_user/NPOSecurityScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';

// ── Data ──────────────────────────────────────────────────────────────────────
const ACTIVE_SESSIONS = [
  { id: '1', device: 'Samsung Galaxy S24', location: 'Durban, ZA',   lastActive: 'Now',       current: true  },
  { id: '2', device: 'iPhone 15 Pro',      location: 'Pinetown, ZA', lastActive: '2 hrs ago', current: false },
  { id: '3', device: 'Lenovo Tab',         location: 'Westville, ZA',lastActive: 'Yesterday', current: false },
];

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'biometric' | 'form'>('biometric');

  const handleClose = () => {
    setStep('biometric');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40,
        }}>
          {/* Handle */}
          <View style={{
            width: 40, height: 4, backgroundColor: '#E2E8F0',
            borderRadius: 2, alignSelf: 'center', marginBottom: 20,
          }} />

          {step === 'biometric' ? (
            <>
              <Text style={{
                fontSize: 20, fontWeight: '800', color: '#1E293B',
                textAlign: 'center', marginBottom: 6,
              }}>
                Verify Identity
              </Text>
              <Text style={{
                fontSize: 13, color: '#64748B',
                textAlign: 'center', marginBottom: 28, lineHeight: 20,
              }}>
                Biometric confirmation required before changing your password.
              </Text>

              {/* Fingerprint icon */}
              <View style={{ alignItems: 'center', marginBottom: 28 }}>
                <View style={{
                  width: 90, height: 90, borderRadius: 45,
                  backgroundColor: 'rgba(45,106,79,0.1)',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: 'rgba(45,106,79,0.2)',
                }}>
                  <Feather name="smartphone" size={40} color="#2D6A4F" />
                </View>
                <Text style={{
                  fontSize: 13, color: '#64748B',
                  marginTop: 10, fontWeight: '600',
                }}>
                  Touch the sensor
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setStep('form')}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#2D6A4F', borderRadius: 14,
                  paddingVertical: 15, alignItems: 'center',
                  marginBottom: 10,
                  shadowColor: '#2D6A4F',
                  shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
                  Simulate Biometric Confirm
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClose}
                style={{ paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{
                fontSize: 20, fontWeight: '800', color: '#1E293B',
                marginBottom: 20,
              }}>
                Change Password
              </Text>

              {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                <View key={label} style={{ marginBottom: 14 }}>
                  <Text style={{
                    fontSize: 11, fontWeight: '700', color: '#94A3B8',
                    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 7,
                  }}>
                    {label}
                  </Text>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0',
                    paddingHorizontal: 14, height: 50,
                  }}>
                    <Feather name="lock" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#CBD5E1"
                      secureTextEntry
                      style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#2D6A4F', borderRadius: 14,
                  paddingVertical: 15, alignItems: 'center',
                  marginTop: 6,
                  shadowColor: '#2D6A4F',
                  shadowOpacity: 0.3, shadowRadius: 10, elevation: 4,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
                  Update Password
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={{
      color: '#94A3B8', fontSize: 11, fontWeight: '700',
      letterSpacing: 1, marginBottom: 10, paddingLeft: 2,
    }}>
      {text}
    </Text>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />;
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function NPOSecurityScreen() {
  const navigation = useNavigation<any>();
  const [biometricEnabled,    setBiometricEnabled]    = useState(true);
  const [faceIdEnabled,       setFaceIdEnabled]       = useState(false);
  const [showPasswordModal,   setShowPasswordModal]   = useState(false);

  const card = {
    backgroundColor: '#fff', borderRadius: 20,
    marginBottom: 16, shadowColor: '#000' as const,
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    overflow: 'hidden' as const,
  };

  const iconBox = (bg: string) => ({
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 14,
  });

  const rowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 14,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>
      <CustomHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 130,
        }}
      >

        {/* ── Page title ── */}
        <Text style={{
          color: '#1E293B', fontSize: 22,
          fontWeight: '800', letterSpacing: -0.5, marginBottom: 4,
        }}>
          Security Settings
        </Text>
        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>
          Coordinator account
        </Text>

        {/* ── 2FA mandatory banner ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'flex-start', gap: 10,
          backgroundColor: 'rgba(45,106,79,0.08)',
          borderRadius: 16, borderWidth: 1,
          borderColor: 'rgba(45,106,79,0.15)',
          padding: 14, marginBottom: 20,
        }}>
          <Feather name="shield" size={16} color="#2D6A4F" style={{ marginTop: 1 }} />
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 13, fontWeight: '800',
              color: '#2D6A4F', marginBottom: 3,
            }}>
              Two-Step Verification is Mandatory
            </Text>
            <Text style={{
              fontSize: 12, color: '#475569',
              lineHeight: 18,
            }}>
              As a Coordinator account, 2FA cannot be disabled. It is required on every new device login to protect donation chain of custody.
            </Text>
          </View>
        </View>

        {/* ── Login Methods ── */}
        <SectionLabel text="LOGIN METHODS" />
        <View style={card}>
          {/* Biometrics */}
          <View style={rowStyle}>
            <View style={iconBox('rgba(45,106,79,0.1)')}>
              <Feather name="smartphone" size={17} color="#2D6A4F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                Fingerprint Login
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                Use fingerprint as alternative login method
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
            />
          </View>

          <Divider />

          {/* Face ID */}
          <View style={rowStyle}>
            <View style={iconBox('rgba(249,115,22,0.1)')}>
              <Feather name="smile" size={17} color="#F97316" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                Face ID
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                Use face recognition as alternative login
              </Text>
            </View>
            <Switch
              value={faceIdEnabled}
              onValueChange={setFaceIdEnabled}
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
            />
          </View>
        </View>

        {/* ── Two-Step Verification ── */}
        <SectionLabel text="TWO-STEP VERIFICATION" />
        <View style={card}>
          {/* SMS OTP */}
          <View style={rowStyle}>
            <View style={iconBox('rgba(34,197,94,0.1)')}>
              <Feather name="phone" size={17} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                SMS OTP
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                +27 *** *** 7890 · Active
              </Text>
            </View>
            <View style={{
              backgroundColor: 'rgba(22,163,74,0.1)',
              borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
            }}>
              <Text style={{ color: '#16A34A', fontSize: 10, fontWeight: '800' }}>
                ON
              </Text>
            </View>
          </View>

          <Divider />

          {/* Email OTP */}
          <View style={rowStyle}>
            <View style={iconBox('#F1F5F9')}>
              <Feather name="mail" size={17} color="#94A3B8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                Email OTP
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                Fallback option · Not configured
              </Text>
            </View>
            <View style={{
              backgroundColor: '#F1F5F9',
              borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
            }}>
              <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '800' }}>
                OFF
              </Text>
            </View>
          </View>
        </View>

        {/* ── Active Sessions ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 10,
        }}>
          <Text style={{
            color: '#94A3B8', fontSize: 11,
            fontWeight: '700', letterSpacing: 1, paddingLeft: 2,
          }}>
            ACTIVE SESSIONS
          </Text>
          <TouchableOpacity>
            <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '700' }}>
              Sign Out All Others
            </Text>
          </TouchableOpacity>
        </View>

        <View style={card}>
          {ACTIVE_SESSIONS.map((session, i) => (
            <View key={session.id}>
              <View style={{
                ...rowStyle,
                paddingVertical: 12,
              }}>
                <View style={iconBox('#F1F5F9')}>
                  <Feather
                    name={
                      session.device.includes('Tab')
                        ? 'tablet'
                        : 'smartphone'
                    }
                    size={17}
                    color="#64748B"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{
                      color: '#1E293B', fontSize: 13, fontWeight: '700',
                    }}>
                      {session.device}
                    </Text>
                    {session.current && (
                      <View style={{
                        backgroundColor: 'rgba(45,106,79,0.1)',
                        borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
                      }}>
                        <Text style={{
                          color: '#2D6A4F', fontSize: 9, fontWeight: '800',
                        }}>
                          THIS DEVICE
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>
                    {session.location} · {session.lastActive}
                  </Text>
                </View>
                {!session.current && (
                  <TouchableOpacity style={{
                    backgroundColor: '#F1F5F9',
                    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
                  }}>
                    <Text style={{
                      fontSize: 11, fontWeight: '700', color: '#64748B',
                    }}>
                      Sign out
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {i < ACTIVE_SESSIONS.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* ── Change Password ── */}
        <SectionLabel text="PASSWORD" />
        <View style={card}>
          <TouchableOpacity
            onPress={() => setShowPasswordModal(true)}
            activeOpacity={0.7}
            style={rowStyle}
          >
            <View style={iconBox('rgba(45,106,79,0.1)')}>
              <Feather name="lock" size={17} color="#2D6A4F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                Change Password
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                Biometric confirmation required
              </Text>
            </View>
            <Feather name="chevron-right" size={17} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </View>
  );
}