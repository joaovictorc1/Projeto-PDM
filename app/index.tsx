import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import {
 View,
 ActivityIndicator
} from "react-native";


export default function Index(){

 const {userName, loading}=useAuth();


 if(loading){
   return (
    <View>
      <ActivityIndicator />
    </View>
   )
 }


 if(!userName){
   return <Redirect href="/login"/>
 }


 return <Redirect href="/(tabs)"/>;
}