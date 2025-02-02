import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DrawerContent from "../src/components/DrawerContent";
import { useState } from "react";
import { ThemeContext } from "../src/context/ThemeContext";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function RootLayout() {
  const [theme, setTheme] = useState("light");
  const navigation = useNavigation();

  return (
    <ThemeContext.Provider value={theme}>
      <Drawer
        screenOptions={{
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Ionicons
                name="menu"
                size={24}
                color={theme === "light" ? "#000" : "#fff"}
              />
            </TouchableOpacity>
          ),
          drawerStyle: {
            width: "50%",
          },
          headerStyle: {
            backgroundColor: theme === "light" ? "#fff" : "#000",
          },
          headerTintColor: theme === "light" ? "#000" : "#fff",
          swipeEnabled: false, // Disable swipe gesture
        }}
        drawerContent={() => <DrawerContent />}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerTitle: "Calculator",
            drawerLabel: "Calculator",
          }}
        />
      </Drawer>
    </ThemeContext.Provider>
  );
}
