import { router, useNavigation } from "expo-router";

import { StyleSheet, View } from "react-native";
import { Appbar, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['right', 'left', 'bottom']}>
      <Appbar.Header elevated>
        <Appbar.Action icon="menu" onPress={() => (navigation as any).openDrawer()} />
        <Appbar.Content title="Gestión de usuarios" />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Usuarios</Text>
        <Text variant="bodyMedium">
          Aquí irá la pantalla de gestión de usuarios.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  }
});
