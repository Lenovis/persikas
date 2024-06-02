import { useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useSQLiteContext } from "expo-sqlite";
import { FoodPicWithOverlay } from "@/components/FoodPicWithOverlay";
import { router } from "expo-router";
import { CameraShutter } from "@/components/CameraShutter";

const foodPicsDir = FileSystem.cacheDirectory + "foodPics/";
const foodPicUri = (picId: string) => foodPicsDir + `food_pic_${picId}.jpg`;

async function ensureDirExists() {
  const dirInfo = await FileSystem.getInfoAsync(foodPicsDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(foodPicsDir, { intermediates: true });
  }
}

async function addFoodPic(picId: string, uri: string): Promise<string> {
  try {
    await ensureDirExists();
    await FileSystem.copyAsync({ from: uri, to: foodPicUri(picId) });
    return foodPicUri(picId);
  } catch (error) {
    throw error;
  }
}

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImageUri, setCapturedImageUri] = useState<string | undefined>(
    undefined
  );
  const db = useSQLiteContext();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (capturedImageUri) {
    return (
      <View style={styles.flexOne}>
        <FoodPicWithOverlay capturedImageUri={capturedImageUri} />
        <Button
          title="Take another picture"
          onPress={() => setCapturedImageUri(undefined)}
        />
        <Button
          title="Save picture"
          onPress={async () => {
            try {
              await addFoodPic(
                `${new Date().getTime()}`,
                capturedImageUri
              ).then((uri) => {
                db.runAsync("INSERT INTO foodPictures (uri) VALUES (?)", [uri]);
              });
              setCapturedImageUri(undefined);
              router.back();
            } catch (error) {
              throw error;
            }
          }}
        />
      </View>
    );
  }

  return <CameraShutter setCapturedImageUri={setCapturedImageUri} />;
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
});
