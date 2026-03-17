import AuthResource from "@/api/AuthResource";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { useRouter } from "expo-router";
const Login = () => {
  const router= useRouter()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading,setIsLoading]=useState(false)
  const { setTokens,setUser } = useAuthStore();
  const [error, setError] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const res = await AuthResource.login({
        email: email.toLowerCase().trim(),
        password: password,
      });
      if (res.status === 200 || res.status === 201) {
        const { accessToken, refreshToken ,user} = res.data;
        
        setUser(user)
        setTokens(accessToken, refreshToken);

        Toast.show({
          type: "success",
          text1: "Login Success",
          text2: "You have successfully logged in",
        });
                setIsLoading(false)
        router.push('/')
      }
    } catch (err:any) {
      const message=err?.response?.data?.message || "invalid email or password"
      setIsLoading(false)
      setError({ email:"",password: message});
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: message,
      });
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <Header showBack/>
      <Text className="font-bold text-gray-700 text-3xl leading-tight  text-center my-20">Step Into the Future OF Shopping</Text>
    <View className=" px-4  ">
      <View className="gap-2 items-start my-4" >
        <Text className="font-medium leading-6 text-lg ">Email or UserName</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail}  className="w-full bg-surface border border-gray-200 rounded-lg"/>
        {error.email.length > 0 && (
          <Text className="text-red-500">{error.email}</Text>
        )}
      </View>
      <View className=" gap-2 items-start my-4 ">
        <Text className="font-medium leading-6 text-lg ">Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          className="w-full bg-surface border border-gray-200 rounded-lg"
        />
        {error.password.length > 0 && (
          <Text className="text-red-500">{error.password}</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleLogin} disabled={isLoading} className="w-full rounded-xl bg-gray-800  py-3 mt-5 disabled:bg-gray-500  disabled:cursor-not-allowed" >{isLoading?<ActivityIndicator size={"small"} color={'#ffffff'}/>:<Text className="text-white text-xl text-center">Log In</Text>}</TouchableOpacity>
    </View>
        <View className="justify-center flex-row gap-1 mt-5 items-center"> <Text className="text-sm text-secondary">Don&apos;t  have an account ? </Text><TouchableOpacity onPress={()=>router.push("/auth/signin")}><Text className="text-sm font-semibold mx-1">Register</Text></TouchableOpacity></View>
    </SafeAreaView>
  );
};
export default Login;
