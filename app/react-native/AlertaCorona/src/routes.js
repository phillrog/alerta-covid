import * as React from 'react';
import {NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './pages/main';
import { StyleSheet, View, Text } from 'react-native';

const Stack = createStackNavigator();

function Routes () {
    return (
        <NavigationContainer options={{backgroundColor: 'red'}}>
            <Stack.Navigator initialRouteName='Main'
            screenOptions={{
                gestureEnabled: true,
                title: "Alerta Corona",
                headerTitleAlign: "center", 
            }}>
                <Stack.Screen 
                    name='Main' 
                    component={Main} 
                    options={{
                        headerStyle: ({ backgroundColor: "#DA552F"}),
                        headerTintColor: "#FFF",
                        headerTitle: () => (
                        <View style={styles.container}>
                            
                            <Text style={styles.headerTitle}>Mapa</Text>
                            
                        </View>
                        )            
                    }}
                    />
            </Stack.Navigator>
        </NavigationContainer>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      color: "#FFF",
      letterSpacing: 1,
    },
    icon: {
      marginLeft: 10
    }
  });

  export default Routes;