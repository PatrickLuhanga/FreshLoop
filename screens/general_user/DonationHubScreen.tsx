// screens/general_user/DonationHubScreen.tsx
// ~300 lines — bloat removed, report button added at bottom of both tabs.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Modal, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';

// ── Types ───────────────────────────────────────────────────────────────────
type DonationPin  = 'green' | 'yellow' | 'red';
type FilterChip   = 'All' | 'Vegetables' | 'Cooked Meals' | 'Dairy' | 'Bakery';
type Listing = {
  id: string; icon: string; title: string;
  category: FilterChip; store: string; distance: string;
  quantity: string; weight: string;
  pickupStart: string; pickupEnd: string;
  hoursLeft: number; handling?: string; pin: DonationPin;
};

// ── Constants ───────────────────────────────────────────────────────────────
const PIN_COLORS: Record<DonationPin, string> = {
  green: '#22C55E', yellow: '#F59E0B', red: '#EF4444',
};
const PIN_LABELS: Record<DonationPin, string> = {
  green: '6h+ remaining', yellow: '2–6h remaining', red: 'Under 2h',
};
const FILTER_CHIPS: FilterChip[] = ['All', 'Vegetables', 'Cooked Meals', 'Dairy', 'Bakery'];

// ── Mock data — replace with Firestore listener ─────────────────────────────
const LISTINGS: Listing[] = [
  { id: '1', icon: '🥦', title: 'Fresh Vegetables Bundle', category: 'Vegetables', store: 'Woolworths Musgrave', distance: '1.2 km', quantity: '8 kg', weight: '8 kg', pickupStart: '3:00 PM', pickupEnd: '5:00 PM', hoursLeft: 7, handling: 'Keep refrigerated.', pin: 'green' },
  { id: '2', icon: '🍞', title: 'Assorted Bread & Rolls', category: 'Bakery', store: 'Spar Berea', distance: '2.8 km', quantity: '12 units', weight: '3.5 kg', pickupStart: '5:00 PM', pickupEnd: '7:00 PM', hoursLeft: 4, pin: 'yellow' },
  { id: '3', icon: '🥗', title: 'Prepared Salads', category: 'Cooked Meals', store: 'Woolworths Gateway', distance: '4.1 km', quantity: '5 packs', weight: '2.2 kg', pickupStart: '12:00 PM', pickupEnd: '2:00 PM', hoursLeft: 1, handling: 'Must be collected immediately — expires today.', pin: 'red' },
  { id: '4', icon: '🥛', title: 'Full Cream Milk (2L)', category: 'Dairy', store: 'Pick n Pay Westville', distance: '3.3 km', quantity: '6 units', weight: '12 kg', pickupStart: '2:00 PM', pickupEnd: '6:00 PM', hoursLeft: 8, handling: 'Keep cold during transport.', pin: 'green' },
  { id: '5', icon: '🍚', title: 'Cooked Rice & Stew', category: 'Cooked Meals', store: "Food Lover's Market Pavilion", distance: '5.0 km', quantity: '10 portions', weight: '6 kg', pickupStart: '4:00 PM', pickupEnd: '6:30 PM', hoursLeft: 3, handling: 'Reheat before serving.', pin: 'yellow' },
];

const MAP_PINS = [
  { id: '1', top: '18%', left: '28%', pin: 'green'  as DonationPin },
  { id: '2', top: '55%', left: '55%', pin: 'yellow' as DonationPin },
  { id: '3', top: '35%', left: '68%', pin: 'red'    as DonationPin },
  { id: '4', top: '72%', left: '22%', pin: 'green'  as DonationPin },
  { id: '5', top: '45%', left: '40%', pin: 'yellow' as DonationPin },
];

// ── Mini-map grid helper ────────────────────────────────────────────────────
const MapGrid = () => (
  <View style={StyleSheet.absoluteFill}>
    {[...Array(5)].map((_, i) => (
      <View key={`h${i}`} style={[s.gridLine, s.gridH, { top: `${i * 25}%` as any }]} />
    ))}
    {[...Array(5)].map((_, i) => (
      <View key={`v${i}`} style={[s.gridLine, s.gridV, { left: `${i * 25}%` as any }]} />
    ))}
  </View>
);

