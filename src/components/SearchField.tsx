import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, space, type } from '../theme';
import { Icon } from './Icon';

/** White rounded field with a leading search glyph. */
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.wrap}>
      <Icon name="search" size={18} color={colors.faint} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.x3,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.hairline,
    paddingHorizontal: space.x4,
    height: 52,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontFamily: type.body.fontFamily as string,
    paddingVertical: 0,
  },
});
