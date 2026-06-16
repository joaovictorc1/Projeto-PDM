import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import api from "../../services/api";

type Category = {
  id: string;
  name: string;
  displayName: string;
};

export default function AddTransactions() {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
      if (response.data.length > 0) {
        setCategoryId(response.data[0].id);
      }
    } catch (e) {
      console.log("Erro ao carregar categorias:", e);
    }
  }

  async function handleSave() {
    if (!description.trim()) {
      Alert.alert("Erro", "Preencha a descrição.");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      Alert.alert("Erro", "Valor deve ser maior que zero.");
      return;
    }

    if (!categoryId) {
      Alert.alert("Erro", "Selecione uma categoria.");
      return;
    }

    try {
      await api.post("/transactions", {
        description: description.trim(),
        value: numValue,
        date: new Date(date).toISOString(),
        categoryId,
        type,
      });

      Alert.alert("Sucesso", "Transação criada!");
      setDescription("");
      setValue("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Falha ao criar transação.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          placeholder="Ex: Almoço, Salário..."
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />

        <Text style={styles.label}>Valor (R$)</Text>
        <TextInput
          placeholder="0.00"
          value={value}
          onChangeText={setValue}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
        <TextInput
          placeholder="2026-06-01"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "EXPENSE" && styles.typeActive,
            ]}
            onPress={() => setType("EXPENSE")}
          >
            <Text
              style={type === "EXPENSE" ? styles.typeTextActive : undefined}
            >
              Despesa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "INCOME" && styles.typeActiveIncome,
            ]}
            onPress={() => setType("INCOME")}
          >
            <Text
              style={type === "INCOME" ? styles.typeTextActive : undefined}
            >
              Receita
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={categoryId}
            onValueChange={(val) => setCategoryId(val)}
          >
            {categories.map((cat) => (
              <Picker.Item
                key={cat.id}
                label={cat.displayName}
                value={cat.id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Adicionar" onPress={handleSave} color="#37BF81" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  typeActive: {
    backgroundColor: "#DA5567",
    borderColor: "#DA5567",
  },
  typeActiveIncome: {
    backgroundColor: "#37BF81",
    borderColor: "#37BF81",
  },
  typeTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
