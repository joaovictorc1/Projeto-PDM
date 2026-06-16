import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
import { useState } from "react";
import api from "../services/api";
import { router } from "expo-router";

export default function Categories() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("#6c757d");

  async function create() {
    if (!name.trim()) {
      Alert.alert("Erro", "Digite o nome da categoria.");
      return;
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      await api.post("/categories", {
        name: slug,
        displayName: name.trim(),
        icon: icon.trim() || "category",
        color,
      });

      Alert.alert("Sucesso", "Categoria criada!");
      setName("");
      setIcon("");
      setColor("#6c757d");
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Erro ao criar categoria.";
      Alert.alert("Erro", msg);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Categoria</Text>

      <TextInput
        placeholder="Nome (ex: Viagens)"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Ícone (ex: airplanemode-active)"
        value={icon}
        onChangeText={setIcon}
        style={styles.input}
      />

      <TextInput
        placeholder="Cor hex (ex: #FF6384)"
        value={color}
        onChangeText={setColor}
        style={styles.input}
      />

      <Button title="Criar categoria" onPress={create} color="#37BF81" />

      <Button
        title="Voltar"
        onPress={() => router.back()}
        color="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
