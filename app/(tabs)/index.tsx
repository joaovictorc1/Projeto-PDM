import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { router } from "expo-router";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: { id: string; name: string; displayName: string };
  date: string;
};

export default function Home() {
  const { userName } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year] = useState(new Date().getFullYear());
  const [selected, setSelected] = useState<Transaction | null>(null);

  async function load() {
    const response = await api.get("/transactions");
    setTransactions(response.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove() {
    if (!selected) return;
    await api.delete(`/transactions/${selected.id}`);
    setTransactions((old) => old.filter((item) => item.id !== selected.id));
    setSelected(null);
  }

  const filtered = transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Boas-vindas, {userName}</Text>

      <View style={styles.filter}>
        <TouchableOpacity
          onPress={() => setMonth(month === 0 ? 11 : month - 1)}
        >
          <Text style={styles.filterButton}>{"< Mês"}</Text>
        </TouchableOpacity>

        <Text style={styles.filterText}>
          {month + 1}/{year}
        </Text>

        <TouchableOpacity
          onPress={() => setMonth(month === 11 ? 0 : month + 1)}
        >
          <Text style={styles.filterButton}>{"Mês >"}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => setSelected(item)}
            style={styles.card}
          >
            <View style={styles.cardRow}>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text
                style={
                  item.type === "INCOME" ? styles.income : styles.expense
                }
              >
                R$ {Number(item.amount).toFixed(2)}
              </Text>
            </View>
            {item.category && (
              <Text style={styles.categoryLabel}>
                {item.category.displayName}
              </Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma transação neste mês.</Text>
        }
      />

      <Modal transparent visible={!!selected} animationType="fade">
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              router.push({
                pathname: "/edit-transaction",
                params: {
                  id: selected?.id,
                  description: selected?.description,
                  amount: String(selected?.amount),
                  category: selected?.category?.id ?? "",
                },
              });
              setSelected(null);
            }}
          >
            <Text>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={remove}>
            <Text style={{ color: "#DA5567", fontWeight: "bold" }}>
              Excluir
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setSelected(null)}>
            <Text style={{ marginTop: 10 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterButton: {
    fontSize: 16,
    color: "#37BF81",
    fontWeight: "600",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    padding: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardDescription: {
    fontSize: 16,
  },
  income: {
    color: "#37BF81",
    fontWeight: "bold",
  },
  expense: {
    color: "#DA5567",
    fontWeight: "bold",
  },
  categoryLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0005",
  },
  button: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    minWidth: 200,
    alignItems: "center",
  },
});
