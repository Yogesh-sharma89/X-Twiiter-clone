import "./global.css"
import { Text, TextInput, View, } from "react-native";


export default function Index() {
  return (
    <View
     className="flex flex-1 items-center justify-center bg-green-200"
    >
      <Text className="text-7xl text-orange-500 rounded font-semibold">
        Hello sir
      </Text>

       <Text className="text-3xl mt-4 text-neutral-600 ">Hello world of react native / expo</Text>
    </View>
  );
}
