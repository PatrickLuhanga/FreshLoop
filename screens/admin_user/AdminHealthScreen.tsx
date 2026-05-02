// screens/admin_user/AdminHealthScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { useAuth } from '../../context/AuthContext';
import { C } from './adminTypes';

const DONATION_STATS = [
  { label: 'Available', value: '23', color: C.primary   },
  { label: 'Claimed',   value: '8',  color: C.info      },
  { label: 'In Transit',value: '5',  color: C.warning   },
  { label: 'Done Today',value: '41', color: '#6a1b9a'   },
  { label: 'Expired',   value: '3',  color: C.danger    },
];

const METRICS = [
  { label: 'Food Rescued',  value: '4 218 kg', sub: 'platform-wide', icon: '🌿' },
  { label: 'Businesses',    value: '87',        sub: 'verified',      icon: '🏪' },
  { label: 'NPO Coords',    value: '34',        sub: 'active',        icon: '🤝' },
  { label: 'Home Users',    value: '1 652',     sub: 'registered',    icon: '🏠' },
  { label: 'Rand Donated',  value: 'R48 320',   sub: 'this month',    icon: '💰' },
  { label: 'Meals Saved',   value: '312',       sub: 'this week',     icon: '🍽️' },
];

export default function AdminHealthScreen() {
  const { session } = useAuth();
  const adminName = session?.name ?? 'Platform Admin';

  return (
    <View style={s.root}>
      <CustomHeader
        settingsScreen="AdminSettings"
        profileScreen="AdminProfile"
        notificationsScreen="AdminNotifications"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Identity bar */}
        <View style={s.identityBar}>
          <View>
            <Text style={s.greeting}>FreshLoop Admin</Text>
            <Text style={s.adminName}>{adminName}</Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeTxt}>🛡  Admin</Text>
          </View>
        </View>

        {/* Section: Live donation status */}
        <Text style={s.sectionTitle}>LIVE DONATION STATUS</Text>
        <View style={s.statsRow}>
          {DONATION_STATS.map(item => (
            <View key={item.label} style={s.statCard}>
              <Text style={[s.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.divider} />

        {/* Section: Platform health */}
        <Text style={s.sectionTitle}>PLATFORM HEALTH</Text>
        <View style={s.metricsGrid}>
          {METRICS.map(m => (
            <View key={m.label} style={s.metricCard}>
              <Text style={s.metricIcon}>{m.icon}</Text>
              <Text style={s.metricValue}>{m.value}</Text>
              <Text style={s.metricLabel}>{m.label}</Text>
              <Text style={s.metricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.background },
  scroll:      { padding: 20, paddingBottom: 130 },
  identityBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: C.surface, borderRadius: 18, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: C.border },
  greeting:    { fontSize: 11, color: C.textMuted, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  adminName:   { fontSize: 18, fontWeight: '800', color: C.textPrimary },
  badge:       { backgroundColor: 'rgba(167,139,250,0.15)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)' },
  badgeTxt:    { color: '#7C3AED', fontWeight: '700', fontSize: 12 },
  sectionTitle:{ fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 12 },
  divider:     { height: 1, backgroundColor: C.border, marginVertical: 20 },
  statsRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  statCard:    { flex: 1, minWidth: '28%', backgroundColor: C.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  statValue:   { fontSize: 24, fontWeight: '800' },
  statLabel:   { fontSize: 10, color: C.textMuted, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard:  { backgroundColor: C.surface, borderRadius: 16, padding: 16, width: '47%', borderWidth: 1, borderColor: C.border },
  metricIcon:  { fontSize: 26, marginBottom: 6 },
  metricValue: { fontSize: 20, fontWeight: '800', color: C.primary },
  metricLabel: { fontSize: 12, fontWeight: '700', color: C.textPrimary, marginTop: 2 },
  metricSub:   { fontSize: 11, color: C.textMuted, marginTop: 2 },
});
