import AuthResource from "@/api/AuthResource";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [error, setError] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const handleLogin = () => {
    if (
      email.length === 0 ||
      password.length === 0 ||
      firstName.length === 0 ||
      lastName.length === 0
    ) {
      Toast.show({
        type: "error",
        text1: "Register Failed",
        text2: "Please fill all the fields",
      });
      return;
    }
    const res = AuthResource.register({
      email: email,
      password: password,
      firstName: firstName || "",
      lastName: lastName || "",
    });
    if (res.status === 200 || res.status === 201) {
      Toast.show({
        type: "success",
        text1: "Login Success",
        text2: "You have successfully logged in",
      });
    }
  };
  return (
    <View className="flex-1 px-4 items-center">
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

      <View>
        <Text>FirstName</Text>
        <TextInput
          placeholder="FirstName"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View>
        <Text>LastName</Text>
        <TextInput
          placeholder="LastName"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
      <TouchableOpacity onPress={() => handleLogin()}>
        Register
      </TouchableOpacity>
    </View>
  );
};
export default Register;
