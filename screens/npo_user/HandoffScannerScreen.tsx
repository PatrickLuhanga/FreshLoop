// screens/npo_user/HandoffScannerScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

function QRViewfinder() {
  const cornerSize = 24;
  const cornerThickness = 4;
  const cornerColor = "#2D6A4F";
  const scannerSize = width - 80;

  return (
    <View style={{ width: scannerSize, height: scannerSize, position: "relative", alignSelf: "center" }}>
      {/* Dark overlay cutout */}
      <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 16 }} />

      {/* Corner TL */}
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        <View style={{ width: cornerSize, height: cornerThickness, backgroundColor: cornerColor, borderRadius: 2 }} />
        <View style={{ width: cornerThickness, height: cornerSize, backgroundColor: cornerColor, borderRadius: 2, marginTop: -cornerThickness }} />
      </View>
      {/* Corner TR */}
      <View style={{ position: "absolute", top: 0, right: 0 }}>
        <View style={{ width: cornerSize, height: cornerThickness, backgroundColor: cornerColor, borderRadius: 2 }} />
        <View style={{ width: cornerThickness, height: cornerSize, backgroundColor: cornerColor, borderRadius: 2, marginTop: -cornerThickness, marginLeft: "auto", alignSelf: "flex-end" }} />
      </View>
      {/* Corner BL */}
      <View style={{ position: "absolute", bottom: 0, left: 0 }}>
        <View style={{ width: cornerThickness, height: cornerSize, backgroundColor: cornerColor, borderRadius: 2 }} />
        <View style={{ width: cornerSize, height: cornerThickness, backgroundColor: cornerColor, borderRadius: 2, marginTop: -cornerThickness }} />
      </View>
      {/* Corner BR */}
      <View style={{ position: "absolute", bottom: 0, right: 0 }}>
        <View style={{ width: cornerThickness, height: cornerSize, backgroundColor: cornerColor, borderRadius: 2, alignSelf: "flex-end" }} />
        <View style={{ width: cornerSize, height: cornerThickness, backgroundColor: cornerColor, borderRadius: 2, marginTop: -cornerThickness, marginLeft: "auto" }} />
      </View>

      {/* Scan line */}
      <View style={{
          position: "absolute", left: 16, right: 16, top: "50%", height: 2,
          backgroundColor: cornerColor, opacity: 0.8, borderRadius: 1,
          shadowColor: cornerColor, shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1, shadowRadius: 6,
        }}
      />

      {/* Center QR placeholder */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
          {/* Simulated QR grid */}
          {[...Array(5)].map((_, row) => (
            <View key={row} style={{ flexDirection: "row", marginBottom: 4 }}>
              {[...Array(5)].map((_, col) => {
                const filled = Math.random() > 0.4;
                return (
                  <View key={col} style={{
                      width: 16, height: 16, backgroundColor: filled ? "rgba(255,255,255,0.4)" : "transparent",
                      marginRight: 4, borderRadius: 2,
                    }}
                  />
                );
              })}
            </View>
          ))}
        </View>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 12, fontWeight: "600" }}>Align QR code here</Text>
      </View>
    </View>
  );
}

