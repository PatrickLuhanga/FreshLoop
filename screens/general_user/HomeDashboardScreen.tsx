// screens/general_user/HomeDashboardScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');
type Nav = any;

const AI_TIPS = [
  { tip: 'Use wilting spinach in a smoothie — frozen works too.', icon: '💡' },
  { tip: 'Stale bread makes the best French toast or breadcrumbs.', icon: '🍞' },
  { tip: 'Overripe bananas? Freeze them for baking later.', icon: '🍌' },
  { tip: 'Store herbs in a glass of water to double their life.', icon: '🌿' },
  { tip: 'Egg nearing expiry? Hard boil it — buys 1 extra week.', icon: '🥚' },
];

const EXPIRING_ITEMS = [
  { id: '1', name: 'Milk',     qty: '2L',     daysLeft: 1, emoji: '🥛' },
  { id: '2', name: 'Spinach',  qty: '1 bag',  daysLeft: 1, emoji: '🥬' },
  { id: '3', name: 'Eggs',     qty: '6',      daysLeft: 2, emoji: '🥚' },
  { id: '4', name: 'Bread',    qty: '1 loaf', daysLeft: 2, emoji: '🍞' },
  { id: '5', name: 'Tomatoes', qty: '4',      daysLeft: 3, emoji: '🍅' },
];

const ALL_ITEMS = [
  { id: '1', name: 'Apples',   qty: 'x6', expiry: '25 Apr', status: 'Fresh'   },
  { id: '2', name: 'Milk',     qty: '2L', expiry: '20 Apr', status: 'Soon'    },
  { id: '3', name: 'Tomatoes', qty: 'x4', expiry: '22 Apr', status: 'Fresh'   },
  { id: '4', name: 'Eggs',     qty: 'x6', expiry: '18 Apr', status: 'Expired' },
  { id: '5', name: 'Bread',    qty: 'x1', expiry: '21 Apr', status: 'Soon'    },
];

function urgencyColors(daysLeft: number) {
  if (daysLeft <= 1) return { bg: '#FEF2F2', border: '#FECACA', text: '#EF4444', badge: '#FEE2E2' };
  if (daysLeft === 2) return { bg: '#FFF7ED', border: '#FED7AA', text: '#F97316', badge: '#FFEDD5' };
  return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', badge: '#DCFCE7' };
}

function statusColor(status: string) {
  if (status === 'Fresh')   return '#16A34A';
  if (status === 'Soon')    return '#F97316';
  if (status === 'Expired') return '#EF4444';
  return '#94A3B8';
}

