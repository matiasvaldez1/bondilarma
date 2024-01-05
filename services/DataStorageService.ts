import AsyncStorage from "@react-native-async-storage/async-storage";
import { ALARMS_KEY } from "constants/Keys";
import { AlarmType } from "types";

class DataStorageService {
  private async load<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      console.error("Error loading data:", error);
      return null;
    }
  }

  private async save(key: string, inputData: any) {
    try {
      const stringifiedData = JSON.stringify(inputData);
      await AsyncStorage.setItem(key, stringifiedData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  private async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }

  public async saveAlarm(alarm: AlarmType): Promise<void> {
    try {
      const existingAlarm = await this.load<any>(ALARMS_KEY);

      if (existingAlarm) {
        console.error("Ya hay una alarma creada");
        return;
      }

      await this.save(ALARMS_KEY, alarm);
    } catch (error) {
      console.error("Error saving alarm data:", error);
    }
  }

  async getAlarm() {
    try {
      const alarm = await this.load<AlarmType>(ALARMS_KEY);
      if (alarm) {
        return alarm;
      }
    } catch (error) {
      console.error("Error getting alarm data:", error);
    }
  }

  async deleteAlarm(): Promise<void> {
    try {
      await this.clear();
    } catch (error) {
      console.error("Error deleting alarm data:", error);
    }
  }
}

export const dataStorageService = new DataStorageService();
