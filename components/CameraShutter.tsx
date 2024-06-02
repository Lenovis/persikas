import { CameraCapturedPicture, CameraView } from "expo-camera";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CameraProps = {
  setCapturedImageUri: (uri: string) => void;
};

export function CameraShutter({ setCapturedImageUri }: CameraProps) {
  const cameraRef = useRef<CameraView>(null);
  const { bottom } = useSafeAreaInsets();
  const dimensions = Dimensions.get("window");
  const [cropHeights, setCropHeights] = useState({
    top: 0,
    bottom: 0,
    overallHeight: 0,
  });

  const saveAndCropImage = async (image?: CameraCapturedPicture) => {
    const imageDimensions = {
      width: image?.width || 0,
      height: image?.height || 0,
    };

    const originY =
      (imageDimensions.height * cropHeights.top) / cropHeights.overallHeight;

    const manipResult = await manipulateAsync(
      image?.uri || "",
      [
        {
          crop: {
            height: imageDimensions.width,
            originX: 0,
            originY,
            width: imageDimensions.width,
          },
        },
      ],
      { compress: 1, format: SaveFormat.PNG }
    );
    setCapturedImageUri(manipResult.uri);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.flexOne}
        facing="back"
        ref={cameraRef}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setCropHeights((prev) => ({
            ...prev,
            overallHeight: height,
          }));
        }}
      >
        <View
          style={{
            backgroundColor: "#00000080",
            width: "100%",
            flex: 1,
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setCropHeights((prev) => ({
              ...prev,
              top: height,
            }));
          }}
        />
        <View
          style={{
            height: dimensions.width,
          }}
        />
        <View
          style={{
            backgroundColor: "#00000080",
            width: "100%",
            flex: 1,
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setCropHeights((prev) => ({
              ...prev,
              bottom: height + bottom,
            }));
          }}
        />
        <View
          style={{
            backgroundColor: "#00000080",
            width: "100%",
            height: bottom,
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { marginBottom: bottom }]}
            onPress={async () => {
              try {
                const photo = await cameraRef.current?.takePictureAsync();
                saveAndCropImage(photo);
              } catch (error) {
                throw error;
              }
            }}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  flexOne: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "grey",
  },
});
