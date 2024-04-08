import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState,useEffect} from "react";
import {firebase} from "../config";


import Login from "./Login";
import Register from "./Register";
import Routes from "../navigation/route/Routes";

const Stack = createStackNavigator();

function Auth(){
  const [initializing, setInitializing] = useState(true);
  const [user,setUser] = useState();

  //Handle user
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);

  }
  useEffect(()=> {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  },[]);
  if (initializing) return null;

  if (!user){
    return (
      <Stack.Navigator>
        <Stack.Screen
        name="Login"
        component={Login}
        margin = 'center'
        options={{ headerShown: false 
        }}
        />
        <Stack.Screen
        name="Register"
        component={Register}
        options={{
          title: 'back to login',
          headerStyle: {
            backgroundColor: '#EADBC8',
          },
          headerTintColor: '#F8F0E5',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Routes/>
  )
}

export default Auth