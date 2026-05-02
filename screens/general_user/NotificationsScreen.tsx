// screens/general_user/NotificationsScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';

type FilterType = 'All' | 'Unread' | 'Expiry' | 'Donation' | 'AI' | 'System';
const FILTERS: FilterType[] = ['All', 'Unread', 'Expiry', 'Donation', 'AI', 'System'];

const INITIAL_NOTIFICATIONS = [
  {
    id: '1', type: 'expiry',
    title: 'Expiring Tomorrow!',
    message: 'Your Milk (1L) and Baby Spinach are expiring soon. Try the Green Smoothie recipe!',
    time: '2 hours ago', isRead: false,
    icon: 'alert-triangle' as const, color: '#EF4444', bgColor: 'rgba(239,68,68,0.12)',
  },
  {
    id: '2', type: 'donation',
    title: 'Donation Claimed',
    message: 'Sibusiso Nkosi has claimed your Assorted Bread & Rolls. Coordinate pickup soon.',
    time: '5 hours ago', isRead: false,
    icon: 'heart' as const, color: '#4ADE80', bgColor: 'rgba(74,222,128,0.12)',
  },
  {
    id: '3', type: 'ai',
    title: 'Waste Streak: 5 Days! 🔥',
    message: "Incredible! You've gone 5 days without wasting any food. Keep it up!",
    time: 'Yesterday', isRead: true,
    icon: 'zap' as const, color: '#FB923C', bgColor: 'rgba(251,146,60,0.12)',
  },
  {
    id: '4', type: 'system',
    title: 'Weekly Summary Ready',
    message: 'Your waste score for this week is 82/100. Tap to see your full AI insights.',
    time: '2 days ago', isRead: true,
    icon: 'bar-chart-2' as const, color: '#60A5FA', bgColor: 'rgba(96,165,250,0.12)',
  },
  {
    id: '5', type: 'donation',
    title: 'New Match Nearby',
    message: 'Someone just posted Fresh Vegetables 1.2km away from you.',
    time: '3 days ago', isRead: true,
    icon: 'map-pin' as const, color: '#4ADE80', bgColor: 'rgba(74,222,128,0.12)',
  },
  {
    id: '6', type: 'expiry',
    title: 'Eggs Expiring in 3 Days',
    message: 'You have 6 eggs expiring soon. Consider making a frittata or boiling them.',
    time: '4 days ago', isRead: true,
    icon: 'alert-triangle' as const, color: '#EF4444', bgColor: 'rgba(239,68,68,0.12)',
  },
  {
    id: '7', type: 'ai',
    title: 'New Recipe Suggestion',
    message: 'Based on your pantry, we suggest Tomato Basil Pasta tonight — 4 items expiring.',
    time: '5 days ago', isRead: true,
    icon: 'cpu' as const, color: '#FB923C', bgColor: 'rgba(251,146,60,0.12)',
  },
];

const TAB_CONFIG: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  screen: string;
  freshbot?: boolean;
}[] = [
  { label: 'Home',     icon: 'home',           screen: 'Dashboard'  },
  { label: 'Pantry',   icon: 'box',            screen: 'Pantry'     },
  { label: 'Recipes',  icon: 'book-open',      screen: 'Recipes'    },
  { label: 'Plan',     icon: 'calendar',       screen: 'MealPlan'   },
  { label: 'FreshBot', icon: 'message-circle', screen: 'FreshBot',  freshbot: true },
  { label: 'Insights', icon: 'bar-chart-2',    screen: 'Analytics'  },
];

