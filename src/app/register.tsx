import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  HelperText,
  Snackbar,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const numbersOnlyRegex = /^\d+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strictLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;

export default function RegisterScreen() {
  const theme = useTheme();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [identificationId, setIdentificationId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [aptoNumber, setAptoNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [leader, setLeader] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.error);

  const hasNameError = name.length > 0 && !lettersOnlyRegex.test(name);
  const hasLastnameError = lastname.length > 0 && !lettersOnlyRegex.test(lastname);
  const hasIdentificationError = identificationId.length > 0 && !numbersOnlyRegex.test(identificationId);
  const hasPhoneNumberError = phoneNumber.length > 0 && !numbersOnlyRegex.test(phoneNumber);
  const hasEmailError = email.length > 0 && !emailRegex.test(email);
  const hasAptoError = aptoNumber.length > 0 && !numbersOnlyRegex.test(aptoNumber);
  const hasFloorError = floor.length > 0 && !numbersOnlyRegex.test(floor);
  const hasLeaderError = leader.length > 0 && !strictLettersRegex.test(leader);

  const showMessage = (msg: string, isError = true) => {
    setSnackbarMessage(msg);
    setSnackbarColor(isError ? theme.colors.error : theme.colors.primary);
    setSnackbarVisible(true);
  };

  const handleRegister = async () => {
    if (!name || !lastname || !email || !identificationId || !phoneNumber || !aptoNumber || !floor || !leader || !login || !password) {
      showMessage("Por favor, complete todos los campos.");
      return;
    }

    if (hasNameError || hasLastnameError || hasIdentificationError || hasPhoneNumberError || hasEmailError || hasAptoError || hasFloorError || hasLeaderError) {
      showMessage("Por favor, corrija los errores en el formulario.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = Platform.OS === 'android' ? 'http://192.168.100.8:3001/addusers' : 'http://localhost:3001/addusers';

      const payload = {
        name,
        lastname,
        email,
        identification_id: parseInt(identificationId, 10),
        phone_number: parseInt(phoneNumber, 10),
        apto_number: aptoNumber,
        floor: parseInt(floor, 10),
        leader,
        login,
        password
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.statusCode === 200) {
        showMessage("Usuario registrado exitosamente.", false);
        setTimeout(() => {
          router.replace("/");
        }, 3000);
      } else {
        showMessage(data.message || "Error al registrar el usuario. Verifique los datos e intente nuevamente.");
      }
    } catch (error) {
      console.error(error);
      showMessage("Error al conectar con el servidor. Por favor verifique su conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'left', 'bottom']}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Registro de Usuario" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  label="Nombre"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={styles.input}
                  error={hasNameError}
                />
                <HelperText type="error" visible={hasNameError}>Solo debe contener letras.</HelperText>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="Apellido"
                  value={lastname}
                  onChangeText={setLastname}
                  mode="outlined"
                  style={styles.input}
                  error={hasLastnameError}
                />
                <HelperText type="error" visible={hasLastnameError}>Solo debe contener letras.</HelperText>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="Cédula de Identidad"
                  value={identificationId}
                  onChangeText={setIdentificationId}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={hasIdentificationError}
                />
                <HelperText type="error" visible={hasIdentificationError}>Solo debe contener números.</HelperText>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="Teléfono"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  mode="outlined"
                  style={styles.input}
                  error={hasPhoneNumberError}
                />
                <HelperText type="error" visible={hasPhoneNumberError}>Solo debe contener números.</HelperText>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="outlined"
                  style={styles.input}
                  error={hasEmailError}
                />
                <HelperText type="error" visible={hasEmailError}>Correo electrónico inválido.</HelperText>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                  <TextInput
                    label="Número de Apto"
                    value={aptoNumber}
                    onChangeText={setAptoNumber}
                    mode="outlined"
                    style={styles.input}
                    error={hasAptoError}
                  />
                  <HelperText type="error" visible={hasAptoError}>Solo números.</HelperText>
                </View>
                <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                  <TextInput
                    label="Piso"
                    value={floor}
                    onChangeText={setFloor}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                    error={hasFloorError}
                  />
                  <HelperText type="error" visible={hasFloorError}>Solo números.</HelperText>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="Letra (e.g. G)"
                  value={leader}
                  onChangeText={setLeader}
                  mode="outlined"
                  style={styles.input}
                  error={hasLeaderError}
                />
                <HelperText type="error" visible={hasLeaderError}>Solo debe contener letras.</HelperText>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  label="Usuario (Login)"
                  value={login}
                  onChangeText={setLogin}
                  autoCapitalize="none"
                  mode="outlined"
                  style={styles.input}
                  left={<TextInput.Icon icon="account-outline" />}
                />
              </View>

              <View style={styles.inputWrapper}>
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
              </View>

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.registerButton}
                contentStyle={styles.registerButtonContent}
                loading={loading}
                disabled={loading}
              >
                Registrar
              </Button>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  registerButton: {
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
});
