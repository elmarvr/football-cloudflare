import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../hooks/use-auth";
import { GoogleSignin as Google } from "@react-native-google-signin/google-signin";

Google.configure({});

export const GoogleSignIn = () => {
  const { signInWithCode } = useAuth();

  async function signIn() {
    await Google.hasPlayServices();
    const { serverAuthCode } = await Google.signIn();

    if (!serverAuthCode) {
      throw new Error("No server auth code");
    }

    const sessionId = await signInWithCode("google", serverAuthCode);
  }

  return (
    <TouchableOpacity>
      <Text>Sign in with Google</Text>
    </TouchableOpacity>
  );
};
