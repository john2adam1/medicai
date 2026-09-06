import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VitalMonitor } from '../components/VitalMonitor';
import { PatientVisualCard } from '../components/PatientVisualCard';
import { processAction } from '../services/api';
import { AIScenario, ActionResult, ChatMessage, PatientStats, VisualState } from '../types/simulation';

interface SimulationScreenProps {
  scenario: AIScenario;
  language?: string;
  onExit: () => void;
}

const FAST_ACTIONS = [
  'EKG (Elektrokardiogramma) olish',
  'Kislorod maskasini taqish (10 L/min O2)',
  'Venaga kateter qo\'yish (IV line)',
  'Qon analizi yuborish (Kardiomarker, CBC)',
  '0.9% NaCl (Fizrastvor) tomizish',
  'Aspirin 300mg chaynattirish',
];

export const SimulationScreen: React.FC<SimulationScreenProps> = ({ scenario, language = 'uz', onExit }) => {
  const [stats, setStats] = useState<PatientStats>(scenario.patient_stats);
  const [visual, setVisual] = useState<VisualState>(scenario.visual_state);
  const [healthBar, setHealthBar] = useState<number>(100);
  const [customAction, setCustomAction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: scenario.initial_presentation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [actionHistory, setActionHistory] = useState<string[]>([]);
  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        setElapsedMinutes((prev) => prev + 1);
      }
    }, 60000); // 1 minute ticker
    return () => clearInterval(timer);
  }, [gameOver]);

  const handleAction = async (actionText: string) => {
    if (!actionText.trim() || loading || gameOver) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: actionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setCustomAction('');
    setLoading(true);

    try {
      const result: ActionResult = await processAction({
        action: actionText,
        scenario,
        currentStats: stats,
        currentVisual: visual,
        healthBar,
        elapsedMinutes,
        actionHistory,
        language,
      });

      // Update state
      setStats(result.patient_stats);
      setVisual(result.visual_state);
      setHealthBar(result.health_bar);
      setTotalScore((prev) => prev + (result.score_impact || 0));
      setActionHistory((prev) => [...prev, actionText]);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${result.medical_text}\n\n💡 Xulosa: ${result.feedback}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          feedback_type: result.feedback_type,
          score_impact: result.score_impact,
          health_bar: result.health_bar,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (result.game_over) {
        setGameOver(true);
        setGameOverReason(result.game_over_reason || (result.is_alive ? 'Simulyatsiya yakunlandi' : 'Bemor vafot etdi'));
      }
    } catch (err: any) {
      Alert.alert('Xatolik', err.message || 'Tizim javob berishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Screen Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
          <Text style={styles.exitBtnText}>← Chiqish</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.scenarioTitle} numberOfLines={1}>
            {scenario.title}
          </Text>
          <Text style={styles.timeText}>⏱ {elapsedMinutes} / {scenario.time_limit_minutes} daqiqa</Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{totalScore} ball</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Vital Monitor */}
        <VitalMonitor stats={stats} healthBar={healthBar} />

        {/* Patient Visual Status Card */}
        <PatientVisualCard visualState={visual} presentationText={scenario.initial_presentation} />

        {/* Game Over Banner */}
        {gameOver && (
          <View style={[styles.gameOverBox, healthBar > 0 ? styles.gameSuccess : styles.gameFail]}>
            <Text style={styles.gameOverTitle}>
              {healthBar > 0 ? '🎉 SIMULYATSIYA MUVAFFAQIYATLI YAKUNLANDI' : '💀 BEMOR AHVOLI OG\'IRLASHDI (GAME OVER)'}
            </Text>
            <Text style={styles.gameOverDesc}>{gameOverReason}</Text>
            <TouchableOpacity style={styles.restartBtn} onPress={onExit}>
              <Text style={styles.restartBtnText}>Yangi Case Boshlash</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action / Chat History */}
        <Text style={styles.sectionHeader}>KLINIK LOG VA AI JAVOBLARI</Text>
        <View style={styles.chatContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.messageRole}>
                {msg.role === 'user' ? '👨‍⚕️ Sizning harakatingiz' : '🤖 MedicAI Simulyator'} • {msg.timestamp}
              </Text>
              <Text style={styles.messageContent}>{msg.content}</Text>
              {msg.metadata?.score_impact ? (
                <Text style={styles.scoreImpactText}>
                  Impact: {msg.metadata.score_impact > 0 ? `+${msg.metadata.score_impact}` : msg.metadata.score_impact} ball
                </Text>
              ) : null}
            </View>
          ))}
          {loading && (
            <View style={styles.loadingBubble}>
              <ActivityIndicator color="#0EA5E9" size="small" />
              <Text style={styles.loadingText}>AI bemor reaksiyasini hisoblamoqda...</Text>
            </View>
          )}
        </View>

        {/* Fast Action Pills */}
        {!gameOver && (
          <View style={styles.fastActionSection}>
            <Text style={styles.sectionHeader}>TEZKOR MEDISINA HARAKATLARI</Text>
            <View style={styles.fastActionsGrid}>
              {FAST_ACTIONS.map((act, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.fastActionBtn}
                  onPress={() => handleAction(act)}
                  disabled={loading}
                >
                  <Text style={styles.fastActionText}>{act}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Custom Input Bar */}
        {!gameOver && (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Shaxsiy buyruq yoki tashxis..."
              placeholderTextColor="#64748B"
              value={customAction}
              onChangeText={setCustomAction}
              editable={!loading}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!customAction.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => handleAction(customAction)}
              disabled={!customAction.trim() || loading}
            >
              <Text style={styles.sendBtnText}>Yuborish</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  exitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  exitBtnText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  scenarioTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  timeText: {
    color: '#0EA5E9',
    fontSize: 11,
    fontWeight: '600',
  },
  scoreBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  scoreText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginVertical: 8,
  },
  chatContainer: {
    marginVertical: 4,
  },
  messageBubble: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    maxWidth: '92%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0284C7',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  messageRole: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    opacity: 0.8,
  },
  messageContent: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  scoreImpactText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  fastActionSection: {
    marginVertical: 8,
  },
  fastActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  fastActionBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fastActionText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    color: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sendBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  gameOverBox: {
    padding: 16,
    borderRadius: 14,
    marginVertical: 12,
    alignItems: 'center',
  },
  gameSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  gameFail: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  gameOverTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  gameOverDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  restartBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  restartBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
