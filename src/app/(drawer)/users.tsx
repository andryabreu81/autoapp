import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, DataTable, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Definimos un tipo genérico para el usuario
type User = {
  id: string | number;
  [key: string]: any;
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
      // Petición GET al endpoint
      const apiUrl = Platform.OS === 'android' ? 'http://192.168.100.8:3001/users' : 'http://localhost:3001/users';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Asegurarnos de que estamos seteando un arreglo
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
      // Datos mockeados por si el servidor no está corriendo
      Alert.alert(
        'Error',
        'No se pudo conectar al endpoint http://localhost:3001/users. Mostrando datos de prueba.',
        [{ text: 'OK' }]
      );
      setUsers([
        { id: 1, name: 'Juan Perez', email: 'juan@example.com', role: 'admin' },
        { id: 2, name: 'Maria Gomez', email: 'maria@example.com', role: 'user' },
        { id: 3, name: 'Carlos Diaz', email: 'carlos@example.com', role: 'user' },
      ]);
    } finally {
      setLoading(false);
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
          <Button mode="contained" icon="plus" onPress={() => console.log('Agregar nuevo usuario')}>
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
                  {typeof selectedUser[key] === 'object'
                    ? JSON.stringify(selectedUser[key])
                    : String(selectedUser[key])}
                </Text>
              </View>
            ))}
          </ScrollView>

          <Button mode="contained" onPress={hideModal} style={styles.closeButton}>
            Regresar
          </Button>
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
  }
});