function PINModal({ visible, onClose, onSubmit }: { visible: boolean; onClose: () => void; onSubmit: (pin: string) => void }) {
  const [pin, setPin] = useState("");

  const handleDigit = (d: string) => { if (pin.length < 4) setPin((p) => p + d); };
  const handleDelete = () => setPin((p) => p.slice(0, -1));

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "#E2EBE1", borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
          <View style={{ width: 40, height: 4, backgroundColor: "#CBD5E1", borderRadius: 2, alignSelf: "center", marginBottom: 20 }} />
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#1E293B", textAlign: "center", marginBottom: 4 }}>Enter PIN</Text>
          <Text style={{ fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 24 }}>Ask the business to read their 4-digit PIN</Text>

          {/* PIN dots */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 32 }}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={{
                  width: 56, height: 56, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center",
                  borderColor: i < pin.length ? "#2D6A4F" : "#CBD5E1",
                  backgroundColor: i < pin.length ? "rgba(45,106,79,0.1)" : "#fff"
                }}
              >
                {i < pin.length && <Text style={{ fontSize: 24, fontWeight: "800", color: "#2D6A4F" }}>{pin[i]}</Text>}
              </View>
            ))}
          </View>

          {/* Numpad */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            {digits.map((d, i) => (
              <TouchableOpacity key={i} onPress={() => (d === "⌫" ? handleDelete() : d !== "" ? handleDigit(d) : null)} disabled={d === ""}
                style={{
                  width: 80, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center",
                  backgroundColor: d === "" ? "transparent" : "#fff",
                  shadowColor: d === "" ? "transparent" : "#000", shadowOpacity: d === "" ? 0 : 0.04, shadowRadius: 4, elevation: d === "" ? 0 : 1
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "800", color: "#1E293B" }}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={() => { if (pin.length === 4) { onSubmit(pin); setPin(""); } }} disabled={pin.length < 4} activeOpacity={0.85}
            style={{
              backgroundColor: pin.length === 4 ? "#2D6A4F" : "#CBD5E1",
              borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 12,
              shadowColor: pin.length === 4 ? "#2D6A4F" : "transparent", shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
            }}
          >
            <Text style={{ fontWeight: "800", fontSize: 16, color: "#fff" }}>Confirm Handoff</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 12, paddingVertical: 12, alignItems: "center" }}>
            <Text style={{ color: "#64748B", fontWeight: "700" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function SuccessModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 32, alignItems: "center", width: "100%", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#2D6A4F", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Feather name="check" size={40} color="#FFF" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E293B", marginBottom: 8, textAlign: 'center' }}>Transaction Complete!</Text>
          <Text style={{ fontSize: 13, color: "#64748B", textAlign: "center", marginBottom: 8 }}>Handoff verified at 14:32 · Both parties notified</Text>
          
          <View style={{ backgroundColor: "rgba(45,106,79,0.1)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 24 }}>
            <Text style={{ fontSize: 12, color: "#2D6A4F", fontWeight: "800", textAlign: "center" }}>Spar Westville · 8 kg Fresh Produce</Text>
          </View>

          <View style={{ width: "100%", marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: "#475569", marginBottom: 8 }}>Confirm Actual Quantity Received</Text>
            <TextInput
              style={{ backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: "#1E293B", fontWeight: "700" }}
              placeholder="e.g. 7.5 kg (if different)"
              placeholderTextColor="#9CA3AF"
              defaultValue="8 kg"
            />
          </View>

          <TouchableOpacity onPress={onClose} activeOpacity={0.85} style={{ width: "100%", backgroundColor: "#2D6A4F", borderRadius: 14, paddingVertical: 16, alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function HandoffScannerScreen() {
  const [showPIN, setShowPIN] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#1C3A2E" }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff", letterSpacing: -0.5 }}>Handoff Scanner</Text>
            <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Scan the business QR code</Text>
          </View>
          <TouchableOpacity style={{ width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
            <Feather name="zap" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Scanner area */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <QRViewfinder />
          <TouchableOpacity onPress={() => setShowSuccess(true)} activeOpacity={0.8} style={{ marginTop: 32, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", borderRadius: 16, paddingHorizontal: 32, paddingVertical: 16 }}>
            <Text style={{ color: "#fff", fontWeight: "800", textAlign: "center" }}>Simulate Successful Scan</Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center", marginTop: 4 }}>(tap to test flow)</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom panel */}
        <View style={{ backgroundColor: "#E2EBE1", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}>
          {/* Active pickup info */}
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Current Pickup</Text>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E293B", marginBottom: 2 }}>Spar Westville</Text>
                <Text style={{ fontSize: 13, color: "#64748B" }}>8 kg · Fresh Produce</Text>
              </View>
              <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 }}>
                <Text style={{ color: "#92400E", fontSize: 11, fontWeight: "800" }}>En Route</Text>
              </View>
            </View>
          </View>

          {/* PIN fallback */}
          <TouchableOpacity onPress={() => setShowPIN(true)} activeOpacity={0.8} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#fff", borderRadius: 16, paddingVertical: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 }}>
            <Feather name="key" size={16} color="#475569" />
            <Text style={{ color: "#475569", fontWeight: "800", marginLeft: 8 }}>Enter PIN Instead</Text>
          </TouchableOpacity>

          {/* Report issue */}
          <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: 16, paddingVertical: 14 }}>
            <Feather name="alert-triangle" size={16} color="#EF4444" />
            <Text style={{ color: "#EF4444", fontWeight: "800", marginLeft: 8 }}>Report an Issue</Text>
          </TouchableOpacity>

          <Text style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 16 }}>Scanning logs timestamp, location & quantity</Text>
        </View>

        <PINModal visible={showPIN} onClose={() => setShowPIN(false)} onSubmit={(pin) => { setShowPIN(false); setShowSuccess(true); }} />
        <SuccessModal visible={showSuccess} onClose={() => setShowSuccess(false)} />
      </SafeAreaView>
    </View>
  );
}