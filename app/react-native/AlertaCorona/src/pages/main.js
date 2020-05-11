import React from 'react';
import tracker from '../services/api';
import { StyleSheet, View, Text, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import MapView,  { PROVIDER_GOOGLE } from 'react-native-maps';
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const Images = [
  { uri: "https://i.imgur.com/sNam9iJ.jpg" },
  { uri: "https://i.imgur.com/N7rlQYt.jpg" },
  { uri: "https://i.imgur.com/UDrH0wm.jpg" },
  { uri: "https://i.imgur.com/Ka8kNST.jpg" }
]
class Main extends React.Component {
    state = {
      markers: [],
      region: {
        latitude: -13.9854854,
        longitude: -63.6473031,
        latitudeDelta: 0.10043,
        longitudeDelta: 60.0034
      }   
    };

    UNSAFE_componentWillMount() {
      this.index = 0;
      this.animation = new Animated.Value(0);
    }
    
    componentDidMount() {
      // We should detect when scrolling has stopped then animate
      // We should just debounce the event listener here
      this.animation.addListener(({ value }) => {
        this._value = value;
        let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
        if (index >= this.state.markers.length) {
          index = this.state.markers.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
        
        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            const { coordinates } = this.state.markers[index];
            this.map.animateToRegion(
              {
                ...coordinates,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
              },
              350
            );
          }
          clearTimeout(this.regionTimeout);
        }, 10);
      });
      this.loadCases();
    }    

    loadCases = async () => {
        const response = await tracker.get(`/cities/S%C3%A3o%20Paulo`).then((result) =>{
          return result.data;
        });
        
        const data = response.data.map((city) => {
          const {confirmed, dead, latitude, longitude, location, updated } = city;

          return {
            title: `${location} - Última atualização: ${updated}`,
            description: `Já há ${confirmed} casos confirmados e ${dead} mortos.`,
            coordinates: {
              latitude: latitude,
              longitude: longitude
            },
          };
        });
        
        this.setState( {
          markers: data
        });
    }

    

    render() {
      const interpolations = this.state.markers.map((marker, index) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          ((index + 1) * CARD_WIDTH),
        ];
        const scale = this.animation.interpolate({
          inputRange,
          outputRange: [1, 2.5, 1],
          extrapolate: "clamp",
        });
        const opacity = this.animation.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35],
          extrapolate: "clamp",
        });
        return { scale, opacity };
      });
        return (
          <View style={styles.container}>
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                ref={map => this.map = map}
                initialRegion={this.state.region}
              >
                {this.state.markers.map((marker, index) =>{
                  const scaleStyle = {
                    transform: [
                      {
                        scale: interpolations[index].scale,
                      },
                    ],
                  };
                  const opacityStyle = {
                    opacity: interpolations[index].opacity,
                  };
                  return (
                  <MapView.Marker 
                    key={index}
                    showsUserLocation
                    loadingEnabled
                    coordinate={marker.coordinates}
                    title={marker.title}
                    description={marker.description}
                  >
                    <Animated.View style={[styles.markerWrap, opacityStyle]}>
                      <Animated.View style={[styles.ring, scaleStyle]} />
                      <View style={styles.marker} />
                    </Animated.View>
                  </MapView.Marker>
                );
                })}
              </MapView>
              <Animated.ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: this.animation,
                        },
                      },
                    },
                  ],
                  { useNativeDriver: true }
                )}
                style={styles.scrollView}
                contentContainerStyle={styles.endPadding}
              >
                {this.state.markers.map((marker, index) => (
                  <View  style={styles.card} key={index}>
                    <Image
                      source={marker.image}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.textContent}>
                      <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                      <Text numberOfLines={1} style={styles.cardDescription}>
                        {marker.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </Animated.ScrollView>
              </View>
        )
    }

    getRegionForCoordinates(points) {
      // points should be an array of { latitude: X, longitude: Y }
      let minX, maxX, minY, maxY;
    
      // init first point
      ((point) => {
        minX = point.latitude;
        maxX = point.latitude;
        minY = point.longitude;
        maxY = point.longitude;
      })(points[0]);
    
      // calculate rect
      points.map((point) => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
      });
    
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      const deltaX = (maxX - minX);
      const deltaY = (maxY - minY);
    
      return {
        latitude: midX,
        longitude: midY,
        latitudeDelta: deltaX,
        longitudeDelta: deltaY
      };
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
    },
    scrollView: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      paddingVertical: 10,
    },
    endPadding: {
      paddingRight: width - CARD_WIDTH,
    },
    card: {
      padding: 10,
      elevation: 2,
      backgroundColor: "#FFF",
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      overflow: "hidden",
    },
    cardImage: {
      flex: 3,
      width: "100%",
      height: "100%",
      alignSelf: "center",
    },
    textContent: {
      flex: 1,
    },
    cardtitle: {
      fontSize: 12,
      marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",    
      borderWidth: 2,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(130,4,150, 0.3)",
      position: "absolute",
      borderWidth: 1,
      borderColor: "rgba(130,4,150, 0.5)",  
    },
    marker: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {

    },
  })



  export default Main;