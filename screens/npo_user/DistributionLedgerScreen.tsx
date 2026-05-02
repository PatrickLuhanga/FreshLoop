// screens/npo_user/DistributionLedgerScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomHeader from "../../components/CustomHeader";

const LEDGER_DATA = [
  { id: "1", date: "27 Apr 2026", business: "Spar Westville", category: "Fresh Produce", quantity: "8.0 kg", received: "7.5 kg", status: "Completed", discrepancy: true, value: "R 185" },
  { id: "2", date: "26 Apr 2026", business: "Food Lover's Market", category: "Baked Goods", quantity: "5.5 kg", received: "5.5 kg", status: "Completed", discrepancy: false, value: "R 95" },
  { id: "3", date: "25 Apr 2026", business: "Pick n Pay Pavilion", category: "Dairy", quantity: "3.0 kg", received: "3.0 kg", status: "Completed", discrepancy: false, value: "R 120" },
  { id: "4", date: "24 Apr 2026", business: "Checkers Chatsworth", category: "Dry Goods", quantity: "12.0 kg", received: "11.8 kg", status: "Completed", discrepancy: true, value: "R 230" },
  { id: "5", date: "23 Apr 2026", business: "Woolworths Musgrave", category: "Prepared Meals", quantity: "4.2 kg", received: "4.2 kg", status: "Completed", discrepancy: false, value: "R 310" },
  { id: "6", date: "22 Apr 2026", business: "Spar Pinetown", category: "Fresh Produce", quantity: "6.0 kg", received: "6.0 kg", status: "Completed", discrepancy: false, value: "R 145" },
];

const categoryIcons: Record<string, { icon: React.ComponentProps<typeof Feather>['name']; color: string; bg: string }> = {
  "Fresh Produce": { icon: "feather", color: "#10B981", bg: "#F0FDF4" },
  "Baked Goods": { icon: "coffee", color: "#F59E0B", bg: "#FEF3C7" },
  "Dairy": { icon: "droplet", color: "#3B82F6", bg: "#DBEAFE" },
  "Dry Goods": { icon: "package", color: "#8B5CF6", bg: "#EDE9FE" },
  "Prepared Meals": { icon: "shopping-bag", color: "#F97316", bg: "#FFEDD5" },
};

