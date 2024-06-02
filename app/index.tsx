import { FoodPicWithOverlay } from "@/components/FoodPicWithOverlay";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const db = useSQLiteContext();
  const [foodPics, setFoodPics] = useState<any[]>();
  const dimensions = Dimensions.get("window");
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: top + 16,
        }}
      >
        {foodPics?.length ? (
          <ScrollView
            style={{ width: "100%", flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              gap: 16,
            }}
          >
            {foodPics?.map((pic) => (
              <View key={pic.id}>
                <FoodPicWithOverlay capturedImageUri={pic.uri} />
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    margin: 16,
                  }}
                >
                  <ThemedText
                    style={{ color: "black", flex: 1 }}
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
                      // create alert with double check are you sure you want to delete
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
          <ThemedText
            style={{
              fontSize: 24,
              color: "black",
              fontWeight: "bold",
            }}
          >
            No food pictures yet 😢
          </ThemedText>
        )}
      </View>
      <View
        style={{
          alignSelf: "center",
          position: "absolute",
          bottom: bottom + 32,
        }}
      >
        <View
          style={{
            backgroundColor: "#f97306",
            alignSelf: "center",
            justifyContent: "center",
            height: 32,
            paddingHorizontal: 16,
            borderRadius: 16,
          }}
        >
          <Link
            href="/camera"
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            Take a picture!
          </Link>
        </View>
      </View>
    </>
  );
}
