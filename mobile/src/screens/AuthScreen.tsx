import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { loginUser, registerUser } from '../services/auth';
import { UserProfile } from '../types/auth';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
  onSkipGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onSkipGuest }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('doctor@medicai.uz');
  const [password, setPassword] = useState<string>('password123');
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<'student' | 'resident' | 'doctor'>('student');
  const [courseLevel, setCourseLevel] = useState<string>('4-kurs talabasi');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email va parolni to\'liq kiriting');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setErrorMessage('Ism va familiyangizni kiriting');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const user = await loginUser(email, password);
        onAuthSuccess(user);
      } else {
        const user = await registerUser(fullName, email, password, role, courseLevel);
        Alert.alert('Muvaffaqiyatli!', `Xush kelibsiz, ${user.fullName}!`);
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header & Logo */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>🩺</Text>
            </View>
            <Text style={styles.brandTitle}>MedicAI</Text>
            <Text style={styles.brandSubtitle}>
              Klinik AI Simulyatsiya va Ta'lim Tizimi
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, isLogin && styles.tabButtonActive]}
              onPress={() => {
                setIsLogin(true);
                setErrorMessage('');
              }}
            >
              <Text style={[styles.tabButtonText, isLogin && styles.tabButtonTextActive]}>
                Kirish (Sign In)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, !isLogin && styles.tabButtonActive]}
              onPress={() => {
                setIsLogin(false);
                setErrorMessage('');
              }}
            >
              <Text style={[styles.tabButtonText, !isLogin && styles.tabButtonTextActive]}>
                Ro'yxatdan o'tish
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
              </View>
            ) : null}

            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>To'liq ismingiz</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Masalan: Dr. Alisher Vohidov"
                    placeholderTextColor="#64748B"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mutaxassislik darajangiz</Text>
                  <View style={styles.roleRow}>
                    <TouchableOpacity
                      style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
                      onPress={() => {
                        setRole('student');
                        setCourseLevel('4-kurs talabasi');
                      }}
                    >
                      <Text style={[styles.roleBtnText, role === 'student' && styles.roleBtnTextActive]}>
                        🎓 Talaba
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleBtn, role === 'resident' && styles.roleBtnActive]}
                      onPress={() => {
                        setRole('resident');
                        setCourseLevel('Klinik ordinator / Rezident');
                      }}
                    >
                      <Text style={[styles.roleBtnText, role === 'resident' && styles.roleBtnTextActive]}>
                        🏥 Rezident
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.roleBtn, role === 'doctor' && styles.roleBtnActive]}
                      onPress={() => {
                        setRole('doctor');
                        setCourseLevel('Amaliyotchi shifokor');
                      }}
                    >
                      <Text style={[styles.roleBtnText, role === 'doctor' && styles.roleBtnTextActive]}>
                        🩺 Shifokor
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email manzil</Text>
              <TextInput
                style={styles.input}
                placeholder="nomingiz@example.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Parol</Text>
              <TextInput
                style={styles.input}
                placeholder="Parolingizni kiriting"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0F172A" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isLogin ? 'Tizimga kirish 🚀' : 'Hisob yaratish ✨'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Quick Demo Fill */}
            {isLogin && (
              <TouchableOpacity
                style={styles.quickFillBtn}
                onPress={() => {
                  setEmail('doctor@medicai.uz');
                  setPassword('password123');
                }}
              >
                <Text style={styles.quickFillText}>💡 Demo hisob ma'lumotlarini to'ldirish</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Skip / Guest Option */}
          <View style={styles.guestSection}>
            <TouchableOpacity style={styles.guestBtn} onPress={onSkipGuest}>
              <Text style={styles.guestBtnText}>Mehmon sifatida davom etish →</Text>
            </TouchableOpacity>
            <Text style={styles.footerNote}>
              MedicAI • Haqiqiy vaqtli klinik qaror qabul qilish trenajyori
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#0EA5E9',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#F8FAFC',
    fontSize: 15,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  roleBtnActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  roleBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  roleBtnTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  quickFillBtn: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 6,
  },
  quickFillText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '500',
  },
  guestSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  guestBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  guestBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerNote: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
});
