// screens/admin_user/AdminModerationScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import CustomHeader from '../../components/CustomHeader';
import { C, fmtDate, getCategoryColor, DisputeTicket, MOCK_TICKETS } from './adminTypes';

export default function AdminModerationScreen() {
  const [tickets, setTickets] = useState<DisputeTicket[]>(MOCK_TICKETS);

  const handleResolve = (id: string) => {
    setTickets(t => t.map(tk => tk.id === id ? { ...tk, resolved: true } : tk));
  };

  const unresolved     = tickets.filter(t => !t.resolved);
  const conductTickets = unresolved.filter(t => t.category !== 'system');
  const systemTickets  = unresolved.filter(t => t.category === 'system');

  return (
    <View style={s.root}>
      <CustomHeader settingsScreen="AdminSettings" profileScreen="AdminProfile" notificationsScreen="AdminNotifications" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Conduct Disputes */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>CONDUCT DISPUTES</Text>
          {conductTickets.length > 0 && (
            <View style={s.countBubble}><Text style={s.countTxt}>{conductTickets.length}</Text></View>
          )}
        </View>

        {conductTickets.length === 0
          ? <Text style={s.emptyInline}>No conduct disputes.</Text>
          : conductTickets.map(tk => {
            const cat = getCategoryColor(tk.category);
            return (
              <View key={tk.id} style={s.ticketCard}>
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  <View style={[s.badge, { backgroundColor: cat.bg }]}>
                    <Text style={[s.badgeTxt, { color: cat.color }]}>{cat.label}</Text>
                  </View>
                  {tk.hasPhoto && (
                    <View style={[s.badge, { backgroundColor: '#f3e5f5' }]}>
                      <Text style={[s.badgeTxt, { color: '#6a1b9a' }]}>📷 Photo</Text>
                    </View>
                  )}
                </View>
                <Text style={s.itemName}>By: {tk.submittedBy}</Text>
                {tk.counterparty && <Text style={s.itemEmail}>Against: {tk.counterparty}</Text>}
                <Text style={s.description}>"{tk.description}"</Text>
                <Text style={s.itemDate}>{fmtDate(tk.timestamp)}</Text>
                <TouchableOpacity style={s.resolveBtn} onPress={() => handleResolve(tk.id)}>
                  <Text style={s.resolveTxt}>✓ Mark Resolved</Text>
                </TouchableOpacity>
              </View>
            );
          })
        }

        <View style={s.divider} />

        {/* System Issues */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>SYSTEM ISSUES</Text>
          {systemTickets.length > 0 && (
            <View style={s.countBubble}><Text style={s.countTxt}>{systemTickets.length}</Text></View>
          )}
        </View>

        {systemTickets.length === 0
          ? <Text style={s.emptyInline}>No system issues.</Text>
          : systemTickets.map(tk => (
            <View key={tk.id} style={[s.ticketCard, { borderLeftWidth: 4, borderLeftColor: C.info }]}>
              <Text style={s.itemName}>Reported by: {tk.submittedBy}</Text>
              <Text style={s.description}>"{tk.description}"</Text>
              <Text style={s.itemDate}>{fmtDate(tk.timestamp)}</Text>
              <TouchableOpacity
                style={[s.resolveBtn, { backgroundColor: C.infoLight, borderColor: C.info }]}
                onPress={() => handleResolve(tk.id)}
              >
                <Text style={[s.resolveTxt, { color: C.info }]}>✓ Mark Fixed</Text>
              </TouchableOpacity>
            </View>
          ))
        }

        {unresolved.length === 0 && (
          <View style={s.allClearCard}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>✅</Text>
            <Text style={s.allClearTitle}>All clear!</Text>
            <Text style={s.allClearBody}>No open tickets right now.</Text>
          </View>
        )}

      </ScrollView>
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
  emptyInline:  { color: C.textMuted, fontSize: 13, marginBottom: 12 },
  ticketCard:   { backgroundColor: C.surface, borderRadius: 16, marginBottom: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  badge:        { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeTxt:     { fontSize: 10, fontWeight: '700' },
  itemName:     { fontSize: 14, fontWeight: '700', color: C.textPrimary, marginBottom: 2 },
  itemEmail:    { fontSize: 11, color: C.textSecondary, marginBottom: 2 },
  description:  { fontSize: 12, color: C.textSecondary, fontStyle: 'italic', marginVertical: 6, lineHeight: 18 },
  itemDate:     { fontSize: 10, color: C.textMuted, marginBottom: 8 },
  resolveBtn:   { backgroundColor: '#e8f5e9', borderRadius: 8, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: '#a5d6a7' },
  resolveTxt:   { color: C.primary, fontSize: 12, fontWeight: '700' },
  allClearCard: { backgroundColor: C.surface, borderRadius: 18, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  allClearTitle:{ fontSize: 16, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  allClearBody: { fontSize: 13, color: C.textSecondary },
});
