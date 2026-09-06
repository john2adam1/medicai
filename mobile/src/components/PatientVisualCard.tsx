import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VisualState } from '../types/simulation';

interface PatientVisualCardProps {
  visualState: VisualState;
  presentationText?: string;
}

export const PatientVisualCard: React.FC<PatientVisualCardProps> = ({ visualState, presentationText }) => {
  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'Pain':
        return { label: 'OG\'RIQDA', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
      case 'Unconscious':
        return { label: 'XUSHSIZ', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'Seizure':
        return { label: 'TUTQANNOQ', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' };
      case 'Dead':
        return { label: 'KLINIK O\'LIM', color: '#64748B', bg: 'rgba(100, 116, 139, 0.2)' };
      case 'Recovery':
        return { label: 'TIKLANMOQDA', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
      default: // Idle
        return { label: 'TENG / BARQAROR', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' };
    }
  };

  const getSkinText = (color: string) => {
    switch (color) {
      case 'pale':
        return 'Oqargan (Oqish)';
      case 'cyanotic':
        return 'Ko\'kargan (Sianotik)';
      case 'flushed':
        return 'Qizargan (Giperemiya)';
      case 'jaundiced':
        return 'Sariqlik mavjud';
      default:
        return 'Me\'yorida (Tabiiy)';
    }
  };

  const badge = getStatusBadge(visualState.spline_state);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>BEMOR HOLATI VA KO'RINISHI</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg, borderColor: badge.color }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Teri rangi:</Text>
        <Text style={styles.infoValue}>{getSkinText(visualState.skin_color)}</Text>
      </View>

      {presentationText ? (
        <View style={styles.presentationBox}>
          <Text style={styles.presentationText}>{presentationText}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 12,
    marginRight: 6,
  },
  infoValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  presentationBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  presentationText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
});
