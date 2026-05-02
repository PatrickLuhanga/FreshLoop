// screens/general_user/AIRecipeScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/CustomHeader';
import RecipeModal from '../../components/RecipeModal'; // Import your new reusable modal

const HOUSEHOLD_SIZE = 2;

type Ingredient = { name: string; amount?: number; unit?: string; inPantry: boolean; custom?: boolean };
type Recipe = {
  id: string; title: string; time: string; difficulty: string;
  tag: string; tagColor: string; tagBg: string; icon: string;
  calories: number; steps: string[]; ingredients: Ingredient[];
};

// ── MOCK DATA ──
const RECIPES: Recipe[] = [
  {
    id: '1', title: 'French Toast', time: '15 min', difficulty: 'Easy',
    tag: 'Uses expiring items', tagColor: '#0D9488', tagBg: '#CCFBF1', icon: '🍞', calories: 320,
    ingredients: [
      { name: 'Bread', amount: 4, unit: 'slices', inPantry: true },
      { name: 'Eggs', amount: 2, unit: 'pcs', inPantry: true },
      { name: 'Milk', amount: 60, unit: 'ml', inPantry: true },
      { name: 'Butter', amount: 10, unit: 'g', inPantry: false },
      { name: 'Sugar', amount: 10, unit: 'g', inPantry: false },
    ],
    steps: ['Whisk eggs, milk and a pinch of sugar in a bowl.', 'Dip each bread slice into the egg mixture on both sides.', 'Melt butter in a pan over medium heat.', 'Fry slices for 2–3 min per side until golden brown.', 'Serve warm with syrup or fresh fruit.'],
  },
  {
    id: '2', title: 'Green Smoothie', time: '5 min', difficulty: 'Easy',
    tag: 'Uses expiring items', tagColor: '#0D9488', tagBg: '#CCFBF1', icon: '🥤', calories: 180,
    ingredients: [
      { name: 'Baby Spinach', amount: 60, unit: 'g', inPantry: true },
      { name: 'Apples', amount: 1, unit: 'pcs', inPantry: true },
      { name: 'Milk', amount: 200, unit: 'ml', inPantry: true },
      { name: 'Honey', amount: 10, unit: 'ml', inPantry: false },
    ],
    steps: ['Core and chop the apple into chunks.', 'Add spinach, apple and milk to a blender.', 'Add honey to taste.', 'Blend on high for 45 seconds until smooth.', 'Pour into a glass and serve immediately.'],
  },
  {
    id: '3', title: 'Tomato Omelette', time: '12 min', difficulty: 'Medium',
    tag: 'High protein', tagColor: '#16A34A', tagBg: '#DCFCE7', icon: '🍳', calories: 280,
    ingredients: [
      { name: 'Eggs', amount: 3, unit: 'pcs', inPantry: true },
      { name: 'Tomatoes', amount: 1, unit: 'pcs', inPantry: true },
      { name: 'Baby Spinach', amount: 30, unit: 'g', inPantry: true },
      { name: 'Cheese', amount: 30, unit: 'g', inPantry: true },
      { name: 'Olive oil', amount: 10, unit: 'ml', inPantry: false },
    ],
    steps: ['Dice tomatoes and roughly chop spinach.', 'Whisk eggs with salt and pepper.', 'Heat oil in a non-stick pan over medium heat.', 'Pour in eggs and let set slightly around the edges.', 'Add filling to one half and fold over. Cook 1 more minute.'],
  },
  {
    id: '4', title: 'Vegetable Stew', time: '30 min', difficulty: 'Easy',
    tag: 'Clears 4 items', tagColor: '#0284C7', tagBg: '#E0F2FE', icon: '🍲', calories: 240,
    ingredients: [
      { name: 'Tomatoes', amount: 3, unit: 'pcs', inPantry: true },
      { name: 'Baby Spinach', amount: 100, unit: 'g', inPantry: true },
      { name: 'Carrots', amount: 2, unit: 'pcs', inPantry: true },
      { name: 'Onion', amount: 1, unit: 'pcs', inPantry: false },
      { name: 'Stock', amount: 500, unit: 'ml', inPantry: false },
    ],
    steps: ['Dice onion, carrots and tomatoes.', 'Sauté onion in a pot with oil until soft.', 'Add carrots and tomatoes, cook 5 min.', 'Pour in stock and simmer 15 min until carrots are tender.', 'Stir in spinach and cook 2 more minutes. Season to taste.'],
  },
];

