import { NavigationContainer } from "@react-navigation/native";
import Auth from "./scr/Auth";
import { ScannedProductsProvider } from "./components/Context/ScannedProductsContext";


function App(){
  return (
    <NavigationContainer > 
      <ScannedProductsProvider>
      <Auth />
      </ScannedProductsProvider>
    </NavigationContainer>
  )
}

export default App
 