// screens/business_user/PickupsScreen.tsx
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



const PICKUPS = [
  { id: 1, item: 'Fresh Produce — 45 kg', npo: 'Durban Food Bank', driver: 'Sipho M.',  status: 'In Transit' as const, distance: '2.3 km' },
  { id: 2, item: 'Bakery — 80 units',     npo: 'Ubuntu Kitchen',   driver: 'Pending',   status: 'Claimed'    as const, distance: '—'      },
  { id: 3, item: 'Dairy — 30 L',          npo: '—',                driver: '—',         status: 'Available'  as const, distance: '—'      },
  { id: 4, item: 'Dry Goods — 22 kg',     npo: 'Umlazi Outreach',  driver: 'Thabo K.',  status: 'Completed'  as const, distance: '—'      },
];

type Status = 'In Transit' | 'Claimed' | 'Available' | 'Completed';

function statusStyle(status: Status) {
  switch (status) {
    case 'In Transit': return { color: '#2E7BBF', bg: '#E6F1FB', border: 'rgba(46,123,191,0.2)'  };
    case 'Claimed':    return { color: '#F97316', bg: '#FFF7ED', border: 'rgba(249,115,22,0.2)'  };
    case 'Available':  return { color: '#10B981', bg: '#F0FDF4', border: 'rgba(16,185,129,0.2)'  };
    case 'Completed':  return { color: '#94A3B8', bg: '#F8FAFC', border: 'rgba(148,163,184,0.2)' };
  }
}

const QR_CELLS = [
  [0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],
  [4,4],[5,5],[6,6],[7,7],[8,8],[9,9],
  [0,7],[0,8],[0,9],[1,9],[2,7],[2,9],
  [7,0],[7,2],[8,0],[9,0],[9,1],[9,2],[9,8],
];

function QRCode() {
  const CELL = 11;
  const grid: boolean[][] = Array.from({ length: 10 }, () => Array(10).fill(false));
  QR_CELLS.forEach(([x, y]) => { grid[y][x] = true; });
  return (
    <View style={{ flexDirection: 'column' }}>
      {grid.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row' }}>
          {row.map((filled, ci) => (
            <View key={ci} style={{ width: CELL, height: CELL, backgroundColor: filled ? '#1C3A2E' : 'transparent' }} />
          ))}
        </View>
      ))}
    </View>
  );
}

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

function StatusBadge({ status }: { status: Status }) {
  const s = statusStyle(status);
  return (
    <View style={{
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 20, backgroundColor: s.bg,
      borderWidth: 1, borderColor: s.border,
    }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: s.color }}>{status}</Text>
    </View>
  );
}

