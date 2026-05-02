// screens/business_user/BusinessNotificationsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

type NotifType = 'claim' | 'pickup' | 'system' | 'alert';

type Notif = {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const INITIAL_NOTIFS: Notif[] = [
  {
    id: 1,
    type: 'claim',
    title: 'Listing Claimed',
    body: 'Durban Food Bank has claimed your Fresh Produce — 45 kg listing.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'pickup',
    title: 'Driver En Route',
    body: 'Sipho M. is on his way to collect Bakery — 80 units. ETA ~12 min.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Pickup Window Expiring',
    body: 'Your Dairy — 30 L listing expires at 18:00. Relist or mark as wasted.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'system',
    title: 'Food Safety Certificate',
    body: 'Your Food Safety Certificate is still pending review. Upload a clearer copy to speed up approval.',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 5,
    type: 'claim',
    title: 'Pickup Completed',
    body: 'Umlazi Outreach successfully collected Dry Goods — 22 kg. Well done!',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 6,
    type: 'system',
    title: 'Monthly Certificate Ready',
    body: 'Your June 2025 SARS donation certificate is ready to download.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 7,
    type: 'alert',
    title: 'Listing Expired',
    body: 'Prepared Meals — 60 portions expired without being claimed. Consider adjusting your pickup window.',
    time: '2 days ago',
    read: true,
  },
];

type FilterType = 'All' | 'Unread' | 'Claims' | 'Pickups' | 'System';
const FILTERS: FilterType[] = ['All', 'Unread', 'Claims', 'Pickups', 'System'];

function notifStyle(type: NotifType): {
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  bg: string;
} {
  switch (type) {
    case 'claim':  return { icon: 'package',       color: '#2D6A4F', bg: 'rgba(45,106,79,0.1)'   };
    case 'pickup': return { icon: 'truck',          color: '#2E7BBF', bg: 'rgba(46,123,191,0.1)'  };
    case 'alert':  return { icon: 'alert-triangle', color: '#F97316', bg: 'rgba(249,115,22,0.1)'  };
    case 'system': return { icon: 'info',           color: '#60A5FA', bg: 'rgba(96,165,250,0.1)'  };
  }
}

function passesFilter(n: Notif, filter: FilterType): boolean {
  switch (filter) {
    case 'All':     return true;
    case 'Unread':  return !n.read;
    case 'Claims':  return n.type === 'claim';
    case 'Pickups': return n.type === 'pickup';
    case 'System':  return n.type === 'system' || n.type === 'alert';
  }
}

export default function BusinessNotificationsScreen() {
  const navigation                    = useNavigation();
  const [notifs,    setNotifs]        = useState<Notif[]>(INITIAL_NOTIFS);
  const [filter,    setFilter]        = useState<FilterType>('All');

  const unreadCount = notifs.filter(n => !n.read).length;
  const filtered    = notifs.filter(n => passesFilter(n, filter));

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const dismiss = (id: number) =>
    setNotifs(prev => prev.filter(n => n.id !== id));

  const markRead = (id: number) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>
      <CustomHeader
        settingsScreen="BusinessSecurity"
        profileScreen="Profile"
        notificationsScreen="BusinessNotifications"
      />

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back ── */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}
        >
          <Feather name="arrow-left" size={16} color="#2D6A4F" />
          <Text style={{ color: '#2D6A4F', fontWeight: '700', fontSize: 14 }}>Back</Text>
        </TouchableOpacity>

        {/* ── Title row ── */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 4,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{
              color: '#1E293B', fontSize: 22,
              fontWeight: '800', letterSpacing: -0.5,
            }}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={{
                backgroundColor: '#F97316', borderRadius: 10,
                paddingHorizontal: 8, paddingVertical: 2,
              }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
              <Text style={{ fontSize: 12, color: '#2D6A4F', fontWeight: '700' }}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={{ color: '#64748B', fontSize: 13, marginBottom: 20 }}>
          Stay on top of claims, pickups and updates.
        </Text>

        {/* ── Filter chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingBottom: 4, marginBottom: 20 }}
        >
          {FILTERS.map(f => {
            const isActive = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: 14, paddingVertical: 8,
                  borderRadius: 20, borderWidth: 1.5,
                  borderColor: isActive ? '#2D6A4F' : '#E2E8F0',
                  backgroundColor: isActive ? 'rgba(45,106,79,0.1)' : '#fff',
                }}
              >
                <Text style={{
                  fontSize: 13, fontWeight: '700',
                  color: isActive ? '#2D6A4F' : '#94A3B8',
                }}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Notification cards ── */}
        {filtered.length === 0 ? (
          <View style={{
            backgroundColor: '#fff', borderRadius: 20,
            padding: 36, alignItems: 'center',
            shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
          }}>
            <Feather name="bell-off" size={32} color="#CBD5E1" />
            <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600', marginTop: 12 }}>
              No notifications here
            </Text>
          </View>
        ) : (
          filtered.map(n => {
            const s = notifStyle(n.type);
            return (
              <TouchableOpacity
                key={n.id}
                onPress={() => markRead(n.id)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20, padding: 16,
                  marginBottom: 10,
                  borderWidth: n.read ? 1 : 1.5,
                  borderColor: n.read ? '#F1F5F9' : 'rgba(45,106,79,0.2)',
                  shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                  {/* Icon */}
                  <View style={{
                    width: 44, height: 44, borderRadius: 13,
                    backgroundColor: s.bg,
                    alignItems: 'center', justifyContent: 'center',
                    marginTop: 1,
                  }}>
                    <Feather name={s.icon} size={18} color={s.color} />
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1 }}>
                    <View style={{
                      flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 3,
                    }}>
                      <Text style={{
                        fontWeight: '700', fontSize: 14, color: '#1E293B', flex: 1,
                      }}>
                        {n.title}
                      </Text>
                      {!n.read && (
                        <View style={{
                          width: 8, height: 8, borderRadius: 4,
                          backgroundColor: '#F97316', marginLeft: 8,
                        }} />
                      )}
                    </View>
                    <Text style={{
                      fontSize: 12, color: '#64748B',
                      lineHeight: 18, marginBottom: 8,
                    }}>
                      {n.body}
                    </Text>
                    <View style={{
                      flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <Text style={{ fontSize: 11, color: '#94A3B8' }}>{n.time}</Text>
                      <TouchableOpacity
                        onPress={() => dismiss(n.id)}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Feather name="x" size={14} color="#CBD5E1" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}