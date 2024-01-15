import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { defaultStyles } from "constants/Styles";
import SelectDropdown from "react-native-select-dropdown";
import { dataStorageService } from "services/DataStorageService";
import { AlarmType, AlarmTypeKeys, LocationType } from "types";
import { checkAndRequestLocationPermission } from "services/LocationTrackingService";
import { useIsFocused } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { reloadAsync } from "expo-updates";

export default function MapScreen() {
  const { width, height } = Dimensions.get("window");
  const [alarmData, setAlarmData] = useState<AlarmType | null>();
  const [modalVisible, setModalVisible] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);
  const [pinLocation, setPinLocation] = useState<LocationType | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const focused = useIsFocused();
  const mapRef = useRef<MapView | null>(null);

  const handleMapPress = (e: any) => {
    setPinLocation(e.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleCancelAlarm = () => {
    setModalVisible(!modalVisible);
    setAlarmData(null);
  };
  const handleCreateAlarm = async () => {
    if (!alarmData || !location || !pinLocation) return;
    await dataStorageService.saveAlarm({
      ...alarmData,
      createdAt: Date(),
      isActive: true,
      destinationPlace: pinLocation,
    });
    Alert.alert("Alarma creada");

    setAlarmData(null);

    setTimeout(() => setModalVisible(!modalVisible), 1000);
  };

  const handleChangeAlarmData = (name: AlarmTypeKeys, value: string) => {
    setAlarmData((prev) =>
      prev
        ? { ...prev, [name]: value }
        : ({ [name]: value } as unknown as AlarmType)
    );
  };

  const handlePickAlarmAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
      });
      if (!result.canceled) {
        setAlarmData((prev) => ({ ...prev, audio: result.assets } as any));
        Alert.alert("Audio elegido correctamente.");
      }
    } catch (err) {
      console.error("Couldn't pick audio", err);
    }
  };

  useEffect(() => {
    checkAndRequestLocationPermission();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    })();
    return () => {
      setAlarmData(null);
    };
  }, [focused]);

  useEffect(() => {
    if (appLoaded && mapRef.current && !mapRef.current?.state.isReady) {
      reloadAsync();
    }
  }, [mapRef.current, appLoaded]);

  useEffect(() => {
    setAppLoaded(true);
  }, []);

  const generateTimeOptions = () => {
    const options = [];
    for (let squares = 0; squares <= 20; squares++) {
      options.push(squares);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  if (!location) return <Text>Cargando..</Text>;

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.label}>Crear alarma</Text>
            <View>
              <Text style={styles.label}>Nombre de la alarma</Text>
              <TextInput
                onChangeText={(text: string) =>
                  handleChangeAlarmData("name", text)
                }
                style={defaultStyles.inputField}
              />
            </View>
            <View>
              <Text style={styles.label}>
                Elegir distancia (a cuantas cuadras sonará la alarma)
              </Text>
              <SelectDropdown
                data={timeOptions}
                defaultButtonText="Elegir distancia"
                onSelect={(selectedItem) => {
                  handleChangeAlarmData("totalDistance", selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item) => {
                  return item;
                }}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownButtonText}
                dropdownStyle={styles.dropdownContainer}
              />
              {alarmData?.totalDistance && (
                <Text style={{ color: "red" }}>
                  La alarma sonara a {alarmData.totalDistance} cuadras
                </Text>
              )}
            </View>
            <View>
              <Pressable onPress={handlePickAlarmAudio}>
                <Text style={{ color: "blue" }}>
                  Elegí un audio para la alarma
                </Text>
                {alarmData?.audio && (
                  <Text style={{ color: "green" }}>
                    {alarmData?.audio[0].name}
                  </Text>
                )}
              </Pressable>
            </View>
            <View style={{ gap: 10 }}>
              <Pressable style={defaultStyles.btn} onPress={handleCreateAlarm}>
                <Text style={defaultStyles.btnText}>Crear alarma</Text>
              </Pressable>
              <Pressable
                style={defaultStyles.btnCancel}
                onPress={handleCancelAlarm}
              >
                <Text style={defaultStyles.btnText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        zoomControlEnabled={true}
        zoomTapEnabled={true}
        rotateEnabled={false}
        showsUserLocation={true}
        userLocationUpdateInterval={5000}
        showsMyLocationButton={true}
        loadingEnabled={true}
        showsCompass={true}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        loadingIndicatorColor="white"
        onPress={handleMapPress}
        style={{ flex: 1, width: width * 1, height: height * 0.6 }}
      >
        {pinLocation && <Marker coordinate={pinLocation} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  map: {
    width: 300,
    height: 300,
  },
  modal: {
    position: "absolute",
    top: "25%",
    left: "4%",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    padding: 20,
  },
  modalContainer: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    gap: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
