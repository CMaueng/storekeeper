import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5,Entypo } from '@expo/vector-icons';
import Home from "../scr/Home";
import Profile from "../scr/Profile";
import Add from "../scr/Add"
import ProductAnalyticsScreen from "../scr/ProductAnalyticsScreen";
import ProductDetails from "../scr/ProductDetails";

const Tab = createBottomTabNavigator();

const Tabs = ()=> {
    return (
        <Tab.Navigator screenOptions =
        {{
            tabBarActiveBackgroundColor:'#DAC0A3',
            tabBarActiveTintColor:'#F8F0E5',
            tabBarInactiveBackgroundColor:'#DAC0A3',
            tabBarInactiveTintColor:'#F8F0E5'
            
        }}>
            <Tab.Screen name ="Home" component={Home} 
             options =
              {{ 
                  headerTitle:"Products",tabBarIcon:({color,size}) =>
                  (<FontAwesome5 name="home" size={size} color={color} />),
                  headerTitleAlign:'center',
                  headerTintColor:'#F8F0E5',
                  headerStyle: {backgroundColor: '#DAC0A3'}
              }}/>
            <Tab.Screen name ="Add" component={Add} 
             options =
              {{ 
                  headerTitle:"AddData",tabBarIcon:({color,size}) =>
                  (<FontAwesome5 name="list-ul" size={size} color={color} />),
                  headerTitleAlign:'center',
                  headerTintColor:'#F8F0E5',
                  headerStyle: {backgroundColor: '#DAC0A3'}
              }}/>
            <Tab.Screen name ="History" component={ProductAnalyticsScreen}
             options =
              {{ 
                  headerTitle:"ProductAnalytics", tabBarIcon:({color,size}) =>
                  (<FontAwesome5 name="history" size={size} color={color}/>),
                  headerTitleAlign:'center',
                  headerTintColor:'#F8F0E5',
                  headerStyle: {backgroundColor: '#DAC0A3'}
              }}/>
            <Tab.Screen name ="Calculate" component={ProductDetails}
             options = 
             {{ 
                headerTitle:"Calculate", tabBarIcon:({color,size}) =>
                (<FontAwesome5 name="calculator" size={size} color={color} />),
                headerTitleAlign:'center',
                headerTintColor:'#F8F0E5',
                headerStyle: {backgroundColor: '#DAC0A3'}
             }}/>
             <Tab.Screen name ="Profile" component={Profile}  
             options =
              {{ 
                  headerTitle:"Profile",tabBarIcon:({color,size}) =>
                  (<FontAwesome5 name="user" size={size} color={color} />),
                  headerTitleAlign:'center',
                  headerTintColor:'#F8F0E5',
                  headerStyle: {backgroundColor: '#DAC0A3'}
              }}/>
        </Tab.Navigator>
    );
}
export default Tabs;
