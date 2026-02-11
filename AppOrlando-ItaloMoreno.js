import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Snackbar,
  ActivityIndicator,
  Portal,
  Modal,
  Provider as PaperProvider,
  Badge,
} from 'react-native-paper';

const { width } = Dimensions.get('window');

// Mock de dados de jogos
const mockDatabase = {
  games: [
    {
      id: '1',
      name: 'Elden Ring',
      platform: 'PS5',
      year: '2023',
      genre: 'RPG',
      price: '250',
      available: true,
      description: 'Aventura épica em mundo aberto, com desafios intensos e lore profunda.',
      image: 'https://www.fanaticosdegames.com.br/wp-content/uploads/2022/02/elden-ring.jpg',
    },
    {
      id: '2',
      name: 'Hollow Knight',
      platform: 'PC',
      year: '2017',
      genre: 'Metroidvania',
      price: '50',
      available: true,
      description: 'Jogo indie aclamado com exploração profunda e design artístico incrível.',
      image: 'https://upload.wikimedia.org/wikipedia/en/3/33/Hollow_Knight_cover.jpg',
    },
    {
      id: '3',
      name: 'God of War Ragnarök',
      platform: 'PS5',
      year: '2022',
      genre: 'Ação',
      price: '300',
      available: false,
      description: 'Continuação da épica saga de Kratos, com combates intensos e narrativa envolvente.',
      image: 'https://upload.wikimedia.org/wikipedia/en/f/f6/God_of_War_Ragnarok_cover.jpg',
    },
  ],
};

// Simulação de API
const api = {
  getGames: () => new Promise((resolve) => setTimeout(() => resolve({ games: [...mockDatabase.games] }), 500)),
  addGame: (game) => new Promise((resolve) => {
    const newGame = { ...game, id: Date.now().toString() };
    mockDatabase.games.push(newGame);
    setTimeout(() => resolve(newGame), 500);
  }),
  updateGame: (id, game) => new Promise((resolve) => {
    const index = mockDatabase.games.findIndex((g) => g.id === id);
    if (index !== -1) mockDatabase.games[index] = { ...game, id };
    setTimeout(() => resolve(), 500);
  }),
  deleteGame: (id) => new Promise((resolve) => {
    mockDatabase.games = mockDatabase.games.filter((g) => g.id !== id);
    setTimeout(() => resolve(), 500);
  }),
};

