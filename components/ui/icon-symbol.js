import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'cart.fill': 'shopping-cart',
  'person.fill': 'person',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] || 'help-outline'} style={style} />;
}
