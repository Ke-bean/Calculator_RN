import { Text, SafeAreaView, StyleSheet, Switch, View } from "react-native";
import { useState } from "react";
import { ThemeContext } from "../src/context/ThemeContext";
import { myColors } from "@/src/styles/Colors";
import MyKeyboard from "@/src/components/MyKeyboard";

export default function Index() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaView
        style={
          theme === "light"
            ? styles.container
            : [styles.container, { backgroundColor: "#000" }]
        }
      >
        <View style={styles.topSection}>
          <Text
            style={[
              styles.title,
              { color: theme === "light" ? "#000" : "#fff" },
            ]}
          >
            Calculator App
          </Text>
          <Switch
            value={theme === "light"}
            onValueChange={() => setTheme(theme === "light" ? "dark" : "light")}
          />
        </View>

        <View style={styles.keyboardSection}>
          <MyKeyboard />
        </View>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myColors.light,
  },
  topSection: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  keyboardSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
