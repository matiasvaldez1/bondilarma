import React, { useState, useEffect } from "react";
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
import MapView, { Marker } from "react-native-maps";
import { defaultStyles } from "constants/Styles";
import SelectDropdown from "react-native-select-dropdown";
import { dataStorageService } from "services/DataStorageService";
import { AlarmType, AlarmTypeKeys, LocationType } from "types";
import { checkAndRequestLocationPermission } from "services/LocationTrackingService";

export default function MapScreen() {
  const { width, height } = Dimensions.get("window");
  const [alarmData, setAlarmData] = useState<AlarmType | null>();
  const [modalVisible, setModalVisible] = useState(false);
  const [pinLocation, setPinLocation] = useState(null);
  const [location, setLocation] = useState<LocationType | null>(null);

  const handleMapPress = (e: any) => {
    setPinLocation(e.nativeEvent.coordinate);
    setModalVisible(true);
  };

  const handleCancelAlarm = () => {
    setModalVisible(!modalVisible);
    setAlarmData(null);
  };

  const handleCreateAlarm = async () => {
    if (!alarmData || !location) return;
    await dataStorageService.saveAlarm({
      ...alarmData,
      createdAt: Date(),
      isActive: true,
      destinationPlace: location,
    });
    Alert.alert("Alarma creada");
    setTimeout(() => setModalVisible(!modalVisible), 2000);
  };

  const handleChangeAlarmData = (name: AlarmTypeKeys, value: string) => {
    setAlarmData((prev) =>
      prev
        ? { ...prev, [name]: value }
        : ({ [name]: value } as unknown as AlarmType)
    );
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
                onChangeText={(text: string) => handleChangeAlarmData("name", text)}
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
                  handleChangeAlarmData("totalMinutes", selectedItem);
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
        zoomEnabled
        zoomControlEnabled
        showsUserLocation
        onPress={handleMapPress}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
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
