type ColorScheme = 'light' | 'dark' | undefined;

export const getDrawerColors = (colorScheme: ColorScheme) => ({
  bg: colorScheme === 'light' ? '#F5F5F5' : '#171717',
  inactiveTint: colorScheme === 'light' ? '#383b39' : '#ffffff',
  activeTint: colorScheme === 'light' ? '#ba4c48' : '#f3a49d',
});

export const getCustomHeaderColors = (colorScheme: ColorScheme) => ({
  bg: colorScheme === 'light' ? '#F5F5F5' : '#212121',
  text: colorScheme === 'light' ? '#383b39' : '#fff',
  icon: colorScheme === 'light' ? '#383b39' : '#fff',
  searchBg: colorScheme === 'light' ? '#ffffff' : '#333634',
});

export const getTodoScreenColors = (colorScheme: ColorScheme) => ({
  bg: colorScheme === 'light' ? '#ffffff' : '#171717',
  tabBarBg: colorScheme === 'light' ? '#F5F5F5' : '#212121',
  text: colorScheme === 'light' ? '#383b39' : '#ffffff',
  icon: colorScheme === 'light' ? '#383b39' : '#ffffff',
  tabActiveTint: colorScheme === 'light' ? '#ba4c48' : '#f3a49d',
  tabInactiveTint: colorScheme === 'light' ? '#383b39' : '#ffffff',
  tabBarBorderColor: colorScheme === 'light' ? '#ba4c48' : '#f3a49d',
  categoryBg: colorScheme === 'light' ? '#F5F5F5' : '#212121',
  categoryText: colorScheme === 'light' ? '#383b39' : '#ffffff',
  categoryIcon: colorScheme === 'light' ? '#383b39' : '#ffffff',
  categoryActiveTint: colorScheme === 'light' ? '#f3a49d' : '#f3a49d',
});
