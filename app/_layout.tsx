import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="persikas.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "Home" }}
        />
        <Stack.Screen name="camera" options={{ title: "Camera" }} />
      </Stack>
    </SQLiteProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = (await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version")) || { user_version: 0 };
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE foodPictures (id INTEGER PRIMARY KEY NOT NULL, uri TEXT NOT NULL, calories TEXT, protein TEXT, fat TEXT, carbohydrates TEXT);
`);
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