// ── Report footer button ────────────────────────────────────────────────────
const ReportButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={s.reportBtn} onPress={onPress} activeOpacity={0.8}>
    <Feather name="flag" size={15} color="#EF4444" />
    <Text style={s.reportBtnText}>Report an Issue</Text>
    <Feather name="chevron-right" size={14} color="#EF4444" />
  </TouchableOpacity>
);

// ── Main screen ─────────────────────────────────────────────────────────────
export default function DonationHubScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab]           = useState<'find' | 'give'>('find');
  const [activeFilter, setActiveFilter]     = useState<FilterChip>('All');
  const [listView, setListView]             = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [requested, setRequested]           = useState<string[]>([]);

  // Give-tab form
  const [foodName, setFoodName]       = useState('');
  const [quantity, setQuantity]       = useState('');
  const [expiryDate, setExpiryDate]   = useState('');
  const [pickupStart, setPickupStart] = useState('');
  const [pickupEnd, setPickupEnd]     = useState('');
  const [notes, setNotes]             = useState('');

  const filtered = activeFilter === 'All'
    ? LISTINGS
    : LISTINGS.filter(l => l.category === activeFilter);

  const goToReport = () => navigation.navigate('Report' as never);

  return (
    <View style={s.root}>
      <CustomHeader />
      <View style={s.divider} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        stickyHeaderIndices={[0]}
      >
        {/* ── Sticky header ── */}
        <View style={s.stickyTop}>
          <Text style={s.title}>Donation Hub 🎁</Text>
          <Text style={s.subtitle}>Give food · Find food · Reduce waste</Text>
          <View style={s.tabBar}>
            {(['find', 'give'] as const).map(tab => (
              <TouchableOpacity
                key={tab} onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
                style={[s.tab, activeTab === tab && s.tabActive]}
              >
                <Feather name={tab === 'find' ? 'map-pin' : 'gift'} size={13}
                  color={activeTab === tab ? '#fff' : '#94A3B8'} style={{ marginRight: 5 }} />
                <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                  {tab === 'find' ? 'Find Food' : 'Give Food'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══════════ FIND TAB ═══════════ */}
        {activeTab === 'find' && (
          <>
            {/* Map / List toggle row */}
            <View style={s.toggleRow}>
              <Text style={s.toggleLabel}>{filtered.length} donations near you</Text>
              <View style={s.toggle}>
                {(['map', 'list'] as const).map(v => (
                  <TouchableOpacity
                    key={v} activeOpacity={0.8}
                    onPress={() => setListView(v === 'list')}
                    style={[s.toggleBtn, (v === 'list') === listView && s.toggleBtnActive]}
                  >
                    <Feather name={v as any} size={13}
                      color={(v === 'list') === listView ? '#fff' : '#64748B'} />
                    <Text style={[s.toggleBtnText, (v === 'list') === listView && { color: '#fff' }]}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}>
              {FILTER_CHIPS.map(chip => (
                <TouchableOpacity key={chip} onPress={() => setActiveFilter(chip)}
                  activeOpacity={0.8}
                  style={[s.chip, activeFilter === chip && s.chipActive]}>
                  <Text style={[s.chipText, activeFilter === chip && s.chipTextActive]}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Map view */}
            {!listView && (
              <View style={s.mapCard}>
                <MapGrid />
                <View style={s.mapBadge}>
                  <Feather name="navigation" size={10} color="#2D6A4F" />
                  <Text style={s.mapBadgeText}>Durban, KZN</Text>
                </View>
                {MAP_PINS.map(p => {
                  const l = LISTINGS.find(x => x.id === p.id);
                  if (!l) return null;
                  if (activeFilter !== 'All' && l.category !== activeFilter) return null;
                  return (
                    <TouchableOpacity key={p.id} onPress={() => setSelectedListing(l)}
                      activeOpacity={0.8}
                      style={[s.pin, { top: p.top as any, left: p.left as any }]}>
                      <View style={[s.pinDot, { backgroundColor: PIN_COLORS[p.pin] }]}>
                        <Text style={{ fontSize: 10 }}>{l.icon}</Text>
                      </View>
                      <View style={[s.pinTail, { backgroundColor: PIN_COLORS[p.pin] }]} />
                    </TouchableOpacity>
                  );
                })}
                {/* Legend */}
                <View style={s.legend}>
                  {(Object.entries(PIN_COLORS) as [DonationPin, string][]).map(([k, c]) => (
                    <View key={k} style={s.legendItem}>
                      <View style={[s.legendDot, { backgroundColor: c }]} />
                      <Text style={s.legendText}>{PIN_LABELS[k]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Listing cards */}
            <View style={s.listPad}>
              {filtered.map(l => {
                const done = requested.includes(l.id);
                return (
                  <TouchableOpacity key={l.id} onPress={() => setSelectedListing(l)}
                    activeOpacity={0.75}
                    style={[s.card, done && { opacity: 0.5 }]}>
                    <View style={[s.cardIcon, { backgroundColor: PIN_COLORS[l.pin] + '22' }]}>
                      <Text style={{ fontSize: 24 }}>{l.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.cardTitle}>{l.title}</Text>
                      <Text style={s.cardMeta}><Feather name="map-pin" size={11} color="#94A3B8" /> {l.store} · {l.distance}</Text>
                      <Text style={s.cardMeta}><Feather name="clock" size={11} color="#94A3B8" /> {l.pickupStart} – {l.pickupEnd}</Text>
                      <View style={s.badgeRow}>
                        <View style={[s.badge, { backgroundColor: PIN_COLORS[l.pin] + '22', borderColor: PIN_COLORS[l.pin] + '55' }]}>
                          <View style={[s.badgeDot, { backgroundColor: PIN_COLORS[l.pin] }]} />
                          <Text style={[s.badgeText, { color: PIN_COLORS[l.pin] }]}>{PIN_LABELS[l.pin]}</Text>
                        </View>
                        <Text style={s.qty}>{l.quantity}</Text>
                      </View>
                    </View>
                    {done
                      ? <View style={s.reqBadge}><Text style={s.reqBadgeText}>Requested</Text></View>
                      : <Feather name="chevron-right" size={16} color="#CBD5E1" />
                    }
                  </TouchableOpacity>
                );
              })}
            </View>

            <ReportButton onPress={goToReport} />
          </>
        )}

        {/* ═══════════ GIVE TAB ═══════════ */}
        {activeTab === 'give' && (
          <View style={s.givePad}>
            {/* Info banner */}
            <View style={s.banner}>
              <View style={s.bannerIcon}><Text style={{ fontSize: 18 }}>💡</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.bannerTitle}>Donate before it's too late</Text>
                <Text style={s.bannerSub}>
                  Listings auto-expire on the food's expiry date. Your location pin helps coordinators navigate to you.
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={s.formCard}>
              <Text style={s.formTitle}>Post a donation</Text>

              <TouchableOpacity style={s.photoBox} activeOpacity={0.8}>
                <Feather name="camera" size={22} color="#2D6A4F" />
                <Text style={s.photoLabel}>Add photo</Text>
                <Text style={s.photoSub}>Tap to take or upload</Text>
              </TouchableOpacity>

              {[
                { label: 'FOOD ITEM NAME', placeholder: 'e.g. Fresh tomatoes, cooked rice…', value: foodName, set: setFoodName },
                { label: 'QUANTITY', placeholder: 'e.g. 3 kg, 12 units…', value: quantity, set: setQuantity },
                { label: 'EXPIRY DATE', placeholder: 'DD / MM / YYYY', value: expiryDate, set: setExpiryDate },
              ].map(f => (
                <View key={f.label}>
                  <Text style={s.fieldLabel}>{f.label}</Text>
                  <TextInput style={s.input} placeholder={f.placeholder}
                    placeholderTextColor="#CBD5E1" value={f.value} onChangeText={f.set} />
                </View>
              ))}

              <Text style={s.fieldLabel}>PICKUP WINDOW</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[{ label: 'From', val: pickupStart, set: setPickupStart, ph: '2:00 PM' },
                  { label: 'Until', val: pickupEnd, set: setPickupEnd, ph: '6:00 PM' }].map(f => (
                  <View key={f.label} style={{ flex: 1 }}>
                    <Text style={s.subLabel}>{f.label}</Text>
                    <TextInput style={s.input} placeholder={f.ph}
                      placeholderTextColor="#CBD5E1" value={f.val} onChangeText={f.set} />
                  </View>
                ))}
              </View>

              <Text style={s.fieldLabel}>HANDLING NOTES</Text>
              <TextInput style={[s.input, { minHeight: 80 }]} placeholder="Any special instructions for the collector…"
                placeholderTextColor="#CBD5E1" multiline textAlignVertical="top"
                value={notes} onChangeText={setNotes} />

              {/* Location */}
              <Text style={s.fieldLabel}>PICKUP LOCATION</Text>
              <View style={s.locCard}>
                <View style={[s.miniMap, { height: 90 }]}>
                  <MapGrid />
                  <Feather name="map-pin" size={22} color="#EF4444" />
                </View>
                <View style={s.locInfo}>
                  <Feather name="navigation" size={13} color="#2D6A4F" />
                  <View style={{ flex: 1 }}>
                    <Text style={s.locTitle}>Your current location</Text>
                    <Text style={s.locSub}>Durban, KwaZulu-Natal</Text>
                  </View>
                  <TouchableOpacity style={s.adjustBtn} activeOpacity={0.8}>
                    <Text style={s.adjustText}>Adjust pin</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={[s.submitBtn, !(foodName && quantity && expiryDate) && { opacity: 0.45 }]}
                activeOpacity={0.85}>
                <Feather name="send" size={16} color="#4ADE80" />
                <Text style={s.submitText}>Post donation listing</Text>
              </TouchableOpacity>

              <Text style={s.submitHint}>
                Your listing will be visible to all verified coordinators in your area.
              </Text>
            </View>

            <ReportButton onPress={goToReport} />
          </View>
        )}
      </ScrollView>

      {/* ── Listing detail modal ── */}
      <Modal visible={!!selectedListing} transparent animationType="slide"
        onRequestClose={() => setSelectedListing(null)}>
        {selectedListing && (
          <>
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}
              activeOpacity={1} onPress={() => setSelectedListing(null)} />
            <View style={s.sheet}>
              <View style={s.handle} />
              <ScrollView showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

                {/* Header */}
                <View style={s.modalHeader}>
                  <View style={[s.modalIcon, { backgroundColor: PIN_COLORS[selectedListing.pin] + '22' }]}>
                    <Text style={{ fontSize: 28 }}>{selectedListing.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.modalTitle}>{selectedListing.title}</Text>
                    <View style={[s.badge, { alignSelf: 'flex-start', marginTop: 5, backgroundColor: PIN_COLORS[selectedListing.pin] + '22', borderColor: PIN_COLORS[selectedListing.pin] + '55' }]}>
                      <View style={[s.badgeDot, { backgroundColor: PIN_COLORS[selectedListing.pin] }]} />
                      <Text style={[s.badgeText, { color: PIN_COLORS[selectedListing.pin] }]}>{PIN_LABELS[selectedListing.pin]}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedListing(null)} style={s.closeBtn}>
                    <Feather name="x" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Detail rows */}
                <View style={s.detailGrid}>
                  {[
                    { icon: 'package',    label: 'Quantity',      value: selectedListing.quantity },
                    { icon: 'bar-chart',  label: 'Weight est.',   value: selectedListing.weight },
                    { icon: 'map-pin',    label: 'Store',         value: selectedListing.store },
                    { icon: 'navigation', label: 'Distance',      value: selectedListing.distance },
                    { icon: 'clock',      label: 'Pickup window', value: `${selectedListing.pickupStart} – ${selectedListing.pickupEnd}` },
                    { icon: 'tag',        label: 'Category',      value: selectedListing.category },
                  ].map(row => (
                    <View key={row.label} style={s.detailRow}>
                      <View style={s.detailIconBox}><Feather name={row.icon as any} size={13} color="#2D6A4F" /></View>
                      <Text style={s.detailLabel}>{row.label}</Text>
                      <Text style={s.detailValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>

                {/* Handling */}
                {selectedListing.handling && (
                  <View style={s.handlingBox}>
                    <Feather name="alert-circle" size={13} color="#F97316" />
                    <Text style={s.handlingText}>{selectedListing.handling}</Text>
                  </View>
                )}

                {/* Mini-map */}
                <Text style={s.modalSection}>Pickup location</Text>
                <View style={[s.miniMap, { height: 110, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' }]}>
                  <MapGrid />
                  <Feather name="map-pin" size={22} color="#EF4444" />
                  <View style={s.mapStoreBadge}>
                    <Text style={s.mapStoreBadgeText}>{selectedListing.store}</Text>
                  </View>
                </View>

                {/* Request button */}
                {requested.includes(selectedListing.id) ? (
                  <View style={s.reqFullBtn}>
                    <Feather name="check-circle" size={18} color="#22C55E" />
                    <Text style={s.reqFullBtnText}>Request sent — donor notified</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={s.reqBtn} activeOpacity={0.85}
                    onPress={() => { setRequested(r => [...r, selectedListing.id]); setSelectedListing(null); }}>
                    <Feather name="send" size={16} color="#4ADE80" />
                    <Text style={s.reqBtnText}>Request this donation</Text>
                  </TouchableOpacity>
                )}

                <View style={s.threadNote}>
                  <Feather name="message-circle" size={13} color="#0D9488" />
                  <Text style={s.threadNoteText}>
                    After requesting, a message thread opens between you and the donor to coordinate pickup.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </>
        )}
      </Modal>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const G = '#2D6A4F';
const DARK = '#1C3A2E';

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#E2EBE1' },
  divider:      { height: 1, backgroundColor: 'rgba(0,0,0,0.06)' },

  // Sticky top
  stickyTop:    { backgroundColor: '#E2EBE1', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14 },
  title:        { fontSize: 22, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5, marginBottom: 2 },
  subtitle:     { fontSize: 12, color: '#94A3B8', marginBottom: 16 },

  // Tab bar
  tabBar:       { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  tab:          { flex: 1, flexDirection: 'row', paddingVertical: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  tabActive:    { backgroundColor: DARK },
  tabText:      { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  tabTextActive:{ color: '#fff' },

  // Map / list toggle
  toggleRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  toggleLabel:  { flex: 1, fontSize: 13, fontWeight: '700', color: '#1E293B' },
  toggle:       { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 3, borderWidth: 1, borderColor: '#E2E8F0' },
  toggleBtn:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  toggleBtnActive: { backgroundColor: DARK },
  toggleBtnText:{ fontSize: 12, fontWeight: '700', color: '#64748B' },

  // Chips
  chipsRow:     { paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  chip:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive:   { backgroundColor: DARK, borderColor: DARK },
  chipText:     { fontSize: 13, fontWeight: '600', color: '#64748B' },
  chipTextActive:{ color: '#fff' },

  // Map
  mapCard:      { marginHorizontal: 20, height: 220, backgroundColor: '#EEF2F7', borderRadius: 22, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', position: 'relative' },
  mapBadge:     { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#E2E8F0' },
  mapBadgeText: { fontSize: 11, fontWeight: '700', color: G },
  gridLine:     { position: 'absolute', backgroundColor: '#E2E8F0' },
  gridH:        { left: 0, right: 0, height: 1 },
  gridV:        { top: 0, bottom: 0, width: 1 },
  pin:          { position: 'absolute', alignItems: 'center' },
  pinDot:       { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  pinTail:      { width: 3, height: 8, borderRadius: 2, marginTop: -2 },
  legend:       { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#fff', borderRadius: 12, padding: 10, gap: 6, borderWidth: 1, borderColor: '#E2E8F0' },
  legendItem:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot:    { width: 8, height: 8, borderRadius: 4 },
  legendText:   { fontSize: 10, fontWeight: '600', color: '#64748B' },

  // Listing cards
  listPad:      { paddingHorizontal: 20, gap: 12 },
  card:         { backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardIcon:     { width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardTitle:    { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  cardMeta:     { fontSize: 12, color: '#64748B', marginBottom: 2 },
  badgeRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  badge:        { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  badgeDot:     { width: 6, height: 6, borderRadius: 3 },
  badgeText:    { fontSize: 10, fontWeight: '700' },
  qty:          { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  reqBadge:     { backgroundColor: '#F0FDF4', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' },
  reqBadgeText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },

  // Report button
  reportBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 14, borderRadius: 16, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  reportBtnText:{ fontSize: 14, fontWeight: '700', color: '#EF4444' },

  // Give tab
  givePad:      { paddingHorizontal: 20, gap: 16, marginTop: 4 },
  banner:       { backgroundColor: '#FEF3C7', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderColor: '#FDE68A' },
  bannerIcon:   { width: 38, height: 38, backgroundColor: '#FDE68A', borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  bannerTitle:  { fontSize: 14, fontWeight: '800', color: '#B45309', marginBottom: 3 },
  bannerSub:    { fontSize: 12, color: '#D97706', lineHeight: 18 },

  formCard:     { backgroundColor: '#fff', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#F1F5F9', gap: 0 },
  formTitle:    { fontSize: 17, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  photoBox:     { height: 90, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 8, gap: 4 },
  photoLabel:   { fontSize: 14, fontWeight: '700', color: G },
  photoSub:     { fontSize: 11, color: '#94A3B8' },
  fieldLabel:   { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 6, marginTop: 14 },
  subLabel:     { fontSize: 10, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 6 },
  input:        { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: '#1E293B' },

  // Location
  locCard:      { backgroundColor: '#F8FAFC', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  miniMap:      { backgroundColor: '#EEF2F7', position: 'relative', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  locInfo:      { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  locTitle:     { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  locSub:       { fontSize: 11, color: '#94A3B8' },
  adjustBtn:    { backgroundColor: '#F0FDF4', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' },
  adjustText:   { fontSize: 12, fontWeight: '700', color: G },

  submitBtn:    { backgroundColor: DARK, borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
  submitText:   { fontSize: 15, fontWeight: '800', color: '#fff' },
  submitHint:   { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 17, marginTop: 10 },

  // Modal
  sheet:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '88%', paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  handle:       { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginTop: 12 },
  modalHeader:  { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 20 },
  modalIcon:    { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  modalTitle:   { fontSize: 18, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3, flex: 1 },
  closeBtn:     { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  detailGrid:   { gap: 10, marginBottom: 16 },
  detailRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  detailIconBox:{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center' },
  detailLabel:  { fontSize: 12, color: '#94A3B8', fontWeight: '600', width: 90 },
  detailValue:  { flex: 1, fontSize: 13, fontWeight: '700', color: '#1E293B' },
  handlingBox:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF7ED', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#FED7AA', marginBottom: 16 },
  handlingText: { flex: 1, fontSize: 13, color: '#C2410C', lineHeight: 19 },
  modalSection: { fontSize: 13, fontWeight: '800', color: '#1E293B', marginBottom: 10 },
  mapStoreBadge:{ position: 'absolute', bottom: 8, left: 12, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  mapStoreBadgeText: { fontSize: 11, fontWeight: '700', color: '#1E293B' },
  reqBtn:       { backgroundColor: DARK, borderRadius: 18, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  reqBtnText:   { fontSize: 15, fontWeight: '800', color: '#fff' },
  reqFullBtn:   { backgroundColor: '#F0FDF4', borderRadius: 18, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  reqFullBtnText:{ fontSize: 15, fontWeight: '800', color: '#16A34A' },
  threadNote:   { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#F0FDFB', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#99F6E4' },
  threadNoteText:{ flex: 1, fontSize: 12, color: '#0D9488', lineHeight: 18 },
});