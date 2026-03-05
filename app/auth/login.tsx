import AuthResource from "@/api/AuthResource";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    try {
      const res = AuthResource.login({
        email: email,
        password: password,
      });
      if (res.status === 200 || res.status === 201) {
        Toast.show({
          type: "success",
          text1: "Login Success",
          text2: "You have successfully logged in",
        });
      }
    } catch (err) {
      setError({ email: "", password: "Login Failed" });
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please try again",
      });
    }
  };
  return (
    <View className="flex-1 items-center px-4">
      <View>
        <Text>Email</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
        {error.email.length > 0 && (
          <Text className="text-red-500">{error.email}</Text>
        )}
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        {error.password.length > 0 && (
          <Text className="text-red-500">{error.password}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => handleLogin()}>Login</TouchableOpacity>
    </View>
  );
};
export default Login;
