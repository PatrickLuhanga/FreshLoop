// screens/npo_user/CoordinatorProfileScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../../components/CustomHeader";

const DRIVERS = [
  { id: "1", name: "Sipho Dlamini", phone: "+27 72 123 4567", active: true },
  { id: "2", name: "Thabo Nkosi", phone: "+27 83 987 6543", active: true },
  { id: "3", name: "Priya Govender", phone: "+27 61 456 7890", active: false },
];

const FOOD_TYPES = ["Fresh Produce", "Baked Goods", "Dairy", "Dry Goods", "Prepared Meals", "Cooked Meals"];

export default function CoordinatorProfileScreen() {
  const navigation = useNavigation<any>();
  const [radius, setRadius] = useState(25);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState(["Fresh Produce", "Baked Goods", "Dairy"]);

  const toggleFoodType = (type: string) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E2EBE1' }}>
      <CustomHeader
        settingsScreen="SecuritySettings"
        profileScreen="CoordinatorProfile"
        notificationsScreen="NPONotifications"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
      >
        {/* Title */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E293B', letterSpacing: -0.5 }}>
            Coordinator Profile
          </Text>
          <TouchableOpacity style={{ backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <Text style={{ color: '#2D6A4F', fontSize: 12, fontWeight: '700' }}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Top Profile Card */}
        <View style={cardStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: 'rgba(45,106,79,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(45,106,79,0.2)' }}>
              <Feather name="briefcase" size={28} color="#2D6A4F" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E293B', marginRight: 8 }}>FoodForward KZN</Text>
              </View>
              <View style={{ alignSelf: 'flex-start', backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', marginBottom: 6 }}>
                <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>✓ Verified NPO</Text>
              </View>
              <Text style={{ color: '#64748B', fontSize: 13 }}>Reg: NPO 123/456 · Durban Metro</Text>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SecuritySettings")}
            activeOpacity={0.8}
            style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(45,106,79,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Feather name="shield" size={16} color="#2D6A4F" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1 }}>Security</Text>
            <Feather name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Report")}
            activeOpacity={0.8}
            style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(239,68,68,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Feather name="flag" size={16} color="#EF4444" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1 }}>Report</Text>
            <Feather name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Org Details */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
          Details
        </Text>
        <View style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {[
            { label: "NPO Name", value: "FoodForward KZN", icon: "home" },
            { label: "Registration No.", value: "NPO 123/456", icon: "file-text" },
            { label: "Area of Operation", value: "Greater Durban Metro", icon: "map" },
            { label: "Contact Email", value: "coord@ffkzn.org.za", icon: "mail" },
          ].map((item, i, arr) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#F1F5F9' }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Feather name={item.icon as any} size={14} color="#64748B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '700', marginBottom: 2 }}>{item.label}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Service Radius */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
          Service Radius
        </Text>
        <View style={cardStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600' }}>Operations Map radius</Text>
            <View style={{ backgroundColor: 'rgba(45,106,79,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ color: '#2D6A4F', fontWeight: '800', fontSize: 14 }}>{radius} km</Text>
            </View>
          </View>

          {/* Slider Visual */}
          <View style={{ height: 24, justifyContent: 'center', marginBottom: 12 }}>
            <View style={{ height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, width: '100%' }} />
            <View style={{ position: 'absolute', left: 0, height: 6, backgroundColor: '#2D6A4F', borderRadius: 3, width: `${((radius - 5) / 45) * 100}%` }} />
            <View style={{ 
              position: 'absolute', width: 24, height: 24, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#2D6A4F', 
              left: `${((radius - 5) / 45) * 100}%`, marginLeft: -12, shadowColor: '#2D6A4F', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 
            }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>5 km</Text>
            {[15, 25, 35].map((v) => (
              <TouchableOpacity key={v} onPress={() => setRadius(v)}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: radius === v ? '#2D6A4F' : '#CBD5E1' }}>{v}</Text>
              </TouchableOpacity>
            ))}
            <Text style={{ fontSize: 12, color: '#94A3B8', fontWeight: '700' }}>50 km</Text>
          </View>
        </View>

        {/* Preferred Food Types */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
          Preferred Food Types
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {FOOD_TYPES.map((type) => {
            const selected = selectedFoodTypes.includes(type);
            return (
              <TouchableOpacity
                key={type}
                onPress={() => toggleFoodType(type)}
                activeOpacity={0.8}
                style={{
                  paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
                  backgroundColor: selected ? '#2D6A4F' : '#fff',
                  borderWidth: 1, borderColor: selected ? '#2D6A4F' : '#E2E8F0',
                  shadowColor: '#000', shadowOpacity: selected ? 0.2 : 0.02, shadowRadius: 4, elevation: selected ? 2 : 1,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: selected ? '#fff' : '#64748B' }}>
                  {selected && "✓ "}{type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Driver Roster */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingLeft: 4, paddingRight: 4 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Driver Roster
          </Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name="plus-circle" size={14} color="#2D6A4F" />
            <Text style={{ color: '#2D6A4F', fontWeight: '800', fontSize: 12 }}>Add</Text>
          </TouchableOpacity>
        </View>
        <View style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          {DRIVERS.map((driver, i, arr) => (
            <View key={driver.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: '#F1F5F9' }}>
              <View style={{ width: 40, height: 40, backgroundColor: '#2D6A4F', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>
                  {driver.name.split(" ").map((n) => n[0]).join("")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 }}>{driver.name}</Text>
                <Text style={{ fontSize: 12, color: '#94A3B8' }}>{driver.phone}</Text>
              </View>
              <View style={{ backgroundColor: driver.active ? '#F0FDF4' : '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: driver.active ? 'rgba(16,185,129,0.2)' : 'transparent' }}>
                <Text style={{ fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: driver.active ? '#10B981' : '#94A3B8' }}>
                  {driver.active ? "Active" : "Offline"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Documents */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, paddingLeft: 4 }}>
          Documents
        </Text>
        <View style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
            <Feather name="file-text" size={20} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 2 }}>NPO Registration</Text>
            <Text style={{ fontSize: 12, color: '#64748B' }}>Uploaded 12 Jan 2026</Text>
          </View>
          <Feather name="check-circle" size={20} color="#10B981" />
        </View>

        {/* Sign Out */}
        <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#fff', borderRadius: 20, paddingVertical: 18, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#F1F5F9' }}>
          <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 15 }}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}