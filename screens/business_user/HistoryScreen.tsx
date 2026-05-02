// screens/business_user/HistoryScreen.tsx
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



const DONATIONS = [
  { date: '2025-06-22', item: 'Fresh Produce', qty: '45 kg',       npo: 'Durban Food Bank', status: 'Completed' as const },
  { date: '2025-06-20', item: 'Bakery',         qty: '80 units',    npo: 'Ubuntu Kitchen',   status: 'Completed' as const },
  { date: '2025-06-18', item: 'Dairy',           qty: '30 L',        npo: 'SPAR Outreach',    status: 'Completed' as const },
  { date: '2025-06-15', item: 'Dry Goods',       qty: '22 kg',       npo: 'Umlazi Outreach',  status: 'Completed' as const },
  { date: '2025-06-10', item: 'Prepared Meals',  qty: '60 portions', npo: 'Mzukulu',          status: 'Completed' as const },
  { date: '2025-06-05', item: 'Fresh Produce',   qty: '38 kg',       npo: 'Durban Food Bank', status: 'Wasted'    as const },
];

type Status = 'Completed' | 'Wasted';

function statusStyle(s: Status) {
  return s === 'Completed'
    ? { color: '#10B981', bg: '#F0FDF4', border: 'rgba(16,185,129,0.2)' }
    : { color: '#EF4444', bg: '#FEF2F2', border: 'rgba(239,68,68,0.2)'  };
}

export default function HistoryScreen() {
  const [search, setSearch] = useState('');

  const filtered = DONATIONS.filter(d =>
    d.item.toLowerCase().includes(search.toLowerCase()) ||
    d.npo.toLowerCase().includes(search.toLowerCase())
  );

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
          Donation History
        </Text>
        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>
          Track your food donations and generate certificates.
        </Text>

        {/* ── Stats row ── */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Donated', value: '275 kg',  color: '#2D6A4F', icon: 'package'  as const },
            { label: 'Rand Value',    value: 'R 8,250', color: '#F97316', icon: 'trending-up' as const },
          ].map(stat => (
            <View key={stat.label} style={{
              flex: 1, backgroundColor: '#fff', borderRadius: 20,
              padding: 16, alignItems: 'center',
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            }}>
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: stat.color === '#2D6A4F'
                  ? 'rgba(45,106,79,0.1)' : 'rgba(249,115,22,0.1)',
                alignItems: 'center', justifyContent: 'center', marginBottom: 8,
              }}>
                <Feather name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text style={{
                fontSize: 20, fontWeight: '800', color: stat.color, marginBottom: 2,
              }}>
                {stat.value}
              </Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '700' }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Search ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: '#fff', borderRadius: 14,
          borderWidth: 1, borderColor: '#E2E8F0',
          paddingHorizontal: 14, height: 48, marginBottom: 20,
          shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1,
        }}>
          <Feather name="search" size={15} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search by item or NPO..."
            placeholderTextColor="#CBD5E1"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={15} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Section label ── */}
        <Text style={{
          color: '#94A3B8', fontSize: 11, fontWeight: '700',
          letterSpacing: 1, textTransform: 'uppercase',
          marginBottom: 10, paddingLeft: 2,
        }}>
          Donation Log
        </Text>

        {/* ── Donation cards ── */}
        {filtered.map((d, i) => {
          const s = statusStyle(d.status);
          return (
            <View key={i} style={{
              backgroundColor: '#fff', borderRadius: 20, padding: 16,
              marginBottom: 10,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={{
                    fontWeight: '700', fontSize: 14, color: '#1E293B', marginBottom: 6,
                  }}>
                    {d.item} — {d.qty}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <Feather name="users" size={11} color="#94A3B8" />
                    <Text style={{ fontSize: 12, color: '#64748B' }}>{d.npo}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Feather name="calendar" size={11} color="#94A3B8" />
                    <Text style={{ fontSize: 11, color: '#94A3B8' }}>{d.date}</Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 8 }}>
                  {/* Status badge */}
                  <View style={{
                    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
                    backgroundColor: s.bg, borderWidth: 1, borderColor: s.border,
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: s.color }}>
                      {d.status}
                    </Text>
                  </View>

                  {d.status === 'Completed' && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    >
                      <Feather name="file-text" size={11} color="#2E7BBF" />
                      <Text style={{ fontSize: 11, color: '#2E7BBF', fontWeight: '700' }}>
                        Certificate
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={{
            backgroundColor: '#fff', borderRadius: 20, padding: 32,
            alignItems: 'center', marginBottom: 12,
          }}>
            <Feather name="inbox" size={32} color="#CBD5E1" />
            <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600', marginTop: 12 }}>
              No donations match your search
            </Text>
          </View>
        )}

        {/* ── Tax certificate banner ── */}
        <View style={{
          backgroundColor: 'rgba(45,106,79,0.07)',
          borderRadius: 20, padding: 18, marginTop: 4,
          borderWidth: 1, borderColor: 'rgba(45,106,79,0.15)',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Feather name="award" size={16} color="#2D6A4F" />
            <Text style={{ fontWeight: '700', fontSize: 13, color: '#2D6A4F' }}>
              Tax Certificates — June 2025
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 14, lineHeight: 18 }}>
            Generate a SARS-compliant certificate for your total donations this period.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: '#2D6A4F', borderRadius: 12,
              paddingVertical: 12, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
              shadowColor: '#2D6A4F', shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
            }}
          >
            <Feather name="download" size={15} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
              Generate Monthly Certificate
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}