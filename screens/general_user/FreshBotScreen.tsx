// screens/general_user/FreshBotScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomHeader from '../../components/CustomHeader';

const BOTTOM_NAV_HEIGHT = 80; // match your tab bar height exactly

// ── Static conversation ─────────────────────────────────────────────────────
const STATIC_MESSAGES = [
  {
    id: '1',
    sender: 'bot',
    text: "Hi Junior! 👋 I'm FreshBot. I noticed your Milk expires today and your Baby Spinach expires tomorrow. Want a quick recipe to use them up, or do you have another question?",
    time: '08:00 AM',
    type: 'text',
  },
  {
    id: '2',
    sender: 'user',
    text: 'What can I make with the spinach and eggs I have?',
    time: '08:02 AM',
    type: 'text',
  },
  {
    id: '3',
    sender: 'bot',
    text: "Great combo! Here are two quick ideas based on what's in your pantry right now:",
    time: '08:02 AM',
    type: 'text',
  },
  {
    id: '4',
    sender: 'bot',
    text: '🍳 Tomato Omelette — 12 min · Uses your spinach, eggs & tomatoes\n🥤 Green Smoothie — 5 min · Uses your spinach & milk before it expires',
    time: '08:02 AM',
    type: 'suggestion',
  },
  {
    id: '5',
    sender: 'user',
    text: 'How long does cooked chicken last in the fridge?',
    time: '08:05 AM',
    type: 'text',
  },
  {
    id: '6',
    sender: 'bot',
    text: "Cooked chicken is safe in the fridge for 3–4 days in an airtight container. ⚠️ I also noticed you have chicken in your pantry added 2 days ago — you've got about 1–2 days left on it.",
    time: '08:05 AM',
    type: 'warning',
  },
];

const SUGGESTED_PROMPTS = [
  '🥬 Use my expiring spinach',
  '🧊 Can I freeze milk?',
  '🛒 Clear my pantry this week',
  '🍗 Chicken recipe ideas',
  '📊 Why do I waste dairy?',
  '🤝 Find nearby donations',
];

const PROACTIVE_ALERT = {
  text: 'Your eggs expire tomorrow and your milk expires today. Want me to suggest something quick to make with both?',
  items: ['Eggs', 'Milk'],
};

