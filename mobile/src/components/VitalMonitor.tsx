import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PatientStats } from '../types/simulation';

interface VitalMonitorProps {
  stats: PatientStats;
  healthBar: number;
}

export const VitalMonitor: React.FC<VitalMonitorProps> = ({ stats, healthBar }) => {
  // Determine status colors based on vitals
  const getHrColor = (hr: number) => {
    if (hr < 50 || hr > 120) return '#EF4444'; // Red
    if (hr < 60 || hr > 100) return '#F59E0B'; // Amber
    return '#10B981'; // Emerald Green
  };

  const getSpo2Color = (spo2: number) => {
    if (spo2 < 90) return '#EF4444';
    if (spo2 < 95) return '#F59E0B';
    return '#06B6D4'; // Cyan
  };

  const getHealthColor = (health: number) => {
    if (health < 30) return '#EF4444';
    if (health < 60) return '#F59E0B';
    return '#10B981';
  };

  return (
    <View style={styles.container}>
      {/* Patient Health Bar */}
      <View style={styles.healthSection}>
        <View style={styles.healthHeader}>
          <Text style={styles.healthLabel}>BEMOR AHVOLI (HEALTH)</Text>
          <Text style={[styles.healthValue, { color: getHealthColor(healthBar) }]}>
            {Math.max(0, Math.min(100, healthBar))}%
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.max(0, Math.min(100, healthBar))}%`,
                backgroundColor: getHealthColor(healthBar),
              },
            ]}
          />
        </View>
      </View>

      {/* Vital Grid */}
      <View style={styles.grid}>
        {/* Pulse / HR */}
        <View style={[styles.card, { borderColor: getHrColor(stats.hr) }]}>
          <Text style={styles.cardLabel}>PULS (HR)</Text>
          <Text style={[styles.cardValue, { color: getHrColor(stats.hr) }]}>{stats.hr}</Text>
          <Text style={styles.cardUnit}>bpm</Text>
        </View>

        {/* BP */}
        <View style={[styles.card, { borderColor: '#A855F7' }]}>
          <Text style={styles.cardLabel}>QON BOSIM (BP)</Text>
          <Text style={[styles.cardValue, { color: '#C084FC', fontSize: 18 }]}>{stats.bp}</Text>
          <Text style={styles.cardUnit}>mmHg</Text>
        </View>

        {/* SpO2 */}
        <View style={[styles.card, { borderColor: getSpo2Color(stats.spo2) }]}>
          <Text style={styles.cardLabel}>SpO2</Text>
          <Text style={[styles.cardValue, { color: getSpo2Color(stats.spo2) }]}>{stats.spo2}%</Text>
          <Text style={styles.cardUnit}>Saturatsiya</Text>
        </View>

        {/* Resp Rate */}
        <View style={[styles.card, { borderColor: '#3B82F6' }]}>
          <Text style={styles.cardLabel}>NAFAS (RR)</Text>
          <Text style={[styles.cardValue, { color: '#60A5FA' }]}>{stats.rr}</Text>
          <Text style={styles.cardUnit}>/min</Text>
        </View>

        {/* Temperature */}
        <View style={[styles.card, { borderColor: stats.temp > 37.5 ? '#F97316' : '#10B981' }]}>
          <Text style={styles.cardLabel}>HARORAT</Text>
          <Text style={[styles.cardValue, { color: stats.temp > 37.5 ? '#FB923C' : '#34D399' }]}>
            {stats.temp}°C
          </Text>
          <Text style={styles.cardUnit}>Temp</Text>
        </View>

        {/* GCS */}
        <View style={[styles.card, { borderColor: stats.gcs < 12 ? '#EF4444' : '#64748B' }]}>
          <Text style={styles.cardLabel}>GLASGOW (GCS)</Text>
          <Text style={[styles.cardValue, { color: stats.gcs < 12 ? '#F87171' : '#94A3B8' }]}>
            {stats.gcs}/15
          </Text>
          <Text style={styles.cardUnit}>Shkala</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 8,
  },
  healthSection: {
    marginBottom: 12,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  healthLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    width: '31%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cardLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 1,
  },
  cardUnit: {
    color: '#94A3B8',
    fontSize: 9,
  },
});
