import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ActivityIndicator, Appbar, Button, DataTable, HelperText, Menu, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Regex para validaciones
const lettersOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const numbersOnlyRegex = /^\d+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strictLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;

// Definimos un tipo genérico para el usuario
type User = {
  id: string | number;
  [key: string]: any;
};

const initialForm = {
  name: '',
  email: '',
  lastname: '',
  role_id: '',
  identification_id: '',
  phone_number: '',
  apto_number: '',
  floor: '',
  leader: '',
  login: '',
  password: '',
  confirm_password: ''
};

const renderDetailValue = (key: string, value: any) => {
  if (key === 'role_id') {
    if (value === 2 || value === '2') return 'Administrador';
    if (value === 3 || value === '3') return 'Propietario';
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export default function UsersScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [page, setPage] = useState(0);
  const [itemsPerPage] = useState(5);

  // Estado del Modal de Detalles
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Estado del Modal de Agregar Usuario
  const [addVisible, setAddVisible] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Estado del Selector de Roles
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);
  const roleOptions = [
    { label: 'Administrador', value: '2' },
    { label: 'Propietario', value: '3' }
  ];
  const getRoleLabel = (val: string) => {
    const role = roleOptions.find(r => r.value === val);
    return role ? role.label : '';
  };

  // Validaciones
  const hasNameError = formData.name.length > 0 && !lettersOnlyRegex.test(formData.name);
  const hasLastnameError = formData.lastname.length > 0 && !lettersOnlyRegex.test(formData.lastname);
  const hasIdentificationError = formData.identification_id.length > 0 && !numbersOnlyRegex.test(formData.identification_id);
  const hasPhoneNumberError = formData.phone_number.length > 0 && !numbersOnlyRegex.test(formData.phone_number);
  const hasEmailError = formData.email.length > 0 && !emailRegex.test(formData.email);
  const hasAptoError = formData.apto_number.length > 0 && !numbersOnlyRegex.test(formData.apto_number);
  const hasFloorError = formData.floor.length > 0 && !numbersOnlyRegex.test(formData.floor);
  const hasLeaderError = formData.leader.length > 0 && !strictLettersRegex.test(formData.leader);

  const passwordsMatch = (formData.confirm_password || '').length > 0 && formData.password === formData.confirm_password;
  const passwordsMismatch = (formData.confirm_password || '').length > 0 && formData.password !== formData.confirm_password;

  const showModal = (user: User) => {
    setSelectedUser(user);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUrl = Platform.OS === 'android' ? 'http://192.168.100.8:3001/users' : 'http://localhost:3001/users';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        console.warn('La API no devolvió un arreglo esperado:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert(
        'Error',
        'No se pudo conectar al endpoint para traer los usuarios.',
        [{ text: 'OK' }]
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (
      !formData.name || !formData.lastname || !formData.email ||
      !formData.identification_id || !formData.phone_number || !formData.apto_number ||
      !formData.floor || !formData.leader || !formData.login || !formData.password || !formData.confirm_password || !formData.role_id
    ) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    if (
      hasNameError || hasLastnameError || hasIdentificationError ||
      hasPhoneNumberError || hasEmailError || hasAptoError ||
      hasFloorError || hasLeaderError || passwordsMismatch
    ) {
      Alert.alert("Error", "Por favor, corrija los errores en el formulario.");
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = Platform.OS === 'android' ? 'http://192.168.100.8:3001/addusers' : 'http://localhost:3001/addusers';

      const { confirm_password, ...restFormData } = formData;

      const payload = {
        ...restFormData,
        role_id: Number(formData.role_id) || 0,
        identification_id: Number(formData.identification_id) || 0,
        phone_number: Number(formData.phone_number) || 0,
        floor: Number(formData.floor) || 0, active: 1
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      Alert.alert('Éxito', 'Usuario agregado exitosamente');
      setAddVisible(false);
      setFormData(initialForm);
      fetchUsers();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al agregar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, users.length);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['right', 'left', 'bottom']}>
      <Appbar.Header elevated>
        <Appbar.Action icon="menu" onPress={() => (navigation as any).openDrawer()} />
        <Appbar.Content title="Gestión de usuarios" />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text variant="titleLarge" style={styles.title}>Lista de Usuarios</Text>
          <Button mode="contained" icon="plus" onPress={() => setAddVisible(true)}>
            Nuevo
          </Button>
        </View>

        {loading ? (
          <ActivityIndicator animating={true} size="large" style={styles.loader} />
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Nombre</DataTable.Title>
              <DataTable.Title>Email</DataTable.Title>
              <DataTable.Title numeric>Acciones</DataTable.Title>
            </DataTable.Header>

            {(Array.isArray(users) ? users : []).slice(from, to).map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell>{item.name || item.nombres || item.username || 'N/A'}</DataTable.Cell>
                <DataTable.Cell>{item.email || item.correo || 'N/A'}</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Button mode="text" compact onPress={() => showModal(item)}>
                    Ver
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(users.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} de ${users.length}`}
              showFastPaginationControls
              numberOfItemsPerPage={itemsPerPage}
            />
          </DataTable>
        )}
      </View>

      <Portal>
        {/* Modal Detalles del Usuario */}
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>Detalles del Usuario</Text>

          <ScrollView style={styles.modalScroll}>
            {selectedUser && Object.keys(selectedUser).map((key) => (
              <View key={key} style={styles.detailRow}>
                <Text variant="labelLarge" style={styles.detailLabel}>{key}:</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {renderDetailValue(key, selectedUser[key])}
                </Text>
              </View>
            ))}
          </ScrollView>

          <Button mode="contained" onPress={hideModal} style={styles.closeButton}>
            Regresar
          </Button>
        </Modal>

        {/* Modal Agregar Usuario */}
        <Modal
          visible={addVisible}
          onDismiss={() => setAddVisible(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface, maxHeight: '90%' }]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flexShrink: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flexShrink: 1 }}>
                <Text variant="headlineSmall" style={styles.modalTitle}>Nuevo Usuario</Text>

                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  <View style={styles.inputWrapper}>
              <TextInput label="Nombre" value={formData.name} onChangeText={(t) => setFormData({ ...formData, name: t })} style={styles.input} mode="outlined" error={hasNameError} />
              <HelperText type="error" visible={hasNameError}>Solo debe contener letras.</HelperText>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Apellido" value={formData.lastname} onChangeText={(t) => setFormData({ ...formData, lastname: t })} style={styles.input} mode="outlined" error={hasLastnameError} />
              <HelperText type="error" visible={hasLastnameError}>Solo debe contener letras.</HelperText>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Email" value={formData.email} onChangeText={(t) => setFormData({ ...formData, email: t })} keyboardType="email-address" style={styles.input} mode="outlined" autoCapitalize="none" error={hasEmailError} />
              <HelperText type="error" visible={hasEmailError}>Correo electrónico inválido.</HelperText>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Identificación (Cédula)" value={formData.identification_id} onChangeText={(t) => setFormData({ ...formData, identification_id: t })} keyboardType="numeric" style={styles.input} mode="outlined" error={hasIdentificationError} />
              <HelperText type="error" visible={hasIdentificationError}>Solo debe contener números.</HelperText>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Teléfono" value={formData.phone_number} onChangeText={(t) => setFormData({ ...formData, phone_number: t })} keyboardType="numeric" style={styles.input} mode="outlined" error={hasPhoneNumberError} />
              <HelperText type="error" visible={hasPhoneNumberError}>Solo debe contener números.</HelperText>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                <TextInput label="Apto" value={formData.apto_number} onChangeText={(t) => setFormData({ ...formData, apto_number: t })} style={styles.input} mode="outlined" error={hasAptoError} />
                <HelperText type="error" visible={hasAptoError}>Solo números.</HelperText>
              </View>

              <View style={[styles.inputWrapper, { flex: 1, marginLeft: 8 }]}>
                <TextInput label="Piso" value={formData.floor} onChangeText={(t) => setFormData({ ...formData, floor: t })} keyboardType="numeric" style={styles.input} mode="outlined" error={hasFloorError} />
                <HelperText type="error" visible={hasFloorError}>Solo números.</HelperText>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Letra del Líder (e.g. G)" value={formData.leader} onChangeText={(t) => setFormData({ ...formData, leader: t })} style={styles.input} mode="outlined" error={hasLeaderError} />
              <HelperText type="error" visible={hasLeaderError}>Solo debe contener letras.</HelperText>
            </View>

            <View style={styles.inputWrapper}>
              <Menu
                visible={roleMenuVisible}
                onDismiss={() => setRoleMenuVisible(false)}
                anchor={
                  <Pressable onPress={() => setRoleMenuVisible(true)}>
                    <View pointerEvents="none">
                      <TextInput
                        label="Rol"
                        value={getRoleLabel(formData.role_id)}
                        style={styles.input}
                        mode="outlined"
                        right={<TextInput.Icon icon="menu-down" />}
                      />
                    </View>
                  </Pressable>
                }
              >
                {roleOptions.map((option) => (
                  <Menu.Item
                    key={option.value}
                    onPress={() => {
                      setFormData({ ...formData, role_id: option.value });
                      setRoleMenuVisible(false);
                    }}
                    title={option.label}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Login (Usuario)" value={formData.login} onChangeText={(t) => setFormData({ ...formData, login: t })} style={styles.input} mode="outlined" autoCapitalize="none" />
              {/* No specific validation for login string as per rules */}
            </View>

            <View style={styles.inputWrapper}>
              <TextInput label="Contraseña" value={formData.password} onChangeText={(t) => setFormData({ ...formData, password: t })} secureTextEntry style={styles.input} mode="outlined" />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                label="Confirmar Contraseña"
                value={formData.confirm_password}
                onChangeText={(t) => setFormData({ ...formData, confirm_password: t })}
                secureTextEntry
                style={styles.input}
                mode="outlined"
                error={passwordsMismatch}
              />
              <HelperText type="error" visible={passwordsMismatch}>
                Las contraseñas no coinciden.
              </HelperText>
              <HelperText type="info" visible={passwordsMatch} style={{ color: theme.colors.primary }}>
                ¡Las contraseñas coinciden!
              </HelperText>
                </View>
              </ScrollView>

              <View style={styles.actionButtons}>
                <Button mode="text" onPress={() => setAddVisible(false)} style={styles.actionButton}>
                  Cancelar
                </Button>
                <Button mode="contained" onPress={handleAddUser} loading={submitting} disabled={submitting} style={styles.actionButton}>
                  Guardar
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      </Portal>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalScroll: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    paddingBottom: 4,
  },
  detailLabel: {
    width: 100,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  detailValue: {
    flex: 1,
  },
  closeButton: {
    marginTop: 8,
  },
  inputWrapper: {
    marginBottom: 4,
  },
  input: {
    backgroundColor: "transparent",
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 8,
  }
});
