import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { myColors } from "../styles/Colors";
import { useRouter } from "expo-router";

const menuItems = [
  { title: "Settings", icon: "⚙️" },
  { title: "About", icon: "ℹ️" },
  { title: "Contact", icon: "📞" },
  { title: "Logout", icon: "🚪" },
];

export default function DrawerContent() {
  const theme = useContext(ThemeContext);
  const router = useRouter();

  const handleMenuPress = (title: string) => {
    // Close the drawer
    // @ts-ignore
    router.closeDrawer();
    // Log the press (since pages don't exist yet)
    console.log(`Pressed ${title}`);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "light" ? myColors.light : "#000" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: theme === "light" ? "#000" : "#fff" }]}
        >
          Menu
        </Text>
      </View>

      <View style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              { backgroundColor: theme === "light" ? "#f0f0f0" : "#1c1c1c" },
            ]}
            onPress={() => handleMenuPress(item.title)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.menuText,
                { color: theme === "light" ? "#000" : "#fff" },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