export default function PickupsScreen() {
  const [activePickup, setActivePickup] = useState<number | null>(null);
  const [showQR,       setShowQR]       = useState(false);
  const [msgInput,     setMsgInput]     = useState('');
  const [messages,     setMessages]     = useState([
    { from: 'npo', text: 'Hi! Our driver is en route. ETA ~12 minutes.',          time: '15:42' },
    { from: 'me',  text: 'Perfect. Please use the back loading dock entrance.',   time: '15:44' },
  ]);

  const selected = activePickup !== null ? PICKUPS.find(p => p.id === activePickup) : null;

  const sendMsg = () => {
    if (msgInput.trim()) {
      setMessages(prev => [...prev, { from: 'me', text: msgInput.trim(), time: 'now' }]);
      setMsgInput('');
    }
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
          Active Pickups
        </Text>
        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>
          Manage incoming food collection requests.
        </Text>

        {/* ── Queue view ── */}
        {!activePickup ? (
          <>
            <SectionLabel text="Live Pickup Queue" />
            {PICKUPS.map(p => {
              const tappable = p.status !== 'Available' && p.status !== 'Completed';
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={tappable ? () => setActivePickup(p.id) : undefined}
                  activeOpacity={tappable ? 0.75 : 1}
                  style={{
                    backgroundColor: '#fff', borderRadius: 20,
                    padding: 16, marginBottom: 10,
                    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <Text style={{ fontWeight: '700', fontSize: 14, color: '#1E293B', marginBottom: 5 }}>
                        {p.item}
                      </Text>
                      {p.npo !== '—' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                          <Feather name="users" size={11} color="#94A3B8" />
                          <Text style={{ fontSize: 12, color: '#64748B' }}>{p.npo}</Text>
                        </View>
                      )}
                      {p.driver !== '—' && p.driver !== 'Pending' && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <Feather name="user" size={11} color="#94A3B8" />
                          <Text style={{ fontSize: 12, color: '#64748B' }}>{p.driver} · {p.distance}</Text>
                        </View>
                      )}
                    </View>
                    <StatusBadge status={p.status} />
                  </View>

                  {p.status === 'In Transit' && (
                    <View style={{
                      marginTop: 12, backgroundColor: '#E6F1FB',
                      borderRadius: 12, padding: 11,
                      flexDirection: 'row', alignItems: 'center', gap: 8,
                    }}>
                      <Feather name="truck" size={14} color="#2E7BBF" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#2E7BBF', flex: 1 }}>
                        Arriving in ~8 min — Tap to manage
                      </Text>
                      <Feather name="chevron-right" size={13} color="#2E7BBF" />
                    </View>
                  )}

                  {p.status === 'Available' && (
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={{
                        marginTop: 12, borderWidth: 1, borderColor: '#FECACA',
                        borderRadius: 12, paddingVertical: 9,
                        alignItems: 'center', backgroundColor: '#FFF5F5',
                        flexDirection: 'row', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <Feather name="trash-2" size={13} color="#EF4444" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#EF4444' }}>Mark as Wasted</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        ) : selected ? (
          <>
            <TouchableOpacity
              onPress={() => { setActivePickup(null); setShowQR(false); }}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}
            >
              <Feather name="arrow-left" size={16} color="#10B981" />
              <Text style={{ color: '#10B981', fontWeight: '700', fontSize: 14 }}>Back to Queue</Text>
            </TouchableOpacity>

            <View style={{
              backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: '#1E293B', flex: 1 }}>
                  {selected.item}
                </Text>
                <StatusBadge status={selected.status} />
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: 'NPO',      value: selected.npo,      icon: 'users'   as const },
                  { label: 'Driver',   value: selected.driver,   icon: 'user'    as const },
                  { label: 'Distance', value: selected.distance, icon: 'map-pin' as const },
                  { label: 'ETA',      value: '~8 min',          icon: 'clock'   as const },
                ].map(d => (
                  <View key={d.label} style={{
                    backgroundColor: '#F8FAFC', borderRadius: 14, padding: 12,
                    width: '47%', borderWidth: 1, borderColor: '#F1F5F9',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <Feather name={d.icon} size={10} color="#94A3B8" />
                      <Text style={{ fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {d.label}
                      </Text>
                    </View>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: '#1E293B' }}>{d.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowQR(v => !v)}
              activeOpacity={0.85}
              style={{
                backgroundColor: showQR ? '#F8FAFC' : '#1C3A2E',
                borderRadius: 16, paddingVertical: 14, marginBottom: 12,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderWidth: showQR ? 1.5 : 0, borderColor: '#E2E8F0',
              }}
            >
              <Feather name="grid" size={16} color={showQR ? '#64748B' : '#4ADE80'} />
              <Text style={{ fontWeight: '700', fontSize: 14, color: showQR ? '#64748B' : '#fff' }}>
                {showQR ? 'Hide Verification Code' : 'Show Verification Code'}
              </Text>
            </TouchableOpacity>

            {showQR && (
              <View style={{
                backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 12,
                alignItems: 'center',
                shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
              }}>
                <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' }}>
                  <QRCode />
                </View>
                <Text style={{ fontWeight: '800', fontSize: 30, color: '#1E293B', letterSpacing: 12, marginTop: 18, marginBottom: 4 }}>
                  7342
                </Text>
                <Text style={{ fontSize: 12, color: '#94A3B8' }}>4-digit PIN fallback</Text>
              </View>
            )}

            <SectionLabel text="Message Thread" />
            <View style={{
              backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 12,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            }}>
              <ScrollView style={{ maxHeight: 180, marginBottom: 12 }}>
                {messages.map((m, i) => (
                  <View key={i} style={{
                    flexDirection: 'row',
                    justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start',
                    marginBottom: 10,
                  }}>
                    <View style={{
                      maxWidth: '78%', padding: 11, borderRadius: 16,
                      backgroundColor: m.from === 'me' ? '#1C3A2E' : '#F1F5F9',
                    }}>
                      <Text style={{ fontSize: 13, lineHeight: 18, color: m.from === 'me' ? '#fff' : '#1E293B' }}>
                        {m.text}
                      </Text>
                      <Text style={{ fontSize: 10, marginTop: 4, opacity: 0.6, color: m.from === 'me' ? '#fff' : '#94A3B8' }}>
                        {m.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  value={msgInput}
                  onChangeText={setMsgInput}
                  onSubmitEditing={sendMsg}
                  placeholder="Type a message..."
                  placeholderTextColor="#CBD5E1"
                  style={{
                    flex: 1, paddingVertical: 10, paddingHorizontal: 14,
                    borderWidth: 1.5, borderColor: '#E2E8F0',
                    borderRadius: 12, fontSize: 13, color: '#1E293B',
                    backgroundColor: '#F8FAFC',
                  }}
                />
                <TouchableOpacity
                  onPress={sendMsg}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: '#1C3A2E', borderRadius: 12,
                    paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Feather name="send" size={15} color="#4ADE80" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{
              backgroundColor: '#FFF7ED', borderRadius: 20, padding: 16,
              borderWidth: 1, borderColor: 'rgba(249,115,22,0.25)', marginBottom: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Feather name="alert-triangle" size={15} color="#F97316" />
                <Text style={{ fontWeight: '700', fontSize: 13, color: '#C2410C' }}>
                  Pickup window expires at 18:00
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 14, lineHeight: 18 }}>
                If the driver doesn't arrive, is this food still safe to donate?
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1, paddingVertical: 11, borderRadius: 12,
                    backgroundColor: '#F0FDF4', borderWidth: 1.5,
                    borderColor: 'rgba(16,185,129,0.3)', alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#10B981' }}>Yes, Relist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flex: 1, paddingVertical: 11, borderRadius: 12,
                    backgroundColor: '#FEF2F2', borderWidth: 1.5,
                    borderColor: 'rgba(239,68,68,0.2)', alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#EF4444' }}>No, Mark Wasted</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}