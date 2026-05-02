// screens/admin_user/AdminAccountsScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { C, fmtDate, AdminAccount, MOCK_ADMINS } from './adminTypes';

export default function AdminAccountsScreen() {
  const [admins, setAdmins]           = useState<AdminAccount[]>(MOCK_ADMINS);
  const [name,   setName]             = useState('');
  const [email,  setEmail]            = useState('');
  const [pass,   setPass]             = useState('');

  const handleCreate = () => {
    if (!name.trim() || !email.trim() || !pass.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    const next: AdminAccount = {
      id: `ad${Date.now()}`, fullName: name.trim(),
      email: email.trim(), lastActive: new Date().toISOString(),
    };
    setAdmins(a => [...a, next]);
    setName(''); setEmail(''); setPass('');
    Alert.alert('Created', `Admin account created for ${next.fullName}.`);
  };

  const handleRevoke = (id: string) => {
    Alert.alert('Revoke Access', "Permanently revoke this admin's access?", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Revoke', style: 'destructive', onPress: () => setAdmins(a => a.filter(ad => ad.id !== id)) },
    ]);
  };

  return (
    <View style={s.root}>
      <CustomHeader settingsScreen="AdminSettings" profileScreen="AdminProfile" notificationsScreen="AdminNotifications" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Create admin */}
        <Text style={s.sectionTitle}>CREATE ADMIN ACCOUNT</Text>
        <View style={s.card}>
          <TextInput
            style={s.input} placeholder="Full Name"
            value={name} onChangeText={setName}
            placeholderTextColor={C.textMuted}
          />
          <TextInput
            style={s.input} placeholder="Email Address"
            value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none"
            placeholderTextColor={C.textMuted}
          />
          <TextInput
            style={s.input} placeholder="Temporary Password"
            value={pass} onChangeText={setPass}
            secureTextEntry placeholderTextColor={C.textMuted}
          />
          <TouchableOpacity style={s.createBtn} onPress={handleCreate}>
            <Text style={s.createTxt}>➕  Create Admin Account</Text>
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        {/* Current admins */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>CURRENT ADMINS</Text>
          <View style={s.countBubble}>
            <Text style={s.countTxt}>{admins.length}</Text>
          </View>
        </View>

        {admins.map(ad => (
          <View key={ad.id} style={s.adminCard}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>
                {ad.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.adminName}>{ad.fullName}</Text>
              <Text style={s.adminEmail}>{ad.email}</Text>
              <Text style={s.adminDate}>Last active: {fmtDate(ad.lastActive)}</Text>
            </View>
            <TouchableOpacity style={s.revokeBtn} onPress={() => handleRevoke(ad.id)}>
              <Text style={s.revokeTxt}>Revoke</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}


const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: C.background },
  scroll:       { padding: 20, paddingBottom: 130 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8, marginBottom: 12 },
  sectionHeader:{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  countBubble:  { backgroundColor: C.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 5 },
  countTxt:     { color: '#fff', fontSize: 10, fontWeight: '800' },
  divider:      { height: 1, backgroundColor: C.border, marginVertical: 20 },
  card:         { backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 4, borderWidth: 1, borderColor: C.border },
  input:        { borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: C.textPrimary, marginBottom: 10, backgroundColor: C.background },
  createBtn:    { backgroundColor: C.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  createTxt:    { color: '#fff', fontWeight: '700', fontSize: 14 },
  adminCard:    { backgroundColor: C.surface, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border },
  avatar:       { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:    { color: '#fff', fontWeight: '800', fontSize: 14 },
  adminName:    { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
  adminEmail:   { fontSize: 11, color: C.textSecondary, marginBottom: 2 },
  adminDate:    { fontSize: 10, color: C.textMuted },
  revokeBtn:    { backgroundColor: C.dangerLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ef9a9a' },
  revokeTxt:    { color: C.danger, fontSize: 11, fontWeight: '700' },
});
