import { router } from "expo-router";
import { useState } from "react";
import {
  Appearance,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  Paragraph,
  Text,
  TextInput,
  Title,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleTheme = () => {
    Appearance.setColorScheme(isDarkMode ? "light" : "dark");
  };

  const handleLogin = async () => {
    if (!login || !password) {
      setErrorMsg("Por favor ingrese su usuario y contraseña.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Configurado el endpoint sugerido por el usuario
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: login,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        router.replace("/dashboard");
      } else {
        setErrorMsg(data.message || "Usuario o clave incorrecta. Por favor verifique e intente nuevamente.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Error al conectar con el servidor. Por favor verifique su conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.themeToggleContainer}>
              <IconButton
                icon={isDarkMode ? "weather-sunny" : "weather-night"}
                size={24}
                onPress={toggleTheme}
              />
            </View>
            <View style={styles.headerContainer}>
              <Title style={[styles.title, { color: theme.colors.primary }]}>
                Control de pagos de Estacionamiento
              </Title>
              <Paragraph style={styles.subtitle}>
                Por favor, inicia sesión para continuar.
              </Paragraph>
            </View>

            <View style={styles.formContainer}>
              <TextInput
                label="Usuario"
                value={login}
                onChangeText={setLogin}
                mode="outlined"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="account-outline" />}
              />

              <TextInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <View style={styles.forgotPasswordContainer}>
                <Button mode="text" onPress={() => { }} compact>
                  ¿Olvidaste tu contraseña?
                </Button>
              </View>

              {errorMsg ? (
                <Text style={{ color: theme.colors.error, marginBottom: 16, textAlign: 'center' }}>
                  {errorMsg}
                </Text>
              ) : null}

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                loading={loading}
                disabled={loading}
              >
                Iniciar Sesión
              </Button>
            </View>

            <View style={styles.footerContainer}>
              <Text variant="bodyMedium">¿No tienes una cuenta? </Text>
              <Button mode="text" onPress={() => { }} compact>
                Regístrate
              </Button>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  themeToggleContainer: {
    position: "absolute",
    top: 50,
    right: 16,
    zIndex: 1,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  loginButton: {
    borderRadius: 8,
    marginBottom: 24,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
