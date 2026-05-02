// screens/business_user/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BusinessStackParamList } from '../../navigation/BusinessUserNavigator';


const STORE_DETAILS = [
  { label: 'Address',         value: '35 Berea Rd, Berea, Durban, 4001', icon: 'map-pin'  as const },
  { label: 'Store Type',      value: 'Mid-size Independent Grocer',       icon: 'shopping-bag' as const },
  { label: 'Operating Hours', value: 'Mon–Sun: 07:00 – 20:00',           icon: 'clock'    as const },
  { label: 'Contact',         value: '+27 31 201 5678',                   icon: 'phone'    as const },
];

const DOCS = [
  { name: 'Trading Licence',         status: 'Approved',       approved: true  },
  { name: 'Food Safety Certificate', status: 'Pending Review', approved: false },
];

const STAFF = ['thandi@picknpay.co.za', 'sizwe@picknpay.co.za'];

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

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BusinessStackParamList>>();
  const [staffList, setStaffList] = useState(STAFF);
  const [newEmail,  setNewEmail]  = useState('');

  const addStaff = () => {
    if (newEmail.trim()) {
      setStaffList(p => [...p, newEmail.trim()]);
      setNewEmail('');
    }
  };

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
        contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Page title ── */}
        <Text style={{
          color: '#1E293B', fontSize: 22, fontWeight: '800',
          letterSpacing: -0.5, marginBottom: 4,
        }}>
          Business Profile
        </Text>
        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>
          Manage your store details, documents and staff.
        </Text>

        {/* ── Business hero card ── */}
        <View style={{
          ...card,
          alignItems: 'center', padding: 24,
          borderWidth: 1.5, borderColor: 'rgba(45,106,79,0.15)',
        }}>
          <View style={{
            width: 68, height: 68, borderRadius: 20,
            backgroundColor: 'rgba(45,106,79,0.1)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 14,
          }}>
            <Feather name="shopping-bag" size={30} color="#2D6A4F" />
          </View>
          <Text style={{
            fontWeight: '800', fontSize: 18, color: '#1E293B', marginBottom: 4,
          }}>
            Pick n Pay Berea
          </Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 14 }}>
            Independent Supermarket · Durban, KZN
          </Text>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: '#F0FDF4', borderRadius: 20,
            paddingHorizontal: 12, paddingVertical: 5,
            borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
          }}>
            <Feather name="check-circle" size={12} color="#10B981" />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>Verified</Text>
          </View>
        </View>

        {/* ── Store details ── */}
        <SectionLabel text="Store Details" />
        <View style={card}>
          {STORE_DETAILS.map((d, i) => (
            <View key={d.label}>
              <View style={{
                flexDirection: 'row', alignItems: 'flex-start',
                gap: 12, paddingVertical: 12,
              }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: '#F1F5F9',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Feather name={d.icon} size={15} color="#64748B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 10, color: '#94A3B8',
                    fontWeight: '700', textTransform: 'uppercase',
                    letterSpacing: 0.5, marginBottom: 3,
                  }}>
                    {d.label}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '500' }}>
                    {d.value}
                  </Text>
                </View>
              </View>
              {i < STORE_DETAILS.length - 1 && (
                <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />
              )}
            </View>
          ))}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: 14, borderWidth: 1.5, borderColor: '#E2E8F0',
              borderRadius: 12, paddingVertical: 11,
              alignItems: 'center', flexDirection: 'row',
              justifyContent: 'center', gap: 6,
            }}
          >
            <Feather name="edit-2" size={13} color="#2D6A4F" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#2D6A4F' }}>
              Edit Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Loading dock ── */}
        <SectionLabel text="Loading Dock Location" />
        <View style={{ ...card, padding: 0, overflow: 'hidden' }}>
          {/* Map placeholder */}
          <View style={{
            height: 130, backgroundColor: '#E2EBE1',
            alignItems: 'center', justifyContent: 'center',
            borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
          }}>
            {[1,2,3].map(i => (
              <View key={i} style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              }}>
                <View style={{
                  position: 'absolute', top: `${i * 33}%` as any,
                  left: 0, right: 0, height: 1,
                  backgroundColor: '#2D6A4F', opacity: 0.1,
                }} />
              </View>
            ))}
            <View style={{
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: '#2D6A4F',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOpacity: 0.2,
              shadowRadius: 6, elevation: 4,
            }}>
              <Feather name="map-pin" size={20} color="#fff" />
            </View>
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 20, paddingHorizontal: 12,
              paddingVertical: 4, marginTop: 8,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#2D6A4F' }}>
                Loading Dock — Berea Centre
              </Text>
            </View>
          </View>
          <View style={{ padding: 14 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderWidth: 1.5, borderColor: '#E2E8F0',
                borderRadius: 12, paddingVertical: 11,
                alignItems: 'center', flexDirection: 'row',
                justifyContent: 'center', gap: 6,
              }}
            >
              <Feather name="edit-2" size={13} color="#2D6A4F" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#2D6A4F' }}>
                Set / Adjust Loading Dock Pin
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Verification docs ── */}
        <SectionLabel text="Verification Documents" />
        <View style={card}>
          {DOCS.map((doc, i) => (
            <View key={doc.name}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                justifyContent: 'space-between', paddingVertical: 10,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 12,
                    backgroundColor: doc.approved
                      ? 'rgba(16,185,129,0.1)' : 'rgba(251,191,36,0.1)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Feather
                      name={doc.approved ? 'file-text' : 'clock'}
                      size={17}
                      color={doc.approved ? '#10B981' : '#FBBF24'}
                    />
                  </View>
                  <View>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: '#1E293B', marginBottom: 2 }}>
                      {doc.name}
                    </Text>
                    <Text style={{
                      fontSize: 11, fontWeight: '700',
                      color: doc.approved ? '#10B981' : '#FBBF24',
                    }}>
                      {doc.status}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6,
                    borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0',
                    backgroundColor: '#F8FAFC',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
                    Re-upload
                  </Text>
                </TouchableOpacity>
              </View>
              {i < DOCS.length - 1 && (
                <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />
              )}
            </View>
          ))}
        </View>

        {/* ── Staff accounts ── */}
        <SectionLabel text="Staff Accounts — Inventory Only" />
        <View style={card}>
          {staffList.map((email, i) => (
            <View key={email} style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{
                  width: 34, height: 34, borderRadius: 10,
                  backgroundColor: 'rgba(45,106,79,0.1)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Feather name="user" size={15} color="#2D6A4F" />
                </View>
                <Text style={{ fontSize: 13, color: '#1E293B', fontWeight: '500' }}>
                  {email}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setStaffList(p => p.filter((_, idx) => idx !== i))}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 10, paddingVertical: 5,
                  borderRadius: 8, borderWidth: 1,
                  borderColor: 'rgba(239,68,68,0.25)',
                  backgroundColor: '#FEF2F2',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#EF4444' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add staff row */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <View style={{
              flex: 1, flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#F8FAFC', borderRadius: 12,
              borderWidth: 1, borderColor: '#E2E8F0',
              paddingHorizontal: 12, height: 44,
            }}>
              <Feather name="mail" size={14} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="staff@business.com"
                placeholderTextColor="#CBD5E1"
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, fontSize: 13, color: '#1E293B' }}
              />
            </View>
            <TouchableOpacity
              onPress={addStaff}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#2D6A4F', borderRadius: 12,
                paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Feather name="plus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Navigation buttons ── */}
        <View style={{ gap: 10, marginTop: 4 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BusinessSecurity')}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 16,
              flexDirection: 'row', alignItems: 'center', gap: 12,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            }}
          >
            <View style={{
              width: 38, height: 38, borderRadius: 11,
              backgroundColor: 'rgba(45,106,79,0.1)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Feather name="lock" size={16} color="#2D6A4F" />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
              Security Settings
            </Text>
            <Feather name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('BusinessReport')}
            activeOpacity={0.8}
            style={{
              backgroundColor: '#fff', borderRadius: 16, padding: 16,
              flexDirection: 'row', alignItems: 'center', gap: 12,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            }}
          >
            <View style={{
              width: 38, height: 38, borderRadius: 11,
              backgroundColor: 'rgba(239,68,68,0.08)',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Feather name="flag" size={16} color="#EF4444" />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#1E293B' }}>
              Report an Issue
            </Text>
            <Feather name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>
          
        </View>

      </ScrollView>
    </View>
  );
}