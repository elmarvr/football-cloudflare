import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ApiProvider } from "./lib/trpc";
import { Query } from "./query";

export default function App() {
  return (
    <ApiProvider>
      <View style={styles.container}>
        <Query />
        <StatusBar style="auto" />
      </View>
    </ApiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
