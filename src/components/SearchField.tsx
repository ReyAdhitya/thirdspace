import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '../theme';
import { Icon } from './Icon';

/** White rounded field with a leading search glyph and optional filter glyph. */
export function SearchField({
  value,
  onChange,
  placeholder,
  onFilter,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onFilter?: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <Icon name="search" size={17} color={colors.faint} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        style={styles.input}
      />
      {onFilter ? (
        <Pressable onPress={onFilter} hitSlop={8}>
          <Icon name="sliders" size={17} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x2,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.x3,
    height: 46,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontFamily: type.body.fontFamily as string,
    paddingVertical: 0,
  },
});