function BottomNav() {
  const navigation = useNavigation<any>();
  return (
    <View style={{
      position: 'absolute',
      bottom: 20, left: 12, right: 12,
      flexDirection: 'row',
      backgroundColor: '#1C3A2E',
      borderRadius: 26,
      paddingVertical: 6,
      paddingHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 14,
    }}>
      {TAB_CONFIG.map(tab => (
        <TouchableOpacity
          key={tab.label}
          activeOpacity={0.75}
          onPress={() => navigation.navigate('MainTabs', { screen: tab.screen })}
          style={{
            flex: 1, alignItems: 'center', justifyContent: 'center',
            paddingVertical: 7, borderRadius: 22, marginHorizontal: 2,
            backgroundColor: tab.freshbot ? 'rgba(249,115,22,0.15)' : 'transparent',
          }}
        >
          <Feather
            name={tab.icon} size={19}
            color={tab.freshbot ? '#F97316' : 'rgba(255,255,255,0.38)'}
          />
          <Text style={{
            fontSize: 9, fontWeight: '600', marginTop: 3,
            color: tab.freshbot ? '#F97316' : 'rgba(255,255,255,0.38)',
          }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const markOneAsRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));

  const deleteOne = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchesFilter =
        activeFilter === 'All'    ? true :
        activeFilter === 'Unread' ? !n.isRead :
        n.type === activeFilter.toLowerCase();
      const matchesSearch =
        search.trim() === '' ? true :
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.message.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [notifications, activeFilter, search]);

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>

      {/* ── CustomHeader — sits at top, no curve below it ── */}
      <CustomHeader />

      {/* ── Everything below header is on sage background ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        stickyHeaderIndices={[0]}
      >

        {/* ── Sticky top section: title + search + filters ── */}
        <View style={{ backgroundColor: '#E2EBE1', paddingTop: 20 }}>

          {/* Title row */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginBottom: 14,
          }}>
            <View>
              <Text style={{
                color: '#1E293B', fontSize: 22,
                fontWeight: '800', letterSpacing: -0.5,
              }}>
                Notifications
              </Text>
              {unreadCount > 0 ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' }} />
                  <Text style={{ color: '#EF4444', fontSize: 12, fontWeight: '600' }}>
                    {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
                  </Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
                  <Feather name="check-circle" size={12} color="#2D6A4F" />
                  <Text style={{ color: '#2D6A4F', fontSize: 12, fontWeight: '600' }}>
                    All caught up!
                  </Text>
                </View>
              )}
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                style={{
                  backgroundColor: '#2D6A4F',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  shadowColor: '#2D6A4F',
                  shadowOpacity: 0.25,
                  shadowRadius: 6,
                  elevation: 3,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Search bar */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 14,
            marginHorizontal: 20,
            marginBottom: 12,
            paddingHorizontal: 12, paddingVertical: 10,
            gap: 8,
            shadowColor: '#000', shadowOpacity: 0.05,
            shadowRadius: 6, elevation: 2,
          }}>
            <Feather name="search" size={16} color="#94A3B8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search notifications..."
              placeholderTextColor="#CBD5E1"
              style={{
                flex: 1, color: '#1E293B',
                fontSize: 14, fontWeight: '500', padding: 0,
              }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Feather name="x" size={15} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              gap: 8,
            }}
          >
            {FILTERS.map(f => {
              const isActive = activeFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.75}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: isActive ? '#2D6A4F' : '#fff',
                    borderWidth: isActive ? 0 : 1,
                    borderColor: '#E2E8F0',
                    shadowColor: '#000',
                    shadowOpacity: isActive ? 0.1 : 0.03,
                    shadowRadius: 4, elevation: isActive ? 2 : 1,
                  }}
                >
                  <Text style={{
                    color: isActive ? '#fff' : '#64748B',
                    fontSize: 12, fontWeight: '700',
                  }}>
                    {f === 'Unread' && unreadCount > 0 ? `Unread (${unreadCount})` : f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Notification cards ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <View style={{
                width: 68, height: 68, borderRadius: 22,
                backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
                shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
              }}>
                <Feather name="bell-off" size={28} color="#CBD5E1" />
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '600' }}>
                {search ? 'No results found' : 'Nothing here yet'}
              </Text>
            </View>
          ) : (
            filtered.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => markOneAsRead(item.id)}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  padding: 14,
                  marginBottom: 10,
                  alignItems: 'flex-start',
                  borderWidth: item.isRead ? 0 : 1.5,
                  borderColor: item.isRead ? 'transparent' : 'rgba(45,106,79,0.3)',
                  shadowColor: '#000',
                  shadowOpacity: item.isRead ? 0.04 : 0.08,
                  shadowRadius: 8,
                  elevation: item.isRead ? 1 : 3,
                }}
              >
                <View style={{
                  width: 44, height: 44, borderRadius: 14,
                  backgroundColor: item.bgColor,
                  alignItems: 'center', justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Feather name={item.icon} size={19} color={item.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: 3,
                  }}>
                    <Text style={{
                      color: '#1E293B',
                      fontWeight: item.isRead ? '600' : '800',
                      fontSize: 13, flex: 1, marginRight: 6,
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500', marginTop: 1 }}>
                      {item.time}
                    </Text>
                  </View>
                  <Text style={{ color: '#64748B', fontSize: 12, lineHeight: 17 }} numberOfLines={2}>
                    {item.message}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => deleteOne(item.id)}
                  style={{ paddingLeft: 10, paddingTop: 2 }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="x" size={14} color="#CBD5E1" />
                </TouchableOpacity>

                {!item.isRead && (
                  <View style={{
                    position: 'absolute', top: 14, right: 36,
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: '#2D6A4F',
                    borderWidth: 1.5, borderColor: '#fff',
                  }} />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}