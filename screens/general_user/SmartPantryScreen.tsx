// screens/general_user/SmartPantryScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, Platform, Modal, Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';

const INITIAL_ITEMS = [
  { id: '1',  name: 'Milk',          location: 'Fridge',  category: 'Dairy',      daysLeft: 1,  totalLife: 14,  qty: '1L',    icon: '🥛' },
  { id: '2',  name: 'Baby Spinach',  location: 'Fridge',  category: 'Vegetables', daysLeft: 2,  totalLife: 7,   qty: '200g',  icon: '🥬' },
  { id: '3',  name: 'Tomatoes',      location: 'Counter', category: 'Vegetables', daysLeft: 3,  totalLife: 14,  qty: '6 pcs', icon: '🍅' },
  { id: '4',  name: 'Yoghurt',       location: 'Fridge',  category: 'Dairy',      daysLeft: 4,  totalLife: 21,  qty: '500ml', icon: '🍦' },
  { id: '5',  name: 'Apples',        location: 'Counter', category: 'Fruits',     daysLeft: 6,  totalLife: 20,  qty: '5 pcs', icon: '🍎' },
  { id: '6',  name: 'Carrots',       location: 'Fridge',  category: 'Vegetables', daysLeft: 8,  totalLife: 30,  qty: '4 pcs', icon: '🥕' },
  { id: '7',  name: 'Cheddar',       location: 'Fridge',  category: 'Dairy',      daysLeft: 12, totalLife: 45,  qty: '300g',  icon: '🧀' },
  { id: '8',  name: 'Rice',          location: 'Pantry',  category: 'Dry Goods',  daysLeft: 90, totalLife: 365, qty: '2kg',   icon: '🌾' },
  { id: '9',  name: 'Chicken Breast',location: 'Freezer', category: 'Protein',    daysLeft: 30, totalLife: 90,  qty: '500g',  icon: '🍗' },
  { id: '10', name: 'Eggs',          location: 'Fridge',  category: 'Dairy',      daysLeft: 18, totalLife: 30,  qty: '12',    icon: '🥚' },
];

const FOOD_CATEGORIES = ['All', 'Vegetables', 'Dairy', 'Fruits', 'Protein', 'Dry Goods'];
const LOCATIONS       = ['All', 'Fridge', 'Freezer', 'Pantry', 'Counter'];

type SortOrder = 'expiring' | 'freshest';

function expiryStatus(daysLeft: number) {
  if (daysLeft <= 2)  return { label: 'Urgent',   color: '#EF4444', bg: '#FEF2F2', bar: '#EF4444' };
  if (daysLeft <= 5)  return { label: 'Expiring', color: '#F97316', bg: '#FFF7ED', bar: '#F97316' };
  if (daysLeft <= 10) return { label: 'Soon',     color: '#EAB308', bg: '#FEFCE8', bar: '#EAB308' };
  return                     { label: 'Fresh',    color: '#16A34A', bg: '#F0FDF4', bar: '#22C55E' };
}

