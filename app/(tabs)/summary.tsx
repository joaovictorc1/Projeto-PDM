import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
import api from "../../services/api";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category?: {
    name: string;
  };
  date: string;
};

const CHART_COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF",
];

export default function Summary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year] = useState(new Date().getFullYear());

  async function load() {
    const response = await api.get("/transactions");
    setTransactions(response.data);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const grouped: Record<string, number> = {};

  filtered.forEach((item) => {
    const category = item.category?.name ?? "Sem categoria";

    if (!grouped[category]) {
      grouped[category] = 0;
    }

    if (item.type === "EXPENSE") {
      grouped[category] += Number(item.amount);
    }
  });

  const chartData = Object.keys(grouped).map((key, index) => ({
    name: key,
    population: grouped[key],
    color: CHART_COLORS[index % CHART_COLORS.length],
    legendFontColor: "#000",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo</Text>

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

      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={330}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
        />
      ) : (
        <Text style={styles.empty}>Nenhuma despesa neste mês.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
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
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
