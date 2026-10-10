import { Drawer, DrawerContentScrollView, DrawerItemList, DrawerItem } from 'expo-router/drawer';
import { useTheme, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Appearance, useColorScheme, View } from 'react-native';

export default function DrawerLayout() {
  const theme = useTheme();
  const [roleId, setRoleId] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    AsyncStorage.getItem('roleId').then((val) => {
      if (val) setRoleId(parseInt(val, 10));
    });
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('roleId');
    router.replace('/');
  };

  const toggleTheme = () => {
    Appearance.setColorScheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Drawer 
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <DrawerItemList {...props} />
          </View>
          <View style={{ paddingBottom: 20 }}>
            <Divider style={{ marginBottom: 10 }} />
            <DrawerItem
              label={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              icon={({ color, size }) => (
                <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={size} color={color} />
              )}
              onPress={toggleTheme}
            />
            <DrawerItem
              label="Cerrar sesión"
              icon={({ color, size }) => (
                <Ionicons name="log-out-outline" size={size} color={theme.colors.error} />
              )}
              labelStyle={{ color: theme.colors.error }}
              onPress={handleLogout}
            />
          </View>
        </DrawerContentScrollView>
      )}
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
          drawerItemStyle: { display: roleId === 2 ? 'flex' : 'none' },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          )
        }}
      />
    </Drawer>
  );
}