const App = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [snackBar, setSnackBar] = useState({ visible: false, message: '' });

  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [available, setAvailable] = useState(true);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await api.getGames();
      setGames(data.games);
    } catch (e) {
      showSnack('Erro ao carregar jogos!');
    } finally {
      setLoading(false);
    }
  };

  const showSnack = (msg) => setSnackBar({ visible: true, message: msg });

  const clearForm = () => {
    setName(''); setPlatform(''); setYear(''); setGenre('');
    setPrice(''); setDescription(''); setImage('');
    setAvailable(true); setEditingId(null); setVisible(false);
  };

  const handleSubmit = async () => {
    if (!name || !platform || !year || !price) {
      showSnack('Preencha os campos obrigatórios!');
      return;
    }

    const gameData = { name, platform, year, genre, price, description, image, available };

    try {
      if (editingId) {
        await api.updateGame(editingId, gameData);
        showSnack('Jogo atualizado!');
      } else {
        await api.addGame(gameData);
        showSnack('Jogo cadastrado!');
      }
      fetchGames();
      clearForm();
    } catch (e) {
      showSnack('Erro ao salvar jogo!');
    }
  };

  const filteredGames = games.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.platform.toLowerCase().includes(search.toLowerCase()) ||
      g.genre.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.image }} style={styles.cardCover} />
      <Badge
        size={28}
        style={[styles.badge, item.available ? styles.available : styles.unavailable]}
      >
        {item.available ? '✔' : '✗'}
      </Badge>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.platform} - {item.genre} - {item.year}</Paragraph>
        <Text style={styles.price}>R$ {item.price}</Text>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="outlined" onPress={() => {
          setName(item.name); setPlatform(item.platform); setYear(item.year);
          setGenre(item.genre); setPrice(item.price); setDescription(item.description);
          setImage(item.image); setAvailable(item.available); setEditingId(item.id);
          setVisible(true);
        }}>Editar</Button>
        <Button mode="contained" style={{ backgroundColor: '#FF5252' }}
          onPress={() => { setPendingDeleteId(item.id); setConfirmVisible(true); }}
        >Excluir</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          label="Pesquisar jogos"
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={styles.search}
        />

        {loading ? (
          <View style={styles.loading}><ActivityIndicator size="large" animating /></View>
        ) : (
          <FlatList
            data={filteredGames}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50 }}>Nenhum jogo encontrado</Text>}
          />
        )}

        <Portal>
          <Modal visible={visible} onDismiss={clearForm} contentContainerStyle={styles.modalContainer}>
            <Card>
              <Card.Title title={editingId ? 'Editar Jogo' : 'Cadastrar Jogo'} />
              <Card.Content>
                <TextInput label="Nome" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
                <TextInput label="Plataforma" value={platform} onChangeText={setPlatform} mode="outlined" style={styles.input} />
                <TextInput label="Ano" value={year} onChangeText={setYear} mode="outlined" keyboardType="numeric" style={styles.input} />
                <TextInput label="Gênero" value={genre} onChangeText={setGenre} mode="outlined" style={styles.input} />
                <TextInput label="Preço" value={price} onChangeText={setPrice} mode="outlined" keyboardType="numeric" style={styles.input} />
                <TextInput label="URL da Imagem" value={image} onChangeText={setImage} mode="outlined" style={styles.input} />
                <View style={styles.switchContainer}>
                  <Text>Disponível</Text>
                  <TouchableOpacity
                    onPress={() => setAvailable(!available)}
                    style={[styles.toggle, available ? styles.on : styles.off]}
                  >
                    <Text style={{ color: 'white' }}>{available ? 'SIM' : 'NÃO'}</Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={clearForm}>Cancelar</Button>
                <Button mode="contained" onPress={handleSubmit}>{editingId ? 'Atualizar' : 'Cadastrar'}</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>

        <Portal>
          <Modal visible={confirmVisible} onDismiss={() => setConfirmVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Card>
              <Card.Content>
                <Paragraph>Tem certeza que deseja excluir este jogo?</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
                <Button mode="contained" onPress={async () => {
                  try {
                    await api.deleteGame(pendingDeleteId);
                    fetchGames();
                    showSnack('Jogo excluído!');
                  } catch (e) {
                    showSnack('Erro ao excluir jogo!');
                  } finally {
                    setConfirmVisible(false);
                  }
                }}>Excluir</Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>

        <Snackbar
          visible={snackBar.visible}
          onDismiss={() => setSnackBar({ visible: false, message: '' })}
          duration={3000}
        >
          {snackBar.message}
        </Snackbar>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setVisible(true)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  search: { margin: 16, backgroundColor: 'white', borderRadius: 8 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: 16, borderRadius: 12 },
  cardCover: { height: 180 },
  badge: { position: 'absolute', top: 8, right: 8 },
  available: { backgroundColor: '#4CAF50' },
  unavailable: { backgroundColor: '#F44336' },
  price: { fontWeight: 'bold', fontSize: 18, marginTop: 4, color: '#1976D2' },
  actions: { justifyContent: 'space-between' },
  modalContainer: { margin: 16 },
  input: { marginBottom: 12, backgroundColor: 'white' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  toggle: { padding: 8, borderRadius: 20, minWidth: 60, alignItems: 'center' },
  on: { backgroundColor: '#4CAF50' },
  off: { backgroundColor: '#F44336' },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#1976D2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default App;
