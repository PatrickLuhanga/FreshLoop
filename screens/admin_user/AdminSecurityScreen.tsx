// screens/admin_user/AdminSecurityScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { C, fmtDate, MOCK_AUDIT } from './adminTypes';

const ACTIVE_SESSIONS = [
  { device: 'Windows PC — Chrome',    location: 'Durban, ZA',   lastActive: 'Now'       },
  { device: 'Samsung Galaxy A54',     location: 'Pinetown, ZA', lastActive: '2 hrs ago' },
];

export default function AdminSecurityScreen() {
  return (
    <View style={s.root}>
      <CustomHeader settingsScreen="AdminSettings" profileScreen="AdminProfile" notificationsScreen="AdminNotifications" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* 2FA */}
        <Text style={s.sectionTitle}>SECURITY SETTINGS</Text>
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.cardLabel}>🔐 2FA Status</Text>
            <View style={[s.badge, { backgroundColor: '#e8f5e9' }]}>
              <Text style={[s.badgeTxt, { color: C.primary }]}>Always Active</Text>
            </View>
          </View>
          <Text style={s.cardSub}>
            2FA is permanently enforced for all admin accounts and cannot be disabled.
          </Text>
        </View>

        <View style={s.divider} />

        {/* Active sessions */}
        <Text style={s.sectionTitle}>ACTIVE SESSIONS</Text>
        {ACTIVE_SESSIONS.map((sess, i) => (
          <View key={i} style={s.sessionCard}>
            <View style={{ flex: 1 }}>
              <Text style={s.sessDevice}>{sess.device}</Text>
              <Text style={s.sessLocation}>{sess.location}</Text>
              <Text style={s.sessTime}>Last active: {sess.lastActive}</Text>
            </View>
            <TouchableOpacity
              style={s.signOutBtn}
              onPress={() => Alert.alert('Signed Out', `Session on ${sess.device} ended.`)}
            >
              <Text style={s.signOutTxt}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={s.signOutAllBtn}
          onPress={() => Alert.alert('Signed Out', 'All other sessions ended.')}
        >
          <Text style={s.signOutAllTxt}>Sign Out All Other Devices</Text>
        </TouchableOpacity>

        <View style={s.divider} />

        {/* Audit log */}
        <Text style={s.sectionTitle}>AUDIT LOG</Text>
        {MOCK_AUDIT.map(entry => (
          <View key={entry.id} style={s.auditRow}>
            <Text style={s.auditAction}>{entry.action}</Text>
            <Text style={s.auditMeta}>{entry.adminName} · {fmtDate(entry.timestamp)}</Text>
          </View>
        ))}

        <View style={s.divider} />

        {/* Change password */}
        <Text style={s.sectionTitle}>CHANGE PASSWORD</Text>
        <View style={s.card}>
          <TextInput style={s.input} placeholder="Current Password" secureTextEntry placeholderTextColor={C.textMuted} />
          <TextInput style={s.input} placeholder="New Password (min 12 chars, 1 uppercase, 1 symbol)" secureTextEntry placeholderTextColor={C.textMuted} />
          <TextInput style={s.input} placeholder="Confirm New Password" secureTextEntry placeholderTextColor={C.textMuted} />
          <TouchableOpacity
            style={s.changeBtn}
            onPress={() => Alert.alert('Biometric Required', 'Please verify with fingerprint or Face ID to continue.')}
          >
            <Text style={s.changeTxt}>🔒  Change Password</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: C.background },
  scroll:        { padding: 20, paddingBottom: 130 },
  sectionTitle:  { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 12 },
  divider:       { height: 1, backgroundColor: C.border, marginVertical: 20 },
  card:          { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 4, borderWidth: 1, borderColor: C.border },
  row:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardLabel:     { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  cardSub:       { fontSize: 12, color: C.textMuted, lineHeight: 18 },
  badge:         { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeTxt:      { fontSize: 11, fontWeight: '700' },
  sessionCard:   { backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  sessDevice:    { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
  sessLocation:  { fontSize: 12, color: C.textSecondary, marginBottom: 2 },
  sessTime:      { fontSize: 11, color: C.textMuted },
  signOutBtn:    { backgroundColor: C.dangerLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ef9a9a' },
  signOutTxt:    { color: C.danger, fontSize: 11, fontWeight: '700' },
  signOutAllBtn: { backgroundColor: C.dangerLight, borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: C.danger, marginBottom: 4 },
  signOutAllTxt: { color: C.danger, fontSize: 13, fontWeight: '700' },
  auditRow:      { backgroundColor: C.surface, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: C.border },
  auditAction:   { fontSize: 13, fontWeight: '600', color: C.textPrimary, marginBottom: 2 },
  auditMeta:     { fontSize: 11, color: C.textMuted },
  input:         { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: C.textPrimary, marginBottom: 10, backgroundColor: C.background },
  changeBtn:     { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  changeTxt:     { color: '#fff', fontWeight: '700', fontSize: 14 },
});
