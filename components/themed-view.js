import { View } from 'react-native';
import React from 'react';

import { useThemeColor } from '@/hooks/use-theme-color';

export function ThemedView({ style, lightColor, darkColor, ...otherProps }) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
