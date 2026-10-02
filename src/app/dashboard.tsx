import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Appbar, Card, Menu, Text, Title, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: () => {
            // Regresar a la pantalla de login
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['right', 'left', 'bottom']}>
      <Appbar.Header elevated>
        <Appbar.Content title="Dashboard" />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}
        >
          <Menu.Item 
            onPress={() => { closeMenu(); }} 
            title="Gestión de usuarios" 
            leadingIcon="account-group" 
          />
          <Menu.Item 
            onPress={() => { closeMenu(); handleLogout(); }} 
            title="Cerrar Sesión" 
            leadingIcon="logout" 
          />
        </Menu>
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.welcomeText}>¡Bienvenido al sistema!</Text>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Resumen del Sistema</Title>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              Por los momentos, este dashboard es estático. Podrás navegar mediante el menú superior para ver la opción de "Gestión de usuarios".
            </Text>
          </Card.Content>
        </Card>
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
  },
  welcomeText: {
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  }
});
