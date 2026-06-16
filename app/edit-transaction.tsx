import {
 View,
 TextInput,
 Button
} from "react-native";

import {
 useLocalSearchParams,
 router
} from "expo-router";

import {
 useState
} from "react";

import api from "../services/api";



export default function EditTransaction(){


const params =
useLocalSearchParams();



const [description,setDescription]=
useState(String(params.description));


const [amount,setAmount]=
useState(String(params.amount));


const [category,setCategory]=
useState(String(params.category));




async function save(){


await api.put(
 `/transactions/${params.id}`,
 {
  description,
  amount:Number(amount),
  category
 }
);


router.back();

}



return (

<View
style={{
padding:20
}}
>


<TextInput

value={description}

onChangeText={setDescription}

/>



<TextInput

value={amount}

keyboardType="numeric"

onChangeText={setAmount}

/>



<TextInput

value={category}

onChangeText={setCategory}

/>


<Button
title="Salvar"
onPress={save}
/>



</View>

)

}