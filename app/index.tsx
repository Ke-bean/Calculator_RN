import {
  Text,
  SafeAreaView,
  StyleSheet,
  Switch,
  View,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { ThemeContext } from "../src/context/ThemeContext";
import { myColors } from "@/src/styles/Colors";
import MyKeyboard from "@/src/components/MyKeyboard";
import * as Battery from "expo-battery";
import * as Notifications from "expo-notifications";
import NetInfo from "@react-native-community/netinfo";

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const [theme, setTheme] = useState("light");
  const [isCharging, setIsCharging] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  }

  async function sendNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        color: "#00ff00",
      },
      trigger: null,
    });
  }

  function toggleBluetoothState() {
    const newState = !isBluetoothOn;
    setIsBluetoothOn(newState);

    if (newState) {
      sendNotification("Bluetooth Status", "Bluetooth is now turned on");
    } else {
      sendNotification("Bluetooth Status", "Bluetooth is now turned off");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    async function checkInitialBatteryState() {
      try {
        const batteryState = await Battery.getBatteryStateAsync();
        const initialIsCharging =
          batteryState === Battery.BatteryState.CHARGING ||
          batteryState === Battery.BatteryState.FULL;
        setIsCharging(initialIsCharging);
      } catch (error) {
        console.error("Failed to get initial battery state:", error);
      }
    }

    checkInitialBatteryState();

    const batteryIntervalId = setInterval(async () => {
      try {
        const batteryState = await Battery.getBatteryStateAsync();
        const newIsCharging =
          batteryState === Battery.BatteryState.CHARGING ||
          batteryState === Battery.BatteryState.FULL;

        if (newIsCharging !== isCharging) {
          setIsCharging(newIsCharging);
          if (newIsCharging) {
            sendNotification("Charging Status", "Your phone is now charging");
          } else {
            sendNotification("Charging Status", "Your phone is unplugged");
          }
        }
      } catch (error) {
        console.error("Failed to check battery state:", error);
      }
    }, 5000);

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isConnectedNow = state.isConnected ?? false;

      if (isConnectedNow !== isConnected) {
        setIsConnected(isConnectedNow);
        if (isConnectedNow) {
          sendNotification("Network Status", "Internet connection established");
        } else {
          sendNotification("Network Status", "Internet connection lost");
        }
      }
    });

    return () => {
      clearInterval(batteryIntervalId);
      unsubscribeNetInfo();
    };
  }, [isCharging, isBluetoothOn, isConnected]);

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaView
        style={
          theme === "light"
            ? styles.container
            : [styles.container, { backgroundColor: "#000" }]
        }
      >
        <View style={styles.notificationsContainer}>
          {isCharging && (
            <View style={styles.notificationBanner}>
              <Text style={styles.notificationText}>📱 Phone is charging</Text>
            </View>
          )}

          {isBluetoothOn && (
            <View
              style={[
                styles.notificationBanner,
                { marginTop: isCharging ? 2 : 0, backgroundColor: "#2196F3" },
              ]}
            >
              <Text style={styles.notificationText}>🔵 Bluetooth is on</Text>
            </View>
          )}

          {!isConnected && (
            <View
              style={[
                styles.notificationBanner,
                {
                  marginTop: isCharging || isBluetoothOn ? 2 : 0,
                  backgroundColor: "#FF5722",
                },
              ]}
            >
              <Text style={styles.notificationText}>
                📶 Internet disconnected
              </Text>
            </View>
          )}

          {isConnected && (
            <View
              style={[
                styles.notificationBanner,
                {
                  marginTop: isCharging || isBluetoothOn ? 2 : 0,
                  backgroundColor: "#8BC34A",
                },
              ]}
            >
              <Text style={styles.notificationText}>📶 Internet connected</Text>
            </View>
          )}
        </View>

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

        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>
              Bluetooth: {isBluetoothOn ? "On" : "Off"}
            </Text>
            <Switch
              value={isBluetoothOn}
              onValueChange={toggleBluetoothState}
              trackColor={{ false: "#767577", true: "#2196F3" }}
              thumbColor={isBluetoothOn ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <View style={styles.statusItem}>
            <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>
              Network: {isConnected ? "Connected" : "Disconnected"}
            </Text>
            <Text
              style={{
                color: isConnected ? "#4CAF50" : "#FF5722",
                fontWeight: "bold",
              }}
            >
              •
            </Text>
          </View>
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
  notificationsContainer: {
    width: "100%",
  },
  notificationBanner: {
    backgroundColor: "#4CAF50",
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  notificationText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