const ARCHIVED: Recipe[] = [
  {
    id: '5', title: 'Egg Fried Rice', time: '20 min', difficulty: 'Medium',
    tag: 'Saved recipe', tagColor: '#7C3AED', tagBg: '#EDE9FE', icon: '🍚', calories: 400,
    ingredients: [
      { name: 'Rice', amount: 200, unit: 'g', inPantry: true },
      { name: 'Eggs', amount: 2, unit: 'pcs', inPantry: true },
      { name: 'Soy sauce', amount: 20, unit: 'ml', inPantry: false },
    ],
    steps: ['Cook rice and allow to cool completely.', 'Scramble eggs in a hot wok and set aside.', 'Stir-fry rice in the same wok until slightly crispy.', 'Add eggs back, drizzle soy sauce, toss to combine.'],
  },
];

export default function AIRecipeScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'suggestions' | 'archive'>('suggestions');
  const [selected, setSelected] = useState<Recipe | null>(null);

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <TouchableOpacity onPress={() => setSelected(recipe)} activeOpacity={0.75} style={s.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={[s.iconBox, { backgroundColor: recipe.tagBg }]}>
          <Text style={{ fontSize: 24 }}>{recipe.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle}>{recipe.title}</Text>
          <Text style={s.cardSub} numberOfLines={1}>{recipe.ingredients.map(i => i.name).join(' · ')}</Text>
        </View>
        <Feather name="share-2" size={16} color="#CBD5E1" />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Feather name="clock" size={11} color="#94A3B8" />
          <Text style={s.meta}>{recipe.time}</Text>
          <Text style={s.dot}>·</Text>
          <Text style={s.meta}>{recipe.difficulty}</Text>
          <Text style={s.dot}>·</Text>
          <Text style={s.meta}>{recipe.calories} kcal</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[s.tag, { backgroundColor: recipe.tagBg }]}>
            <Text style={[s.tagText, { color: recipe.tagColor }]}>{recipe.tag}</Text>
          </View>
          <Feather name="chevron-right" size={14} color="#CBD5E1" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>
      <CustomHeader />
      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky header */}
        <View style={{ backgroundColor: '#E2EBE1', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
          <Text style={s.screenTitle}>Recipe suggestions 🍽️</Text>
          <Text style={s.screenSub}>Built from what's in your pantry</Text>
          <View style={s.tabBar}>
            {(['suggestions', 'archive'] as const).map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} activeOpacity={0.8}
                style={[s.tab, activeTab === tab && s.tabActive]}>
                <Text style={[s.tabText, activeTab === tab && { color: '#fff' }]}>
                  {tab === 'suggestions' ? 'Suggestions' : 'Archive'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI banner */}
        <View style={s.banner}>
          <View style={s.bannerIcon}><Text style={{ fontSize: 22 }}>🤖</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#fff', marginBottom: 3 }}>AI-powered suggestions</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 }}>
              Using your {RECIPES.length + 6} pantry items · Cooking for{' '}
              <Text style={{ fontWeight: '700', color: '#4ADE80' }}>{HOUSEHOLD_SIZE} people</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.8} style={s.bannerEdit}>
            <Text style={{ color: '#4ADE80', fontSize: 11, fontWeight: '700' }}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Section label */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 }}>
          <Feather name="zap" size={13} color="#F97316" style={{ marginRight: 5 }} />
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>
            {activeTab === 'suggestions' ? 'Use milk + bread first' : 'Previously saved recipes'}
          </Text>
        </View>

        {/* Recipe List */}
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {(activeTab === 'suggestions' ? RECIPES : ARCHIVED).map(r => <RecipeCard key={r.id} recipe={r} />)}
        </View>

        <TouchableOpacity activeOpacity={0.8} style={s.loadMore}>
          <Feather name="refresh-cw" size={14} color="#2D6A4F" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Generate more recipes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity onPress={() => navigation.navigate('QuickAdd')} activeOpacity={0.85} style={s.fab}>
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* ── REUSABLE RECIPE MODAL ── */}
      <RecipeModal 
        visible={!!selected} 
        recipe={selected} 
        onClose={() => setSelected(null)} 
        householdSize={HOUSEHOLD_SIZE} 
      />

    </View>
  );
}

// ── Stripped-down Styles ──
const s = StyleSheet.create({
  screenTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5, marginBottom: 3 },
  screenSub: { fontSize: 13, color: '#94A3B8', marginBottom: 16 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14, padding: 4, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#1C3A2E' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#94A3B8' },
  banner: { marginHorizontal: 20, marginBottom: 20, backgroundColor: '#2D6A4F', borderRadius: 22, padding: 18, flexDirection: 'row', alignItems: 'center', shadowColor: '#2D6A4F', shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
  bannerIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  bannerEdit: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  iconBox: { width: 50, height: 50, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 3 },
  cardSub: { fontSize: 12, color: '#94A3B8' },
  tag: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 10, fontWeight: '700' },
  meta: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  dot: { color: '#E2E8F0', fontWeight: '800' },
  loadMore: { marginHorizontal: 20, marginTop: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#2D6A4F', alignItems: 'center', justifyContent: 'center', shadowColor: '#2D6A4F', shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
});