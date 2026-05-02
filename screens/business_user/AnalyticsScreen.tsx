// screens/business_user/AnalyticsDashboardScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Polyline, Circle as SvgCircle } from 'react-native-svg';
import CustomHeader from '../../components/CustomHeader';
import { useAuth } from '../../context/AuthContext';



const { width } = Dimensions.get('window');

// ── Dummy Data ────────────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const CATEGORIES = [
  { name: 'Bakery',        color: '#F97316', data: [42, 58, 51, 67, 80, 73]   },
  { name: 'Dairy',         color: '#60A5FA', data: [30, 35, 42, 38, 45, 52]   },
  { name: 'Fresh Produce', color: '#2D6A4F', data: [85, 92, 78, 105, 98, 120] },
  { name: 'Dry Goods',     color: '#A78BFA', data: [20, 18, 25, 22, 30, 28]   },
];

const TREND_POINTS = [
  { x: 0,   y: 60 }, { x: 50,  y: 50 },
  { x: 100, y: 55 }, { x: 150, y: 35 },
  { x: 200, y: 30 }, { x: 250, y: 20 },
  { x: 300, y: 15 },
];

const METRICS = [
  { label: 'Total Donated',  value: '273 kg',  icon: '⚖️', color: '#2D6A4F' },
  { label: 'Rand Value',     value: 'R 8,190', icon: '💰', color: '#F97316' },
  { label: 'Donations Made', value: '34',      icon: '📦', color: '#60A5FA' },
  { label: 'NPOs Served',    value: '7',       icon: '🤝', color: '#A78BFA' },
];

const MAX_VAL = 130;
const CHART_H = 100;

// ── Helpers ───────────────────────────────────────────────────────────────────
function Divider() {
  return <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 }} />;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <Text style={{
      color: '#94A3B8', fontSize: 11, fontWeight: '700',
      letterSpacing: 1, marginBottom: 10, paddingLeft: 2,
    }}>
      {text}
    </Text>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AnalyticsDashboardScreen() {
  const { session } = useAuth();
  const bizName = session?.name ?? 'Your Business';
  const [period, setPeriod] = useState<'week' | 'month'>('month');

  const card = {
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    marginBottom: 16, shadowColor: '#000' as const,
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  };

  const trendPointsStr = TREND_POINTS.map(p => `${p.x},${p.y}`).join(' ');
  const areaPointsStr  = trendPointsStr + ' 300,80 0,80';

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>

      <CustomHeader 
        settingsScreen="BusinessSecurity" 
        profileScreen="Profile" 
        notificationsScreen="BusinessNotifications" 
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 130,
        }}
      >

        {/* ── Page title + period toggle ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 20,
        }}>
          <View>
            <Text style={{
              color: '#1E293B', fontSize: 22,
              fontWeight: '800', letterSpacing: -0.5,
            }}>
              Analytics
            </Text>
            <Text style={{ color: '#64748B', fontSize: 13, marginTop: 3 }}>
              {bizName} · June 2025
            </Text>
          </View>

          {/* Period toggle */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.06)',
            borderRadius: 12, padding: 3,
          }}>
            {(['week', 'month'] as const).map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: 12, paddingVertical: 7,
                  borderRadius: 10,
                  backgroundColor: period === p ? '#fff' : 'transparent',
                  shadowColor: period === p ? '#000' : 'transparent',
                  shadowOpacity: 0.06, shadowRadius: 4,
                  elevation: period === p ? 2 : 0,
                }}
              >
                <Text style={{
                  fontSize: 12, fontWeight: '700',
                  color: period === p ? '#1C3A2E' : '#94A3B8',
                }}>
                  {p === 'week' ? '7 days' : '30 days'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Metrics grid 2×2 ── */}
        <View style={{
          flexDirection: 'row', flexWrap: 'wrap',
          gap: 12, marginBottom: 16,
        }}>
          {METRICS.map(m => (
            <View key={m.label} style={{
              width: (width - 52) / 2,
              backgroundColor: '#fff',
              borderRadius: 20, padding: 16,
              shadowColor: '#000', shadowOpacity: 0.05,
              shadowRadius: 8, elevation: 2,
            }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                gap: 8, marginBottom: 10,
              }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: `${m.color}15`,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{m.icon}</Text>
                </View>
                <Text style={{
                  fontSize: 10, color: '#94A3B8',
                  fontWeight: '700', flex: 1,
                }} numberOfLines={2}>
                  {m.label.toUpperCase()}
                </Text>
              </View>
              <Text style={{
                fontSize: 22, fontWeight: '800', color: m.color,
              }}>
                {m.value}
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 10, marginTop: 2 }}>
                June 2025
              </Text>
            </View>
          ))}
        </View>

       {/* ── Bar chart ── */}
