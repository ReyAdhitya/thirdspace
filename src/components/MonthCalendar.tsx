import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import {
  daysInHkMonth,
  formatMonthTitle,
  formatWeekdayShort,
  hkDayKey,
  hkDayKeyFromParts,
  hkIso,
  hkParts,
  hkWeekdaySun0,
} from '../lib/time';
import { colors, PHONE_MAX_WIDTH, radius, space, type } from '../theme';
import { Icon } from './Icon';

type Cell = {
  key: string;
  day: number;
  inMonth: boolean;
};

function monthCells(year: number, month: number): Cell[] {
  const lead = hkWeekdaySun0(year, month, 1);
  const dim = daysInHkMonth(year, month);
  const prev =
    month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
  const prevDim = daysInHkMonth(prev.year, prev.month);
  const cells: Cell[] = [];

  for (let i = 0; i < lead; i += 1) {
    const day = prevDim - lead + 1 + i;
    cells.push({
      key: hkDayKeyFromParts(prev.year, prev.month, day),
      day,
      inMonth: false,
    });
  }
  for (let day = 1; day <= dim; day += 1) {
    cells.push({
      key: hkDayKeyFromParts(year, month, day),
      day,
      inMonth: true,
    });
  }
  const next =
    month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      key: hkDayKeyFromParts(next.year, next.month, nextDay),
      day: nextDay,
      inMonth: false,
    });
    nextDay += 1;
  }
  return cells;
}

function shiftMonth(year: number, month: number, delta: number) {
  const next = month + delta;
  if (next < 1) return { year: year - 1, month: 12 };
  if (next > 12) return { year: year + 1, month: 1 };
  return { year, month: next };
}

export function MonthCalendar({
  visible,
  selectedDay,
  openOn,
  markedDays,
  onSelectDay,
  onClose,
  onClear,
}: {
  visible: boolean;
  selectedDay: string | null;
  /** Month to open on when no day is selected (e.g. a past ticket). */
  openOn?: string | null;
  markedDays: Set<string>;
  onSelectDay: (key: string) => void;
  onClose: () => void;
  onClear?: () => void;
}) {
  const { t, lang } = useApp();
  const today = hkDayKey(new Date());
  const [cursor, setCursor] = useState(() => {
    const p = hkParts(new Date());
    return { year: Number(p.year), month: Number(p.month) };
  });

  useEffect(() => {
    if (!visible) return;
    const key = selectedDay ?? openOn ?? null;
    if (key) {
      const [year, month] = key.split('-').map(Number);
      setCursor({ year, month });
      return;
    }
    const p = hkParts(new Date());
    setCursor({ year: Number(p.year), month: Number(p.month) });
  }, [visible, selectedDay, openOn]);

  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        formatWeekdayShort(hkIso(2026, 8, 16 + i, 12, 0), lang),
      ),
    [lang],
  );

  const cells = useMemo(
    () => monthCells(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );
  const rows: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <Pressable onPress={onClose} hitSlop={8} style={styles.iconBtn}>
              <Icon name="x" size={18} color={colors.ink} />
              <Text style={[type.meta, { color: colors.muted }]}>{t('close')}</Text>
            </Pressable>
            {selectedDay && onClear ? (
              <Pressable onPress={onClear} hitSlop={8}>
                <Text style={[type.meta, { color: colors.muted }]}>{t('clear')}</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.monthRow}>
            <Pressable
              onPress={() => setCursor((c) => shiftMonth(c.year, c.month, -1))}
              hitSlop={8}
              style={styles.iconBtn}
            >
              <Icon name="chevron-left" size={20} color={colors.ink} />
            </Pressable>
            <Text style={[type.h2, { color: colors.ink, flex: 1, textAlign: 'center' }]}>
              {formatMonthTitle(cursor.year, cursor.month, lang)}
            </Text>
            <Pressable
              onPress={() => setCursor((c) => shiftMonth(c.year, c.month, 1))}
              hitSlop={8}
              style={styles.iconBtn}
            >
              <Icon name="chevron-right" size={20} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {weekdays.map((wd, i) => (
              <Text
                key={`${wd}-${i}`}
                style={[type.small, styles.weekLabel, { color: colors.faint }]}
              >
                {wd}
              </Text>
            ))}
          </View>

          {rows.map((row) => (
            <View key={row[0].key} style={styles.weekRow}>
              {row.map((cell) => {
                const selected = selectedDay === cell.key;
                const isToday = cell.key === today;
                const marked = markedDays.has(cell.key);
                if (!cell.inMonth) {
                  return (
                    <View key={cell.key} style={styles.cell}>
                      <Text style={[type.meta, { color: colors.faint }]}>
                        {cell.day}
                      </Text>
                    </View>
                  );
                }
                return (
                  <Pressable
                    key={cell.key}
                    onPress={() => onSelectDay(cell.key)}
                    style={[
                      styles.cell,
                      styles.cellIn,
                      isToday && !selected && styles.today,
                      selected && styles.selected,
                    ]}
                  >
                    <Text
                      style={[
                        type.metaStrong,
                        { color: selected ? colors.white : colors.ink },
                      ]}
                    >
                      {cell.day}
                    </Text>
                    {marked ? (
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: selected ? colors.white : colors.pine },
                        ]}
                      />
                    ) : (
                      <View style={styles.dotSlot} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.scrim,
  },
  sheet: {
    width: '100%',
    maxWidth: PHONE_MAX_WIDTH,
    backgroundColor: colors.stone,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: space.gutter,
    paddingTop: space.x4,
    paddingBottom: space.x10,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.x3,
  },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 32 },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.x4,
  },
  weekRow: { flexDirection: 'row', marginBottom: space.x1 },
  weekLabel: { flex: 1, textAlign: 'center' },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.x2,
    minHeight: 44,
  },
  cellIn: {
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginHorizontal: 2,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  today: { borderColor: colors.pine },
  selected: { backgroundColor: colors.pine, borderColor: colors.pine },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 3 },
  dotSlot: { width: 5, height: 5, marginTop: 3 },
});
