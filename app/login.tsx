import {
 View,
 Text,
 TextInput,
 Button,
 StyleSheet,
 Alert
} from "react-native";

import {
 useState
} from "react";

import {
 useAuth
} from "../contexts/AuthContext";


export default function Login(){

 const [name,setName]=useState("");

 const {login}=useAuth();


 async function handleLogin(){

   if(!name.trim()){
     Alert.alert(
       "Erro",
       "Digite seu nome"
     );
     return;
   }


   await login(name.trim());

 }


 return (

 <View style={styles.container}>


   <Text style={styles.title}>
     Gestão Financeira
   </Text>


   <TextInput
     placeholder="Nome do usuário"
     value={name}
     onChangeText={setName}
     style={styles.input}
   />


   <Button
     title="Entrar"
     onPress={handleLogin}
   />


 </View>

 )

}


const styles=StyleSheet.create({

container:{
 flex:1,
 justifyContent:"center",
 padding:20
},

title:{
 fontSize:24,
 marginBottom:20
},

input:{
 borderWidth:1,
 borderRadius:8,
 padding:12,
 marginBottom:15
}

});