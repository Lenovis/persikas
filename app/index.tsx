import { FoodPicWithOverlay } from "@/components/FoodPicWithOverlay";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const db = useSQLiteContext();
  const [foodPics, setFoodPics] = useState<any[]>();
  const { top, bottom } = useSafeAreaInsets();

  const result = db.getAllAsync<any>("SELECT * FROM foodPictures");

  useEffect(() => {
    async function setup() {
      setFoodPics(await result);
    }
    setup();
  }, [result]);

  return (
    <>
      <View style={[styles.container, { marginTop: top + 16 }]}>
        {foodPics?.length ? (
          <ScrollView
            style={[styles.flexOne, { width: "100%" }]}
            contentContainerStyle={styles.scrollContainer}
          >
            {foodPics?.map((pic) => (
              <View key={pic.id}>
                <FoodPicWithOverlay capturedImageUri={pic.uri} />
                <View style={styles.ctaButtonsWrapper}>
                  <ThemedText
                    style={[styles.flexOne, { color: "black" }]}
                    onPress={() => {
                      Alert.alert(
                        "Feature not implemented",
                        "This feature is not implemented yet."
                      );
                    }}
                  >
                    Edit
                  </ThemedText>
                  <ThemedText
                    style={{ color: "red" }}
                    onPress={async () => {
                      const removePic = async () =>
                        await db.runAsync(
                          "DELETE FROM foodPictures WHERE id = ?",
                          [pic.id]
                        );
                      Alert.alert(
                        "Are you sure you want to delete this picture?",
                        "This action cannot be undone.",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: removePic,
                          },
                        ]
                      );
                    }}
                  >
                    Delete
                  </ThemedText>
                </View>
              </View>
            ))}
            <View style={{ height: bottom + 16 }} />
          </ScrollView>
        ) : (
          <ThemedText style={styles.disclaimerText}>
            No food pictures yet 😢
          </ThemedText>
        )}
      </View>
      <View style={[styles.buttonContainer, { bottom: bottom + 32 }]}>
        <View style={styles.linkButton}>
          <Link href="/camera" style={styles.link}>
            Take a picture!
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  link: {
    color: "white",
    fontSize: 18,
  },
  linkButton: {
    backgroundColor: "#f97306",
    alignSelf: "center",
    justifyContent: "center",
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  buttonContainer: {
    position: "absolute",
    alignSelf: "center",
  },
  disclaimerText: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
  },
  ctaButtonsWrapper: {
    flexDirection: "row",
    flex: 1,
    margin: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    gap: 16,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
