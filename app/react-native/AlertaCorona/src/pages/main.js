import React from 'react';
import { api } from '../services/api';
import { StyleSheet, View, Text, AppRegistry } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

class Main extends React.Component {
    componentDidMount() {
       // this.loadCases();
    }

    loadCases = async () => {
        const response = await api.tracker.get(`/cities/São Paulo`).then((result) =>{
            return result.data;
        }).then((error) => console.log(error));

        const {confirmed, dead, latitude, longitude, location, updated } = response.data;


    }

    render() {
    
        return (
          <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                initialRegion={{
                  latitude: -23.5505199,
                  longitude: -46.63330939999999,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
              </MapView>
              </View>
        )
    }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
    text: {
      color: '#101010',
      fontSize: 24,
      fontWeight: 'bold'
    },
    buttonContainer: {
      backgroundColor: '#222',
      borderRadius: 5,
      padding: 10,
      margin: 20
    },
    buttonText: {
      fontSize: 20,
      color: '#fff'
    },
    list: {
      padding: 20
    },
    productContainer: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#DDD",
      padding: 20,
      marginBottom: 20
    },
  
    productTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333"
    },
  
    productDescription: {
      fontSize: 16,
      margin:5,
      color: "#999",
      lineHeight: 24
    },
    productButton: {
      height: 42,
      borderWidth: 2,
      borderRadius: 5,
      borderColor: "#DA552F",
      backgroundColor: "transparent",
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10
    },
  
    productButtonText: {
      fontSize: 16,
      color: "#DA552F",
      fontWeight: "bold"
    }
  })

  export default Main;