<SectionLabel text="DONATIONS BY CATEGORY (KG)" />
<View style={card}>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 8,
      minWidth: '100%',
    }}
  >
    <View style={{
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: CHART_H + 24,
      gap: 10,
    }}>
      {MONTHS.map((month, mi) => (
        <View key={month} style={{ alignItems: 'center', gap: 4, width: 36 }}>
          <View style={{
            width: 36, height: CHART_H,
            justifyContent: 'flex-end', gap: 1,
          }}>
            {CATEGORIES.map(cat => (
              <View
                key={cat.name}
                style={{
                  width: 36,
                  backgroundColor: cat.color,
                  opacity: 0.9,
                  height: Math.max(
                    (cat.data[mi] / MAX_VAL) * CHART_H, 3
                  ),
                  borderRadius: 3,
                }}
              />
            ))}
          </View>
          <Text style={{
            fontSize: 10, color: '#94A3B8',
            fontWeight: '600', textAlign: 'center',
          }}>
            {month}
          </Text>
        </View>
      ))}
    </View>
  </ScrollView>

  {/* Legend */}
  <View style={{
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, marginTop: 10,
  }}>
    {CATEGORIES.map(cat => (
      <View key={cat.name} style={{
        flexDirection: 'row', alignItems: 'center', gap: 5,
      }}>
        <View style={{
          width: 10, height: 10,
          borderRadius: 3, backgroundColor: cat.color,
        }} />
        <Text style={{ fontSize: 11, color: '#64748B' }}>
          {cat.name}
        </Text>
      </View>
    ))}
  </View>
</View>
        {/* ── Trend line ── */}
        <SectionLabel text="MONTH-ON-MONTH TREND" />
        <View style={{ ...card, paddingBottom: 12 }}>
          <View style={{ height: 90 }}>
            <Svg
              width="100%" height="90"
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
            >
              <Polyline
                points={areaPointsStr}
                fill="#2D6A4F"
                opacity="0.08"
              />
              <Polyline
                points={trendPointsStr}
                fill="none"
                stroke="#2D6A4F"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {TREND_POINTS.map((p, i) => (
                <SvgCircle
                  key={i} cx={p.x} cy={p.y} r="4"
                  fill="#2D6A4F"
                />
              ))}
            </Svg>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between', marginTop: 4,
          }}>
            {MONTHS.map(m => (
              <Text key={m} style={{
                fontSize: 10, color: '#94A3B8', fontWeight: '600',
              }}>
                {m}
              </Text>
            ))}
          </View>

          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            backgroundColor: 'rgba(45,106,79,0.07)',
            borderRadius: 12, padding: 10, marginTop: 12,
          }}>
            <Feather name="trending-up" size={14} color="#2D6A4F" />
            <Text style={{
              color: '#2D6A4F', fontSize: 12,
              fontWeight: '600', flex: 1,
            }}>
              Donations up 73% since January — keep going!
            </Text>
          </View>
        </View>

        {/* ── PR & Impact Report ── */}
        <SectionLabel text="PR & IMPACT REPORT" />
        <View style={card}>
          <View style={{
            backgroundColor: 'rgba(45,106,79,0.07)',
            borderRadius: 14, padding: 14, marginBottom: 16,
          }}>
            <Text style={{ fontSize: 13, color: '#1E293B', lineHeight: 22 }}>
              This month,{' '}
              <Text style={{ fontWeight: '800' }}>{bizName}</Text>
              {' '}donated{' '}
              <Text style={{ fontWeight: '800', color: '#2D6A4F' }}>273 kg</Text>
              {' '}of surplus food valued at{' '}
              <Text style={{ fontWeight: '800', color: '#2D6A4F' }}>R 8,190</Text>
              , equivalent to approximately{' '}
              <Text style={{ fontWeight: '800' }}>819 meals</Text>
              . Your contributions helped{' '}
              <Text style={{ fontWeight: '800' }}>7 NPOs</Text>
              {' '}across Durban.
            </Text>
          </View>

          <Divider />
          <View style={{ height: 14 }} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1, flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center',
                gap: 6, paddingVertical: 12, borderRadius: 12,
                borderWidth: 1.5, borderColor: '#2D6A4F',
              }}
            >
              <Feather name="download" size={15} color="#2D6A4F" />
              <Text style={{ color: '#2D6A4F', fontSize: 13, fontWeight: '700' }}>
                Export PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1, flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center',
                gap: 6, paddingVertical: 12, borderRadius: 12,
                backgroundColor: '#F97316',
                shadowColor: '#F97316',
                shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
              }}
            >
              <Feather name="share-2" size={15} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                Share Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Category breakdown ── */}
        <SectionLabel text="CATEGORY BREAKDOWN" />
        <View style={card}>
          {CATEGORIES.map((cat, i) => {
            const total    = cat.data.reduce((a, b) => a + b, 0);
            const maxTotal = CATEGORIES.reduce((a, c) =>
              Math.max(a, c.data.reduce((x, y) => x + y, 0)), 0
            );
            const pct = Math.round((total / maxTotal) * 100);
            return (
              <View key={cat.name}>
                <View style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingVertical: 12,
                }}>
                  <View style={{
                    width: 10, height: 10, borderRadius: 3,
                    backgroundColor: cat.color, marginRight: 12,
                  }} />
                  <Text style={{
                    flex: 1, fontSize: 13,
                    fontWeight: '600', color: '#1E293B',
                  }}>
                    {cat.name}
                  </Text>
                  <Text style={{
                    fontSize: 13, fontWeight: '800',
                    color: cat.color, marginRight: 10,
                  }}>
                    {total} kg
                  </Text>
                  <View style={{
                    width: 80, height: 6,
                    backgroundColor: '#F1F5F9',
                    borderRadius: 3, overflow: 'hidden',
                  }}>
                    <View style={{
                      width: `${pct}%`, height: 6,
                      backgroundColor: cat.color, borderRadius: 3,
                    }} />
                  </View>
                </View>
                {i < CATEGORIES.length - 1 && <Divider />}
              </View>
            );
          })}
        </View>

      </ScrollView>
    </View>
  );
}