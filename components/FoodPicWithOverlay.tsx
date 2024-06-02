import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

export function FoodPicWithOverlay({
  capturedImageUri,
}: {
  capturedImageUri: string;
}) {
  const dimensions = Dimensions.get("window");
  return (
    <View
      style={{
        height: dimensions.width,
        width: dimensions.width,
      }}
    >
      <Image
        source={{ uri: capturedImageUri }}
        style={{ height: dimensions.width }}
      />
      <LinearGradient
        colors={["transparent", "transparent", "transparent", "#000000d5"]}
        style={styles.linearGradient}
      />
      <Image
        source={require("../assets/images/persikas.png")}
        style={styles.logo}
      />
      <View style={styles.textWrapper}>
        <View style={styles.textInnerWrapper}>
          {/* TODO: Get data from actual image metadata */}
          <ThemedText style={styles.text20}>Ompletas su varske</ThemedText>
          <View style={[styles.row, styles.flexOne]}>
            <View style={styles.flexOne}>
              <ThemedText style={[styles.text12]}>Kalorijos</ThemedText>
              <ThemedText style={[styles.text20]}>98 kcal</ThemedText>
            </View>
            <View style={styles.flexOne}>
              <ThemedText style={[styles.text12]}>Baltymai</ThemedText>
              <ThemedText style={[styles.text20]}>23g</ThemedText>
            </View>
            <View style={styles.flexOne}>
              <ThemedText style={[styles.text12]}>Riebalai</ThemedText>
              <ThemedText style={[styles.text20]}>8g</ThemedText>
            </View>
            <View style={styles.flexOne}>
              <ThemedText style={[styles.text12]}>Angliavandeniai</ThemedText>
              <ThemedText style={[styles.text20]}>77g</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  text20: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  text12: {
    fontSize: 12,
    color: "white",
  },
  linearGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  logo: {
    position: "absolute",
    top: 8,
    right: 8,
    height: 70,
    width: 70,
  },
  textWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  textInnerWrapper: {
    margin: 16,
    gap: 12,
  },
});
