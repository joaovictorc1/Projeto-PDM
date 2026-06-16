import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";


function RouterGuard() {
  const { userName, loading } = useAuth();

  useEffect(() => {

    if (loading) return;


    if (!userName) {
      router.replace("/login");
    } else {
      router.replace("/(tabs)");
    }

  }, [loading, userName]);


  return (
    <Stack
      screenOptions={{
        headerShown:false
      }}
    />
  );
}


export default function RootLayout() {

  return (
    <AuthProvider>

      <StatusBar style="light" />

      <RouterGuard />

    </AuthProvider>
  );
}