export default function FreshBotScreen() {
  const [inputText, setInputText]         = useState('');
  const [messages, setMessages]           = useState(STATIC_MESSAGES);
  const [showProactive, setShowProactive] = useState(true);
  const [isRecording, setIsRecording]     = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      time: 'Just now',
      type: 'text',
    };

    const botReply = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: "I'm still learning! The backend team will connect me to Gemini soon. Try one of the suggested prompts in the meantime. 🌿",
      time: 'Just now',
      type: 'text',
    };

    setMessages(prev => [...prev, userMsg, botReply]);
    setInputText('');
    setShowProactive(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  };

  const handlePromptTap = (prompt: string) => {
    const clean = prompt.replace(/^\p{Emoji}\s*/u, '').trim();
    setInputText(clean);
  };

  const toggleRecording = () => setIsRecording(r => !r);

  return (
    // marginBottom pushes the entire screen above the bottom nav bar
    <View style={[s.root, { marginBottom: BOTTOM_NAV_HEIGHT }]}>
      <CustomHeader />
      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} />

      {/* ── Bot identity bar ── */}
      <View style={s.botBar}>
        <View style={s.botAvatar}>
          <Text style={{ fontSize: 20 }}>🤖</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.botName}>FreshBot</Text>
          <View style={s.onlineRow}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>Always online · Pantry-aware</Text>
          </View>
        </View>
        <View style={s.contextTag}>
          <Feather name="cpu" size={11} color="#2D6A4F" />
          <Text style={s.contextTagText}>AI</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── Chat scroll area ── */}
        <ScrollView
          ref={scrollRef}
          style={s.chatScroll}
          contentContainerStyle={s.chatContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: false })
          }
        >
          {/* Date separator */}
          <View style={s.dateSep}>
            <View style={s.dateLine} />
            <Text style={s.dateLabel}>Today</Text>
            <View style={s.dateLine} />
          </View>

          {/* Proactive alert banner */}
          {showProactive && (
            <View style={s.proactiveBanner}>
              <View style={s.proactiveTopRow}>
                <View style={s.proactiveIcon}>
                  <Text style={{ fontSize: 15 }}>⚡</Text>
                </View>
                <Text style={s.proactiveTitle}>FreshBot noticed something</Text>
                <TouchableOpacity
                  onPress={() => setShowProactive(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              <Text style={s.proactiveText}>{PROACTIVE_ALERT.text}</Text>
              <View style={s.proactiveChips}>
                {PROACTIVE_ALERT.items.map(item => (
                  <View key={item} style={s.expiryChip}>
                    <View style={s.expiryChipDot} />
                    <Text style={s.expiryChipText}>{item}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={s.proactiveBtn}
                activeOpacity={0.85}
                onPress={() => setShowProactive(false)}
              >
                <Text style={s.proactiveBtnText}>Yes, suggest a recipe →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Messages */}
          {messages.map(msg => {
            const isBot        = msg.sender === 'bot';
            const isSuggestion = msg.type === 'suggestion';
            const isWarning    = msg.type === 'warning';

            return (
              <View
                key={msg.id}
                style={[s.msgRow, isBot ? s.msgRowBot : s.msgRowUser]}
              >
                {isBot && (
                  <View style={s.msgAvatar}>
                    <Text style={{ fontSize: 13 }}>🤖</Text>
                  </View>
                )}

                <View style={[
                  s.bubble,
                  isBot        ? s.bubbleBot        : s.bubbleUser,
                  isSuggestion && s.bubbleSuggestion,
                  isWarning    && s.bubbleWarning,
                ]}>
                  {isSuggestion && (
                    <View style={s.bubbleHeader}>
                      <Feather name="zap" size={12} color="#0D9488" />
                      <Text style={[s.bubbleHeaderText, { color: '#0D9488' }]}>
                        Recipe suggestions
                      </Text>
                    </View>
                  )}
                  {isWarning && (
                    <View style={s.bubbleHeader}>
                      <Feather name="alert-triangle" size={12} color="#F97316" />
                      <Text style={[s.bubbleHeaderText, { color: '#F97316' }]}>
                        Pantry alert
                      </Text>
                    </View>
                  )}

                  <Text style={[
                    s.bubbleText,
                    isBot        ? s.bubbleTextBot  : s.bubbleTextUser,
                    isSuggestion && { color: '#0F766E' },
                    isWarning    && { color: '#C2410C' },
                  ]}>
                    {msg.text}
                  </Text>

                  <Text style={[
                    s.bubbleTime,
                    isBot ? s.bubbleTimeBot : s.bubbleTimeUser,
                  ]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Context awareness footer */}
          <View style={s.contextFooter}>
            <Feather name="shield" size={11} color="#CBD5E1" />
            <Text style={s.contextFooterText}>
              FreshBot knows your pantry · dietary prefs · kitchen equipment · waste history
            </Text>
          </View>
        </ScrollView>

        {/* ── Input area — sits above bottom nav, never overlaps it ── */}
        <View style={s.inputArea}>

          {/* Suggested prompts */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.promptsScroll}
          >
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <TouchableOpacity
                key={i}
                style={s.promptChip}
                onPress={() => handlePromptTap(prompt)}
                activeOpacity={0.7}
              >
                <Text style={s.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Recording banner */}
          {isRecording && (
            <View style={s.recordingBanner}>
              <View style={s.recordingDot} />
              <Text style={s.recordingText}>Recording… tap mic to stop</Text>
              <TouchableOpacity onPress={toggleRecording}>
                <Feather name="x" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}

          {/* Input row */}
          <View style={s.inputRow}>
            {/* Camera button */}
            <TouchableOpacity style={s.roundIconBtn} activeOpacity={0.8}>
              <Feather name="camera" size={18} color="#64748B" />
            </TouchableOpacity>

            {/* Text box */}
            <View style={s.textInputWrap}>
              <TextInput
                style={s.textInput}
                placeholder="Ask FreshBot anything..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={200}
              />
            </View>

            {/* Send or mic */}
            {inputText.trim().length > 0 ? (
              <TouchableOpacity
                style={s.sendBtn}
                onPress={handleSend}
                activeOpacity={0.85}
              >
                <Feather name="send" size={16} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.sendBtn, isRecording ? s.sendBtnRecording : s.sendBtnMic]}
                onPress={toggleRecording}
                activeOpacity={0.85}
              >
                <Feather
                  name={isRecording ? 'mic-off' : 'mic'}
                  size={16}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root:               { flex: 1, backgroundColor: '#fff' },
  flex:               { flex: 1 },

  // Bot bar
  botBar:             { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  botAvatar:          { width: 44, height: 44, borderRadius: 13, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BBF7D0' },
  botName:            { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  onlineRow:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot:          { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22C55E' },
  onlineText:         { fontSize: 11, color: '#64748B', fontWeight: '500' },
  contextTag:         { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F0FDF4', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#BBF7D0' },
  contextTagText:     { fontSize: 12, fontWeight: '700', color: '#2D6A4F' },

  // Chat
  chatScroll:         { flex: 1, backgroundColor: '#F8FAFC' },
  chatContent:        { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 },

  dateSep:            { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  dateLine:           { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dateLabel:          { fontSize: 11, color: '#94A3B8', fontWeight: '600' },

  // Proactive banner
  proactiveBanner:    { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#BBF7D0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  proactiveTopRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  proactiveIcon:      { width: 28, height: 28, backgroundColor: '#FEF3C7', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  proactiveTitle:     { flex: 1, fontSize: 13, fontWeight: '800', color: '#1E293B' },
  proactiveText:      { fontSize: 14, color: '#475569', lineHeight: 21, marginBottom: 12 },
  proactiveChips:     { flexDirection: 'row', gap: 8, marginBottom: 14 },
  expiryChip:         { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#FECACA' },
  expiryChipDot:      { width: 7, height: 7, borderRadius: 4, backgroundColor: '#EF4444' },
  expiryChipText:     { fontSize: 12, fontWeight: '700', color: '#DC2626' },
  proactiveBtn:       { backgroundColor: '#1C3A2E', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  proactiveBtnText:   { fontSize: 13, fontWeight: '800', color: '#4ADE80' },

  // Messages
  msgRow:             { flexDirection: 'row', marginBottom: 14, alignItems: 'flex-end' },
  msgRowBot:          { justifyContent: 'flex-start', paddingRight: 48 },
  msgRowUser:         { justifyContent: 'flex-end', paddingLeft: 48 },
  msgAvatar:          { width: 28, height: 28, borderRadius: 9, backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 2, flexShrink: 0 },

  bubble:             { paddingHorizontal: 14, paddingVertical: 11, borderRadius: 20, flexShrink: 1 },
  bubbleBot:          { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 5, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  bubbleUser:         { backgroundColor: '#1C3A2E', borderBottomRightRadius: 5 },
  bubbleSuggestion:   { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 },
  bubbleWarning:      { backgroundColor: '#FFF7ED', borderColor: '#FED7AA', borderWidth: 1 },

  bubbleHeader:       { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  bubbleHeaderText:   { fontSize: 11, fontWeight: '800' },
  bubbleText:         { fontSize: 14, lineHeight: 21 },
  bubbleTextBot:      { color: '#1E293B' },
  bubbleTextUser:     { color: '#fff' },
  bubbleTime:         { fontSize: 10, marginTop: 5, alignSelf: 'flex-end' },
  bubbleTimeBot:      { color: '#94A3B8' },
  bubbleTimeUser:     { color: 'rgba(255,255,255,0.5)' },

  contextFooter:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, paddingHorizontal: 20 },
  contextFooterText:  { fontSize: 11, color: '#CBD5E1', textAlign: 'center', flex: 1, lineHeight: 16 },

  // Input area
  inputArea:          { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingBottom: Platform.OS === 'ios' ? 12 : 8 },

  promptsScroll:      { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 8 },
  promptChip:         { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 16 },
  promptText:         { fontSize: 12, color: '#475569', fontWeight: '600' },

  recordingBanner:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 8, backgroundColor: '#FEF2F2', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#FECACA' },
  recordingDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  recordingText:      { flex: 1, fontSize: 12, color: '#DC2626', fontWeight: '600' },

  inputRow:           { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingTop: 4, gap: 8 },
  roundIconBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 1 },
  textInputWrap:      { flex: 1, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 22, minHeight: 44, maxHeight: 110, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 11 : 8, justifyContent: 'center' },
  textInput:          { fontSize: 14, color: '#1E293B', padding: 0 },

  sendBtn:            { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1C3A2E', alignItems: 'center', justifyContent: 'center', shadowColor: '#1C3A2E', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3, marginBottom: 1 },
  sendBtnMic:         { backgroundColor: '#2D6A4F' },
  sendBtnRecording:   { backgroundColor: '#EF4444' },
});