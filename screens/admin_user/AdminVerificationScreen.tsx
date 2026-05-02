// screens/admin_user/AdminVerificationScreen.tsx
import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, Image, Modal, ActivityIndicator, Platform,
} from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import {
  C, fmtDate, getBadge, PendingAccount, VerifiedAccount,
  AppealRequest, StrikeLevel, MOCK_PENDING, MOCK_VERIFIED, MOCK_APPEALS,
} from './adminTypes';

// ── Verification modal ────────────────────────────────────────────────────────
function VerificationModal({
  visible, account, onClose, onApprove, onReject,
}: {
  visible: boolean; account: PendingAccount | null;
  onClose: () => void; onApprove: (id: string) => void; onReject: (id: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  if (!account) return null;
  const b = getBadge(account.accountType);
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={m.root}>
        <View style={m.header}>
          <TouchableOpacity onPress={onClose} style={m.closeBtn}>
            <Text style={m.closeTxt}>✕</Text>
          </TouchableOpacity>
          <Text style={m.headerTitle}>Document Review</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={m.body}>
          <View style={m.infoCard}>
            <View style={[m.badge, { backgroundColor: b.bg }]}>
              <Text style={[m.badgeTxt, { color: b.color }]}>{b.label}</Text>
            </View>
            <Text style={m.name}>{account.displayName}</Text>
            <Text style={m.email}>{account.email}</Text>
            <Text style={m.sub}>Submitted: {fmtDate(account.submittedAt)}</Text>
            <Text style={m.docLabel}>{account.documentLabel}</Text>
          </View>
          <View style={m.docWrap}>
            {loading && <ActivityIndicator color={C.primary} size="large" style={StyleSheet.absoluteFill} />}
            <Image source={{ uri: account.documentFullUri }} style={m.docImg} resizeMode="contain" onLoadEnd={() => setLoading(false)} />
          </View>
        </ScrollView>
        <View style={m.actions}>
          <TouchableOpacity style={[m.btn, m.rejectBtn]} onPress={() => onReject(account.id)}>
            <Text style={m.rejectTxt}>✗  Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[m.btn, m.approveBtn]} onPress={() => onApprove(account.id)}>
            <Text style={m.approveTxt}>✓  Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function AdminVerificationScreen() {
  const [pendingList, setPendingList]   = useState<PendingAccount[]>(MOCK_PENDING);
  const [verifiedList, setVerifiedList] = useState<VerifiedAccount[]>(MOCK_VERIFIED);
  const [appeals, setAppeals]           = useState<AppealRequest[]>(MOCK_APPEALS);
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'business' | 'coordinator'>('all');
  const [modalVisible, setModalVisible]     = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<PendingAccount | null>(null);

  const handleApprove = useCallback((id: string) => {
    Alert.alert('Approve Account', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => { setPendingList(p => p.filter(a => a.id !== id)); setModalVisible(false); } },
    ]);
  }, []);

  const handleReject = useCallback((id: string) => {
    Alert.alert('Reject Account', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => { setPendingList(p => p.filter(a => a.id !== id)); setModalVisible(false); } },
    ]);
  }, []);

  const handleStrike = (id: string, level: StrikeLevel) => {
    const msgs = ['Warning issued.', 'Account suspended for 7 days.', 'Account permanently banned.'];
    Alert.alert(`Strike ${level}`, msgs[level - 1], [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm', style: level === 3 ? 'destructive' : 'default',
        onPress: () => {
          setVerifiedList(v => v.map(a => a.id === id
            ? { ...a, strikeCount: level, status: level === 3 ? 'banned' : level === 2 ? 'suspended' : a.status }
            : a
          ));
        },
      },
    ]);
  };

  const handleReinstate = (id: string) => {
    Alert.alert('Reinstate Account', 'Reinstate this account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reinstate', onPress: () => setAppeals(a => a.filter(ap => ap.id !== id)) },
    ]);
  };

  const filteredVerified = verifiedList.filter(a => verifiedFilter === 'all' || a.accountType === verifiedFilter);

  return (
    <View style={s.root}>
      <CustomHeader settingsScreen="AdminSettings" profileScreen="AdminProfile" notificationsScreen="AdminNotifications" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Pending Approvals */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>PENDING APPROVALS</Text>
          {pendingList.length > 0 && (
            <View style={s.countBubble}><Text style={s.countTxt}>{pendingList.length}</Text></View>
          )}
        </View>

        {pendingList.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🎉</Text>
            <Text style={s.emptyTitle}>All clear!</Text>
            <Text style={s.emptyBody}>No pending verifications.</Text>
          </View>
        ) : pendingList.map(item => {
          const b = getBadge(item.accountType);
          return (
            <View key={item.id} style={s.pendingCard}>
              <TouchableOpacity onPress={() => { setSelectedAccount(item); setModalVisible(true); }} style={s.thumbWrap}>
                <Image source={{ uri: item.documentThumbnailUri }} style={s.thumb} resizeMode="cover" />
                <View style={s.thumbOverlay}><Text style={s.thumbOverlayTxt}>View</Text></View>
              </TouchableOpacity>
              <View style={s.pendingInfo}>
                <View style={[s.typeBadge, { backgroundColor: b.bg }]}>
                  <Text style={[s.typeTxt, { color: b.color }]}>{b.label}</Text>
                </View>
                <Text style={s.itemName} numberOfLines={1}>{item.displayName}</Text>
                <Text style={s.itemEmail} numberOfLines={1}>{item.email}</Text>
                <Text style={s.itemDoc}>{item.documentLabel}</Text>
                <Text style={s.itemDate}>{fmtDate(item.submittedAt)}</Text>
                <View style={s.inlineActions}>
                  <TouchableOpacity style={[s.inlineBtn, s.rejectBtn]} onPress={() => handleReject(item.id)}>
                    <Text style={s.rejectTxt}>✗ Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.inlineBtn, s.approveBtn]} onPress={() => handleApprove(item.id)}>
                    <Text style={s.approveTxt}>✓ Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        <View style={s.divider} />

        {/* Verified Accounts */}
        <Text style={s.sectionTitle}>VERIFIED ACCOUNTS</Text>
        <View style={s.filterRow}>
          {(['all', 'business', 'coordinator'] as const).map(f => (
            <TouchableOpacity key={f} style={[s.chip, verifiedFilter === f && s.chipActive]} onPress={() => setVerifiedFilter(f)}>
              <Text style={[s.chipTxt, verifiedFilter === f && s.chipTxtActive]}>
                {f === 'all' ? 'All' : f === 'business' ? 'Businesses' : 'Coordinators'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredVerified.map(acc => {
          const b = getBadge(acc.accountType);
          return (
            <View key={acc.id} style={s.verifiedCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                  <View style={[s.typeBadge, { backgroundColor: b.bg }]}>
                    <Text style={[s.typeTxt, { color: b.color }]}>{b.label}</Text>
                  </View>
                  {acc.status !== 'active' && (
                    <View style={[s.typeBadge, { backgroundColor: C.dangerLight }]}>
                      <Text style={[s.typeTxt, { color: C.danger }]}>{acc.status.toUpperCase()}</Text>
                    </View>
                  )}
                </View>
                <Text style={s.itemName}>{acc.displayName}</Text>
                <Text style={s.itemEmail}>{acc.email}</Text>
                <Text style={[s.itemDoc, { color: acc.strikeCount > 0 ? C.danger : C.textMuted }]}>
                  Strikes: {acc.strikeCount}/3
                </Text>
              </View>
              <View style={{ flexDirection: 'column', gap: 4 }}>
                {([1, 2, 3] as StrikeLevel[]).map(l => (
                  <TouchableOpacity key={l} style={[s.strikeBtn, acc.strikeCount >= l && s.strikeBtnActive]} onPress={() => handleStrike(acc.id, l)}>
                    <Text style={[s.strikeTxt, acc.strikeCount >= l && s.strikeTxtActive]}>S{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}

        <View style={s.divider} />

        {/* Appeal Requests */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>APPEAL REQUESTS</Text>
          {appeals.length > 0 && (
            <View style={s.countBubble}><Text style={s.countTxt}>{appeals.length}</Text></View>
          )}
        </View>

        {appeals.length === 0
          ? <Text style={s.emptyInline}>No active appeals.</Text>
          : appeals.map(ap => {
            const b = getBadge(ap.accountType);
            return (
              <View key={ap.id} style={s.appealCard}>
                <View style={[s.typeBadge, { backgroundColor: b.bg, marginBottom: 6 }]}>
                  <Text style={[s.typeTxt, { color: b.color }]}>{b.label}</Text>
                </View>
                <Text style={s.itemName}>{ap.displayName}</Text>
                <Text style={s.itemEmail}>{ap.email}</Text>
                <Text style={s.appealReason}>"{ap.reason}"</Text>
                <Text style={s.itemDate}>{fmtDate(ap.submittedAt)}</Text>
                <TouchableOpacity style={s.reinstateBtn} onPress={() => handleReinstate(ap.id)}>
                  <Text style={s.reinstateTxt}>↩ Reinstate Account</Text>
                </TouchableOpacity>
              </View>
            );
          })
        }

      </ScrollView>

      <VerificationModal
        visible={modalVisible}
        account={selectedAccount}
        onClose={() => setModalVisible(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: C.background },
  scroll:       { padding: 20, paddingBottom: 130 },
  sectionHeader:{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.8 },
  countBubble:  { backgroundColor: C.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 5 },
  countTxt:     { color: '#fff', fontSize: 10, fontWeight: '800' },
  divider:      { height: 1, backgroundColor: C.border, marginVertical: 20 },
  emptyCard:    { backgroundColor: C.surface, borderRadius: 18, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  emptyTitle:   { fontSize: 16, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  emptyBody:    { fontSize: 13, color: C.textSecondary },
  emptyInline:  { color: C.textMuted, fontSize: 13, marginBottom: 12 },
  pendingCard:  { backgroundColor: C.surface, borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  thumbWrap:    { width: 88, minHeight: 130 },
  thumb:        { width: '100%', height: '100%' },
  thumbOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.28)', alignItems: 'center', justifyContent: 'center' },
  thumbOverlayTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  pendingInfo:  { flex: 1, padding: 12 },
  typeBadge:    { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  typeTxt:      { fontSize: 10, fontWeight: '700' },
  itemName:     { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginTop: 4, marginBottom: 2 },
  itemEmail:    { fontSize: 11, color: C.textSecondary, marginBottom: 2 },
  itemDoc:      { fontSize: 11, color: C.primaryLight, fontWeight: '600', marginBottom: 2 },
  itemDate:     { fontSize: 10, color: C.textMuted, marginBottom: 8 },
  inlineActions:{ flexDirection: 'row', gap: 6 },
  inlineBtn:    { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  rejectBtn:    { backgroundColor: C.dangerLight, borderWidth: 1, borderColor: '#ef9a9a' },
  approveBtn:   { backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#a5d6a7' },
  rejectTxt:    { color: C.danger, fontSize: 11, fontWeight: '700' },
  approveTxt:   { color: C.primary, fontSize: 11, fontWeight: '700' },
  filterRow:    { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  chip:         { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  chipActive:   { backgroundColor: C.primary, borderColor: C.primary },
  chipTxt:      { fontSize: 12, fontWeight: '600', color: C.textSecondary },
  chipTxtActive:{ color: '#fff' },
  verifiedCard: { backgroundColor: C.surface, borderRadius: 16, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border },
  strikeBtn:    { width: 32, height: 32, borderRadius: 8, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  strikeBtnActive: { backgroundColor: C.danger, borderColor: C.danger },
  strikeTxt:    { fontSize: 11, fontWeight: '700', color: C.textMuted },
  strikeTxtActive: { color: '#fff' },
  appealCard:   { backgroundColor: C.surface, borderRadius: 16, marginBottom: 10, padding: 14, borderWidth: 1, borderColor: C.border, borderLeftWidth: 4, borderLeftColor: C.warning },
  appealReason: { fontSize: 12, color: C.textSecondary, fontStyle: 'italic', marginVertical: 6, lineHeight: 18 },
  reinstateBtn: { backgroundColor: '#e8f5e9', borderRadius: 8, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: '#a5d6a7', marginTop: 4 },
  reinstateTxt: { color: C.primary, fontSize: 12, fontWeight: '700' },
});

const m = StyleSheet.create({
  root:       { flex: 1, backgroundColor: C.background },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.primary },
  closeBtn:   { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  closeTxt:   { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerTitle:{ color: '#fff', fontSize: 17, fontWeight: '700' },
  body:       { padding: 16 },
  infoCard:   { backgroundColor: C.surface, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  badge:      { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 8 },
  badgeTxt:   { fontSize: 11, fontWeight: '700' },
  name:       { fontSize: 18, fontWeight: '800', color: C.textPrimary, marginBottom: 4 },
  email:      { fontSize: 13, color: C.textSecondary, marginBottom: 4 },
  sub:        { fontSize: 11, color: C.textMuted, marginBottom: 6 },
  docLabel:   { fontSize: 12, fontWeight: '600', color: C.primaryLight },
  docWrap:    { backgroundColor: C.surface, borderRadius: 14, overflow: 'hidden', minHeight: 280, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  docImg:     { width: '100%', height: 360 },
  actions:    { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: Platform.OS === 'android' ? 20 : 0, paddingTop: 12, gap: 12, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border },
  btn:        { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  rejectBtn:  { backgroundColor: C.dangerLight, borderWidth: 1.5, borderColor: C.danger },
  approveBtn: { backgroundColor: C.primary },
  rejectTxt:  { color: C.danger, fontSize: 15, fontWeight: '800' },
  approveTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