export default function SmartPantryScreen() {
  const navigation = useNavigation<any>();

  const [items,      setItems]      = useState(INITIAL_ITEMS);
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('All');
  const [locFilter,  setLocFilter]  = useState('All');
  const [sortOrder,  setSortOrder]  = useState<SortOrder>('expiring');
  const [filterOpen, setFilterOpen] = useState(false);

  // Pending state inside modal
  const [pendingCat,  setPendingCat]  = useState('All');
  const [pendingLoc,  setPendingLoc]  = useState('All');
  const [pendingSort, setPendingSort] = useState<SortOrder>('expiring');

  const activeFilterCount = (catFilter !== 'All' ? 1 : 0) + (locFilter !== 'All' ? 1 : 0);

  const displayItems = useMemo(() => {
    return items
      .filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchCat    = catFilter === 'All' || item.category === catFilter;
        const matchLoc    = locFilter === 'All' || item.location === locFilter;
        return matchSearch && matchCat && matchLoc;
      })
      .sort((a, b) => sortOrder === 'expiring'
        ? a.daysLeft - b.daysLeft
        : b.daysLeft - a.daysLeft
      );
  }, [items, search, catFilter, locFilter, sortOrder]);

  const deleteItem = (id: string, name: string) => {
    Alert.alert(
      'Remove item',
      `Remove "${name}" from your pantry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setItems(prev => prev.filter(i => i.id !== id)),
        },
      ]
    );
  };

  const openFilter = () => {
    setPendingCat(catFilter);
    setPendingLoc(locFilter);
    setPendingSort(sortOrder);
    setFilterOpen(true);
  };

  const applyFilters = () => {
    setCatFilter(pendingCat);
    setLocFilter(pendingLoc);
    setSortOrder(pendingSort);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setPendingCat('All');
    setPendingLoc('All');
    setPendingSort('expiring');
  };

  const sortLabel = sortOrder === 'expiring'
    ? 'Sorted by expiry — most urgent first'
    : 'Sorted by freshness — freshest first';

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>

      {/* ── Shared header only ── */}
      <CustomHeader />

      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />

      {/* ── Page body ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        stickyHeaderIndices={[0]}
      >

        {/* ── Sticky search + filter block ── */}
        <View style={{
          backgroundColor: '#E2EBE1',
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 12,
        }}>
          {/* Page title */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E293B', letterSpacing: -0.4 }}>
                Smart Pantry 🛒
              </Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
                {displayItems.length} of {items.length} items shown
              </Text>
            </View>
          </View>

          {/* Search + filter row */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{
              flex: 1, flexDirection: 'row', alignItems: 'center',
              backgroundColor: '#fff', borderRadius: 14,
              paddingHorizontal: 14, height: 48,
              shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
            }}>
              <Feather name="search" size={16} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
                placeholder="Search pantry..."
                placeholderTextColor="#CBD5E1"
                value={search}
                onChangeText={setSearch}
              />
              {!!search && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Feather name="x" size={15} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter button */}
            <TouchableOpacity
              onPress={openFilter}
              activeOpacity={0.8}
              style={{
                width: 48, height: 48, borderRadius: 14,
                backgroundColor: activeFilterCount > 0 ? '#1C3A2E' : '#fff',
                alignItems: 'center', justifyContent: 'center',
                shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
              }}
            >
              <Feather name="sliders" size={18} color={activeFilterCount > 0 ? '#4ADE80' : '#64748B'} />
              {activeFilterCount > 0 && (
                <View style={{
                  position: 'absolute', top: 9, right: 9,
                  width: 7, height: 7, borderRadius: 4,
                  backgroundColor: '#F97316',
                  borderWidth: 1.5, borderColor: '#fff',
                }} />
              )}
            </TouchableOpacity>
          </View>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {catFilter !== 'All' && (
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 5,
                  backgroundColor: '#1C3A2E', borderRadius: 20,
                  paddingHorizontal: 10, paddingVertical: 5,
                }}>
                  <Feather name="tag" size={10} color="#4ADE80" />
                  <Text style={{ color: '#4ADE80', fontSize: 12, fontWeight: '600' }}>{catFilter}</Text>
                  <TouchableOpacity onPress={() => setCatFilter('All')}>
                    <Feather name="x" size={11} color="#4ADE80" />
                  </TouchableOpacity>
                </View>
              )}
              {locFilter !== 'All' && (
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 5,
                  backgroundColor: '#1C3A2E', borderRadius: 20,
                  paddingHorizontal: 10, paddingVertical: 5,
                }}>
                  <Feather name="map-pin" size={10} color="#4ADE80" />
                  <Text style={{ color: '#4ADE80', fontSize: 12, fontWeight: '600' }}>{locFilter}</Text>
                  <TouchableOpacity onPress={() => setLocFilter('All')}>
                    <Feather name="x" size={11} color="#4ADE80" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Sort label */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 5 }}>
            <Feather name="clock" size={12} color="#94A3B8" />
            <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600' }}>{sortLabel}</Text>
          </View>
        </View>

        {/* ── Item list ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
          {displayItems.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🤔</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 6 }}>
                No items found
              </Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center' }}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            displayItems.map(item => {
              const status  = expiryStatus(item.daysLeft);
              const fillPct = Math.min((item.daysLeft / item.totalLife) * 100, 100);

              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 20,
                    padding: 14,
                    marginBottom: 10,
                    borderWidth: item.daysLeft <= 2 ? 1.5 : 1,
                    borderColor: item.daysLeft <= 2 ? '#FECACA' : '#F1F5F9',
                    shadowColor: '#000',
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {/* Emoji */}
                  <View style={{
                    width: 48, height: 48, borderRadius: 14,
                    backgroundColor: status.bg,
                    alignItems: 'center', justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                  </View>

                  {/* Details */}
                  <View style={{ flex: 1 }}>
                    <View style={{
                      flexDirection: 'row', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 4,
                    }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>
                        {item.name}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={{
                          backgroundColor: status.bg, borderRadius: 20,
                          paddingHorizontal: 8, paddingVertical: 3,
                        }}>
                          <Text style={{ color: status.color, fontSize: 10, fontWeight: '700' }}>
                            {status.label}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>
                          {item.qty}
                        </Text>
                      </View>
                    </View>

                    {/* Location + category badges */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <View style={{
                        flexDirection: 'row', alignItems: 'center', gap: 3,
                        backgroundColor: '#F1F5F9', borderRadius: 8,
                        paddingHorizontal: 7, paddingVertical: 3,
                      }}>
                        <Feather name="map-pin" size={10} color="#64748B" />
                        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                          {item.location}
                        </Text>
                      </View>
                      <View style={{
                        flexDirection: 'row', alignItems: 'center', gap: 3,
                        backgroundColor: '#F1F5F9', borderRadius: 8,
                        paddingHorizontal: 7, paddingVertical: 3,
                      }}>
                        <Feather name="tag" size={10} color="#64748B" />
                        <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                          {item.category}
                        </Text>
                      </View>
                      <Text style={{
                        fontSize: 11, fontWeight: '700',
                        color: status.color, marginLeft: 'auto',
                      }}>
                        {item.daysLeft <= 1 ? 'Today!' : `${item.daysLeft}d left`}
                      </Text>
                    </View>

                    {/* Progress bar */}
                    <View style={{ height: 5, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{
                        width: `${fillPct}%`, height: '100%',
                        backgroundColor: status.bar, borderRadius: 3,
                      }} />
                    </View>
                  </View>

                  {/* Delete button */}
                  <TouchableOpacity
                    onPress={() => deleteItem(item.id, item.name)}
                    activeOpacity={0.7}
                    style={{
                      width: 32, height: 32, borderRadius: 10,
                      backgroundColor: '#FEF2F2',
                      alignItems: 'center', justifyContent: 'center',
                      marginLeft: 10,
                    }}
                  >
                    <Feather name="trash-2" size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('QuickAdd')}
        activeOpacity={0.85}
        style={{
          position: 'absolute', bottom: 100, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: '#2D6A4F',
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#2D6A4F', shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
        }}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* ── Filter Modal ── */}
      <Modal
        visible={filterOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          activeOpacity={1}
          onPress={() => setFilterOpen(false)}
        />

        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          paddingBottom: Platform.OS === 'ios' ? 36 : 24,
        }}>
          {/* Handle */}
          <View style={{
            width: 40, height: 4, borderRadius: 2,
            backgroundColor: '#E2E8F0',
            alignSelf: 'center', marginTop: 12, marginBottom: 20,
          }} />

          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20, marginBottom: 24,
          }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E293B' }}>
              Filter & sort
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#F97316' }}>Clear all</Text>
            </TouchableOpacity>
          </View>

          {/* ── Sort order ── */}
          <Text style={styles.modalSectionLabel}>SORT ORDER</Text>
          <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginBottom: 4 }}>
            {([
              { key: 'expiring', icon: 'alert-circle' as const, label: 'Expiring first' },
              { key: 'freshest', icon: 'check-circle' as const, label: 'Freshest first' },
            ] as { key: SortOrder; icon: React.ComponentProps<typeof Feather>['name']; label: string }[]).map(opt => {
              const sel = pendingSort === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setPendingSort(opt.key)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1, flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', gap: 7,
                    paddingVertical: 13, borderRadius: 16,
                    backgroundColor: sel ? '#1C3A2E' : '#F8FAFC',
                    borderWidth: 1, borderColor: sel ? '#1C3A2E' : '#E2E8F0',
                  }}
                >
                  <Feather
                    name={opt.icon}
                    size={15}
                    color={sel ? '#4ADE80' : '#94A3B8'}
                  />
                  <Text style={{
                    fontSize: 13, fontWeight: '700',
                    color: sel ? '#fff' : '#64748B',
                  }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 20, marginVertical: 20 }} />

          {/* ── Food category ── */}
          <Text style={styles.modalSectionLabel}>FOOD CATEGORY</Text>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 4 }}
          >
            {FOOD_CATEGORIES.map(cat => {
              const sel = pendingCat === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setPendingCat(cat)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
                    backgroundColor: sel ? '#1C3A2E' : '#F8FAFC',
                    borderWidth: 1, borderColor: sel ? '#1C3A2E' : '#E2E8F0',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: sel ? '#fff' : '#64748B' }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 20, marginVertical: 20 }} />

          {/* ── Storage location ── */}
          <Text style={styles.modalSectionLabel}>STORAGE LOCATION</Text>
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 4 }}
          >
            {LOCATIONS.map(loc => {
              const sel  = pendingLoc === loc;
              const icon: Record<string, string> = {
                All: '🗂️', Fridge: '🧊', Freezer: '❄️', Pantry: '🚪', Counter: '🍽️',
              };
              return (
                <TouchableOpacity
                  key={loc}
                  onPress={() => setPendingLoc(loc)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
                    backgroundColor: sel ? '#1C3A2E' : '#F8FAFC',
                    borderWidth: 1, borderColor: sel ? '#1C3A2E' : '#E2E8F0',
                  }}
                >
                  <Text style={{ fontSize: 14 }}>{icon[loc]}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: sel ? '#fff' : '#64748B' }}>
                    {loc}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Apply */}
          <TouchableOpacity
            onPress={applyFilters}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#1C3A2E', borderRadius: 18,
              marginHorizontal: 20, marginTop: 24,
              paddingVertical: 17, alignItems: 'center',
              shadowColor: '#1C3A2E', shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  modalSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
});