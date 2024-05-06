import { Text, View } from "react-native";
import { api } from "./lib/trpc";

export function Query() {
  const { data } = api.hello.useQuery({
    name: "world",
  });

  return <Text>{data?.message}</Text>;
}
