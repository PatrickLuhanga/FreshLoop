// screens/general_user/SecuritySettingsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';

// ── Bottom Nav (identical to NotificationsScreen) ─────────────────────────────
const TAB_CONFIG: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  screen: string;
  freshbot?: boolean;
}[] = [
  { label: 'Home',     icon: 'home',           screen: 'Dashboard'  },
  { label: 'Pantry',   icon: 'box',            screen: 'Pantry'     },
  { label: 'Recipes',  icon: 'book-open',      screen: 'Recipes'    },
  { label: 'Plan',     icon: 'calendar',       screen: 'MealPlan'   },
  { label: 'FreshBot', icon: 'message-circle', screen: 'FreshBot',  freshbot: true },
  { label: 'Insights', icon: 'bar-chart-2',    screen: 'Analytics'  },
];

function BottomNav() {
  const navigation = useNavigation<any>();
  return (
    <View style={{
      position: 'absolute',
      bottom: 20, left: 12, right: 12,
      flexDirection: 'row',
      backgroundColor: '#1C3A2E',
      borderRadius: 26,
      paddingVertical: 6,
      paddingHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 14,
    }}>
      {TAB_CONFIG.map(tab => (
        <TouchableOpacity
          key={tab.label}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('MainTabs', { screen: tab.screen })}
          style={{
            flex: 1, alignItems: 'center', justifyContent: 'center',
            paddingVertical: 7, borderRadius: 22, marginHorizontal: 2,
            backgroundColor: tab.freshbot ? 'rgba(249,115,22,0.15)' : 'transparent',
          }}
        >
          <Feather
            name={tab.icon} size={19}
            color={tab.freshbot ? '#F97316' : 'rgba(255,255,255,0.38)'}
          />
          <Text style={{
            fontSize: 9, fontWeight: '600', marginTop: 3,
            color: tab.freshbot ? '#F97316' : 'rgba(255,255,255,0.38)',
          }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Reusable card divider ─────────────────────────────────────────────────────
function Divider() {
  return <View style={{ height: 1, backgroundColor: '#F1F5F9' }} />;
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SecuritySettingsScreen() {
  const navigation = useNavigation<any>();

  const [is2FAEnabled,          setIs2FAEnabled]          = useState(false);
  const [isBiometricsEnabled,   setIsBiometricsEnabled]   = useState(true);
  const [isAnalyticsEnabled,    setIsAnalyticsEnabled]    = useState(true);
  const [isLocationEnabled,     setIsLocationEnabled]     = useState(true);
  const [isMarketingEnabled,    setIsMarketingEnabled]    = useState(false);

  // ── Shared style tokens ────────────────────────────────────────────────────
  const card = {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000' as const,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  };

  const iconBox = (bg = '#F1F5F9') => ({
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: bg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 14,
  });

  const listRow = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 15,
  };

  const listLeft = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
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
          fontWeight: '800', letterSpacing: -0.5,
          marginBottom: 6,
        }}>
          Security & Privacy
        </Text>
        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 24 }}>
          Manage your account security and data preferences.
        </Text>

        {/* ── Section: Login & Security ── */}
        <Text style={{
          color: '#94A3B8', fontSize: 11,
          fontWeight: '700', letterSpacing: 1,
          marginBottom: 10, paddingLeft: 2,
        }}>
          LOGIN & SECURITY
        </Text>

        <View style={card}>

          {/* Change Password */}
          <TouchableOpacity style={listRow} activeOpacity={0.7}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="lock" size={17} color="#475569" />
              </View>
              <View>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Change Password
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Last changed 3 months ago
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <Divider />

          {/* 2FA */}
          <View style={listRow}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="smartphone" size={17} color="#475569" />
              </View>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Two-Factor Auth (2FA)
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Extra security for your account
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIs2FAEnabled}
              value={is2FAEnabled}
            />
          </View>

          <Divider />

          {/* Biometrics */}
          <View style={listRow}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="smile" size={17} color="#475569" />
              </View>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Biometric Login
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Use fingerprint or face scan
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIsBiometricsEnabled}
              value={isBiometricsEnabled}
            />
          </View>

          <Divider />

          {/* Active session */}
          <View style={listRow}>
            <View style={listLeft}>
              <View style={iconBox('rgba(74,222,128,0.12)')}>
                <Feather name="check-circle" size={17} color="#16A34A" />
              </View>
              <View>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  HONOR WDY-LX2
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Current device · Durban, ZA
                </Text>
              </View>
            </View>
            <View style={{
              backgroundColor: 'rgba(74,222,128,0.12)',
              borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
            }}>
              <Text style={{ color: '#16A34A', fontSize: 10, fontWeight: '700' }}>
                ACTIVE
              </Text>
            </View>
          </View>

          <Divider />

          {/* Log out all */}
          <TouchableOpacity style={{ ...listRow, justifyContent: 'center' }} activeOpacity={0.7}>
            <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '600' }}>
              Log out of all other devices
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Section: Privacy & Data (POPIA) ── */}
        <Text style={{
          color: '#94A3B8', fontSize: 11,
          fontWeight: '700', letterSpacing: 1,
          marginBottom: 10, paddingLeft: 2,
        }}>
          PRIVACY & DATA (POPIA)
        </Text>

        {/* POPIA info banner */}
        <View style={{
          backgroundColor: 'rgba(45,106,79,0.08)',
          borderRadius: 14, borderWidth: 1,
          borderColor: 'rgba(45,106,79,0.15)',
          flexDirection: 'row', alignItems: 'flex-start',
          padding: 14, marginBottom: 14, gap: 10,
        }}>
          <Feather name="shield" size={16} color="#2D6A4F" style={{ marginTop: 1 }} />
          <Text style={{ color: '#2D6A4F', fontSize: 12, lineHeight: 18, flex: 1, fontWeight: '500' }}>
            FreshLoop complies with POPIA. You control your data — toggle sharing preferences below or download a copy anytime.
          </Text>
        </View>

        <View style={card}>

          {/* Share Analytics */}
          <View style={listRow}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="pie-chart" size={17} color="#475569" />
              </View>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Share Analytics
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Anonymous usage data to improve the app
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIsAnalyticsEnabled}
              value={isAnalyticsEnabled}
            />
          </View>

          <Divider />

          {/* Location */}
          <View style={listRow}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="map-pin" size={17} color="#475569" />
              </View>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Location Access
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Used to find nearby donation points
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIsLocationEnabled}
              value={isLocationEnabled}
            />
          </View>

          <Divider />

          {/* Marketing */}
          <View style={listRow}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="mail" size={17} color="#475569" />
              </View>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Marketing Emails
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Tips, news and product updates
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: '#2D6A4F' }}
              thumbColor="#fff"
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIsMarketingEnabled}
              value={isMarketingEnabled}
            />
          </View>

          <Divider />

          {/* Download Data */}
          <TouchableOpacity style={listRow} activeOpacity={0.7}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="download-cloud" size={17} color="#475569" />
              </View>
              <View>
                <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                  Download My Data
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Request a copy of your information
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <Divider />

          {/* Delete Account */}
          <TouchableOpacity style={listRow} activeOpacity={0.7}>
            <View style={listLeft}>
              <View style={iconBox('rgba(239,68,68,0.1)')}>
                <Feather name="trash-2" size={17} color="#EF4444" />
              </View>
              <View>
                <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '600' }}>
                  Delete Account
                </Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 1 }}>
                  Permanently remove your data
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* ── Section: About & Legal ── */}
        <Text style={{
          color: '#94A3B8', fontSize: 11,
          fontWeight: '700', letterSpacing: 1,
          marginBottom: 10, paddingLeft: 2,
        }}>
          ABOUT & LEGAL
        </Text>

        <View style={card}>

          <TouchableOpacity style={listRow} activeOpacity={0.7}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="file-text" size={17} color="#475569" />
              </View>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                Privacy Policy
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={listRow} activeOpacity={0.7}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="book-open" size={17} color="#475569" />
              </View>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                Terms of Service
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <Divider />

          <View style={{ ...listRow, justifyContent: 'space-between' }}>
            <View style={listLeft}>
              <View style={iconBox()}>
                <Feather name="info" size={17} color="#475569" />
              </View>
              <Text style={{ color: '#1E293B', fontSize: 14, fontWeight: '600' }}>
                App Version
              </Text>
            </View>
            <Text style={{ color: '#94A3B8', fontSize: 13, fontWeight: '500' }}>
              v1.0.0
            </Text>
          </View>
        </View>

      </ScrollView>

      <BottomNav />
    </View>
  );
}