function ExpiringCard({ item, onPress }: { item: typeof EXPIRING_ITEMS[0]; onPress: () => void }) {
  const c = urgencyColors(item.daysLeft);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        width: 115,
        backgroundColor: c.bg,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: 20,
        padding: 14,
        marginRight: 10,
      }}>
      <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
      <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 13, marginTop: 8 }} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>{item.qty}</Text>
      <View style={{
        marginTop: 8, paddingHorizontal: 8, paddingVertical: 3,
        backgroundColor: c.badge, borderRadius: 20, alignSelf: 'flex-start',
      }}>
        <Text style={{ color: c.text, fontSize: 10, fontWeight: '700' }}>
          {item.daysLeft <= 1 ? 'Today!' : `${item.daysLeft} days`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function PantryRow({ item, onPress }: { item: typeof ALL_ITEMS[0]; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 18,
        paddingHorizontal: 14, paddingVertical: 12, marginBottom: 8,
        shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
      }}>
      <View style={{
        width: 36, height: 36, backgroundColor: '#F0FDF4',
        borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12,
      }}>
        <Feather name="package" size={15} color="#2D6A4F" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#1E293B', fontWeight: '600', fontSize: 13 }}>{item.name}</Text>
        <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>{item.qty} · Expires {item.expiry}</Text>
      </View>
      <Text style={{ color: statusColor(item.status), fontSize: 11, fontWeight: '700', marginRight: 6 }}>
        {item.status}
      </Text>
      <Feather name="chevron-right" size={14} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

export default function HomeDashboardScreen() {
  const { session } = useAuth();
  const firstName = session?.name?.split(' ')[0] ?? 'there';
  const navigation = useNavigation<Nav>();
  const [tipIndex, setTipIndex] = useState(0);
  const wasteStreak = 5;

  const freshCount   = ALL_ITEMS.filter(i => i.status === 'Fresh').length;
  const soonCount    = ALL_ITEMS.filter(i => i.status === 'Soon').length;
  const expiredCount = ALL_ITEMS.filter(i => i.status === 'Expired').length;
  const currentTip   = AI_TIPS[tipIndex];

  // ── Quick Access links ────────────────────────────────────────────────────
  const QUICK_LINKS: { label: string; icon: React.ComponentProps<typeof Feather>['name']; onPress: () => void }[] = [
    { label: 'Quick Add', icon: 'plus-circle', onPress: () => navigation.navigate('QuickAdd')    },
    { label: 'Pantry',    icon: 'box',         onPress: () => navigation.navigate('Pantry')      },
    { label: 'Recipes',   icon: 'book-open',   onPress: () => navigation.navigate('Recipes')     },
    { label: 'Meal Plan', icon: 'calendar',    onPress: () => navigation.navigate('MealPlan')    },
    { label: 'Insights',  icon: 'bar-chart-2', onPress: () => navigation.navigate('Analytics')   },
    { label: 'Donate',    icon: 'heart',       onPress: () => navigation.navigate('DonationHub') },
    // ↓ links to the same ReportIssueScreen reachable from DonationHub
    { label: 'Report',    icon: 'flag',        onPress: () => navigation.navigate('Report' as never) },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>

      {/* ── SHARED HEADER ── */}
      <CustomHeader />

      {/* ── Body ── */}
      <View style={{ flex: 1, overflow: 'hidden' }}>

        {/* Background blobs */}
        <View style={{ position: 'absolute', top: 30, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: '#C5D8C3', opacity: 0.35 }} />
        <View style={{ position: 'absolute', top: 320, left: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: '#C5D8C3', opacity: 0.25 }} />
        <View style={{ position: 'absolute', bottom: 40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: '#F97316', opacity: 0.04 }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>

          {/* Greeting + stat boxes */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20, paddingTop: 22 }}>
            <Text style={{ color: '#1C3A2E', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 4 }}>
              Hello {firstName} <Text style={{ color: '#F59E0B' }}>👋🏾</Text>
            </Text>
            <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 18 }}>
              {soonCount + expiredCount} items need attention today
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              {([
                { label: 'Fresh',    value: freshCount,   color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0', tab: 'Pantry' },
                { label: 'Expiring', value: soonCount,    color: '#EA580C', bg: '#FFEDD5', border: '#FED7AA', tab: 'Pantry' },
                { label: 'Expired',  value: expiredCount, color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', tab: 'Pantry' },
              ] as const).map(s => (
                <TouchableOpacity
                  key={s.label}
                  onPress={() => navigation.navigate(s.tab)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1, backgroundColor: s.bg, borderWidth: 1, borderColor: s.border,
                    borderRadius: 18, paddingVertical: 14, alignItems: 'center',
                    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
                  }}>
                  <Text style={{ color: s.color, fontWeight: '800', fontSize: 26 }}>{s.value}</Text>
                  <Text style={{ color: s.color, fontSize: 11, marginTop: 3, fontWeight: '600', opacity: 0.8 }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* AI Tip */}
          <TouchableOpacity
            onPress={() => setTipIndex((tipIndex + 1) % AI_TIPS.length)}
            activeOpacity={0.85}
            style={{
              marginHorizontal: 20, marginBottom: 16,
              backgroundColor: '#2D6A4F', borderRadius: 24, padding: 20,
              shadowColor: '#2D6A4F', shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>DAILY TIP</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Tap for next</Text>
                <Feather name="refresh-cw" size={11} color="rgba(255,255,255,0.5)" />
              </View>
            </View>
            <Text style={{ fontSize: 24 }}>{currentTip.icon}</Text>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15, marginTop: 8, lineHeight: 22 }}>{currentTip.tip}</Text>
            <View style={{ flexDirection: 'row', marginTop: 14, gap: 6 }}>
              {AI_TIPS.map((_, i) => (
                <View key={i} style={{
                  height: 4, flex: i === tipIndex ? 2 : 1, borderRadius: 2,
                  backgroundColor: i === tipIndex ? '#86EFAC' : 'rgba(255,255,255,0.25)',
                }} />
              ))}
            </View>
          </TouchableOpacity>

          {/* Streak */}
          <View style={{
            marginHorizontal: 20, marginBottom: 16,
            backgroundColor: '#fff', borderRadius: 24, padding: 18,
            flexDirection: 'row', alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
          }}>
            <View style={{
              width: 58, height: 58, borderRadius: 29,
              backgroundColor: '#E2EBE1', borderWidth: 4, borderColor: '#2D6A4F',
              alignItems: 'center', justifyContent: 'center', marginRight: 14,
            }}>
              <Text style={{ color: '#2D6A4F', fontWeight: '800', fontSize: 20 }}>{wasteStreak}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 13 }}>{wasteStreak}-day zero-waste streak 🔥</Text>
              <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 3 }}>3 meals cooked from pantry this week</Text>
              <View style={{ flexDirection: 'row', marginTop: 8, gap: 4 }}>
                {[...Array(7)].map((_, i) => (
                  <View key={i} style={{ height: 6, flex: 1, borderRadius: 3, backgroundColor: i < wasteStreak ? '#2D6A4F' : '#E2E8F0' }} />
                ))}
              </View>
            </View>
          </View>

          {/* Expiring Soon */}
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 }}>
              <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 15 }}>Expiring Soon</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Pantry')}>
                <Text style={{ color: '#2D6A4F', fontSize: 12, fontWeight: '600' }}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}>
              {EXPIRING_ITEMS.map(item => (
                <ExpiringCard key={item.id} item={item} onPress={() => navigation.navigate('Pantry')} />
              ))}
            </ScrollView>
          </View>

          {/* Quick Access */}
          <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
            <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 15, marginBottom: 12 }}>Quick Access</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {QUICK_LINKS.map(link => (
                <TouchableOpacity
                  key={link.label}
                  onPress={link.onPress}
                  activeOpacity={0.8}
                  style={{
                    width: (width - 70) / 3,
                    backgroundColor: '#fff',
                    borderRadius: 18,
                    alignItems: 'center', justifyContent: 'center',
                    paddingVertical: 14,
                    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
                  }}
                >
                  <View style={{
                    width: 38, height: 38, borderRadius: 12,
                    backgroundColor: '#F0FDF4',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
                  }}>
                    <Feather name={link.icon} size={17} color="#2D6A4F" />
                  </View>
                  <Text style={{ color: '#475569', fontSize: 10, fontWeight: '600', textAlign: 'center' }}>
                    {link.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* All Food Items */}
          <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 15 }}>All Food Items</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Pantry')}>
                <Text style={{ color: '#2D6A4F', fontSize: 12, fontWeight: '600' }}>View pantry</Text>
              </TouchableOpacity>
            </View>
            {ALL_ITEMS.map(item => (
              <PantryRow key={item.id} item={item} onPress={() => navigation.navigate('Pantry')} />
            ))}
          </View>

          {/* Monthly Waste Trend */}
          <View style={{
            marginHorizontal: 20, marginBottom: 16,
            backgroundColor: '#fff', borderRadius: 24, padding: 20,
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
          }}>
            <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 15, marginBottom: 16 }}>Monthly Waste Trend</Text>
            {[
              { month: 'Jan', items: 7, color: '#EF4444' },
              { month: 'Feb', items: 5, color: '#F97316' },
              { month: 'Mar', items: 3, color: '#F97316' },
              { month: 'Apr', items: 1, color: '#34D399' },
            ].map(row => (
              <View key={row.month} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ color: '#94A3B8', fontSize: 12, width: 30 }}>{row.month}</Text>
                <View style={{ flex: 1, backgroundColor: '#F1F5F9', borderRadius: 6, height: 12, marginHorizontal: 10, overflow: 'hidden' }}>
                  <View style={{ width: `${(row.items / 7) * 100}%`, height: 12, backgroundColor: row.color, borderRadius: 6 }} />
                </View>
                <Text style={{ color: '#94A3B8', fontSize: 11, width: 44, textAlign: 'right' }}>{row.items} items</Text>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => navigation.navigate('Analytics')}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#F0FDF4', borderRadius: 14,
                paddingHorizontal: 12, paddingVertical: 8, marginTop: 4,
              }}>
              <Feather name="trending-down" size={13} color="#16A34A" />
              <Text style={{ color: '#15803D', fontSize: 12, fontWeight: '600', marginLeft: 6, flex: 1 }}>
                Waste reduced by 71% since January!
              </Text>
              <Feather name="chevron-right" size={13} color="#16A34A" />
            </TouchableOpacity>
          </View>

          {/* FreshBot Banner */}
          <TouchableOpacity
            onPress={() => navigation.navigate('FreshBot')}
            activeOpacity={0.85}
            style={{
              marginHorizontal: 20,
              backgroundColor: '#fff', borderRadius: 24,
              paddingHorizontal: 18, paddingVertical: 16,
              flexDirection: 'row', alignItems: 'center',
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#E2EBE1', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
              <Feather name="message-circle" size={20} color="#2D6A4F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 14 }}>Ask FreshBot</Text>
              <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Ask anything about your pantry</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('QuickAdd')}
        style={{
          position: 'absolute', bottom: 100, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: '#2D6A4F',
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#2D6A4F', shadowOpacity: 0.45, shadowRadius: 12, elevation: 10,
        }}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}