export default function DistributionLedgerScreen() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const totalKg = LEDGER_DATA.reduce((acc, item) => acc + parseFloat(item.received), 0);
  const totalValue = LEDGER_DATA.reduce((acc, item) => acc + parseInt(item.value.replace("R ", "")), 0);

  const filtered = LEDGER_DATA.filter((item) => {
    const matchSearch = search === "" || item.business.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || item.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const filters = ["All", "Fresh Produce", "Baked Goods", "Dairy", "Dry Goods"];

  return (
    <View style={{ flex: 1, backgroundColor: "#E2EBE1" }}>
      <CustomHeader
        settingsScreen="SecuritySettings"
        profileScreen="CoordinatorProfile"
        notificationsScreen="NPONotifications"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5, marginBottom: 4 }}>Distribution Ledger</Text>
            <Text style={{ fontSize: 13, color: "#64748B" }}>Complete chain-of-custody log</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: "#2D6A4F", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, flexDirection: "row", alignItems: "center" }}>
            <Feather name="download" size={14} color="#FFF" />
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, marginLeft: 6 }}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Impact totals */}
        <View style={{ backgroundColor: "#1C3A2E", borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Running Impact Totals</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ fontSize: 36, fontWeight: "800", color: "#fff" }}>{totalKg.toFixed(1)}</Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "rgba(255,255,255,0.7)", marginBottom: 6, marginLeft: 4 }}>kg</Text>
              </View>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600", marginTop: 4 }}>Food Rescued</Text>
            </View>
            <View style={{ width: 1, height: "100%", backgroundColor: "rgba(255,255,255,0.1)", marginHorizontal: 20 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 36, fontWeight: "800", color: "#fff" }}>R{totalValue}</Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600", marginTop: 4 }}>Value Saved</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)" }}>
            <Feather name="check-circle" size={14} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginLeft: 6 }}>{LEDGER_DATA.length} completed pickups this month</Text>
          </View>
        </View>

        {/* Search */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 }}>
          <Feather name="search" size={18} color="#94A3B8" />
          <TextInput
            style={{ flex: 1, marginLeft: 12, fontSize: 14, color: "#1E293B", fontWeight: "600" }}
            placeholder="Search by business or category..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 4 }}>
              <Feather name="x-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginBottom: 20 }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={{
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
                backgroundColor: activeFilter === f ? "#2D6A4F" : "#fff",
                borderWidth: 1, borderColor: activeFilter === f ? "#2D6A4F" : "#E2E8F0",
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: activeFilter === f ? "#fff" : "#64748B" }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Table header */}
        <View style={{ backgroundColor: "#F8FAFC", borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}>
          <Text style={{ fontSize: 11, fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, flex: 1 }}>Business</Text>
          <Text style={{ fontSize: 11, fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, width: 80, textAlign: "right" }}>Received</Text>
          <Text style={{ fontSize: 11, fontWeight: "800", color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, width: 70, textAlign: "right" }}>Value</Text>
        </View>

        {/* Table rows */}
        <View style={{ backgroundColor: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: "hidden", marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          {filtered.map((item, index) => {
            const catCfg = categoryIcons[item.category] || { icon: "package", color: "#64748B", bg: "#F1F5F9" };
            return (
              <View key={item.id} style={{ paddingHorizontal: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", borderBottomWidth: index !== filtered.length - 1 ? 1 : 0, borderBottomColor: "#F1F5F9", backgroundColor: index % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                {/* Left: icon + info */}
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: catCfg.bg, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Feather name={catCfg.icon} size={18} color={catCfg.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: "800", color: "#1E293B" }} numberOfLines={1}>{item.business}</Text>
                      {item.discrepancy && (
                        <View style={{ marginLeft: 6, backgroundColor: "#FEF3C7", width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" }}>
                          <Feather name="alert-triangle" size={10} color="#F59E0B" />
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "600" }}>{item.date}</Text>
                  </View>
                </View>

                {/* Right: quantities */}
                <View style={{ width: 80, alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#1E293B", marginBottom: 2 }}>{item.received}</Text>
                  {item.discrepancy && <Text style={{ fontSize: 11, color: "#EA580C", fontWeight: "600" }}>{item.quantity} listed</Text>}
                </View>
                <View style={{ width: 70, alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: "#2D6A4F" }}>{item.value}</Text>
                </View>
              </View>
            );
          })}

          {filtered.length === 0 && (
            <View style={{ paddingVertical: 40, alignItems: "center", backgroundColor: "#fff" }}>
              <Feather name="search" size={32} color="#CBD5E1" />
              <Text style={{ color: "#94A3B8", fontSize: 14, fontWeight: "600", marginTop: 12 }}>No records found</Text>
            </View>
          )}
        </View>

        {/* Discrepancy note */}
        <View style={{ backgroundColor: "#FFF7ED", borderWidth: 1, borderColor: "#FFEDD5", borderRadius: 16, padding: 16, flexDirection: "row", marginBottom: 24 }}>
          <Feather name="alert-triangle" size={18} color="#EA580C" style={{ marginTop: 2 }} />
          <Text style={{ fontSize: 13, color: "#9A3412", marginLeft: 12, flex: 1, lineHeight: 20 }}>
            <Text style={{ fontWeight: "800" }}>2 discrepancies</Text> logged this month. These are visible to Admin for review.
          </Text>
        </View>

        {/* Export options */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#fff", borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#F1F5F9", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 }} activeOpacity={0.8}>
            <Feather name="file-text" size={16} color="#475569" />
            <Text style={{ color: "#1E293B", fontWeight: "800", fontSize: 14, marginLeft: 8 }}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, backgroundColor: "#fff", borderRadius: 16, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#F1F5F9", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 }} activeOpacity={0.8}>
            <Feather name="grid" size={16} color="#475569" />
            <Text style={{ color: "#1E293B", fontWeight: "800", fontSize: 14, marginLeft: 8 }}>Export CSV</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}