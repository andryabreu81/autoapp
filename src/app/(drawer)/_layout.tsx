import { Drawer } from 'expo-router/drawer';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  const theme = useTheme();

  return (
    <Drawer 
      screenOptions={{ 
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.colors.surface,
        },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          drawerLabel: 'Gestión de usuarios',
          title: 'Gestión de usuarios',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          )
        }}
      />
    </Drawer>
  );
}
