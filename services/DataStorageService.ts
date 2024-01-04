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
      return null
    } catch (error) {
      console.error("Error loading data:", error);
      return null
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

  public async saveAlarm(alarm: AlarmType): Promise<void> {
    try {
      const existingAlarms = await this.load<any>(ALARMS_KEY);
  
      let alarms: AlarmType[] = existingAlarms || [];
  
      alarms.push(alarm);
  
      await this.save(ALARMS_KEY, alarms);
    } catch (error) {
      console.error("Error saving alarm data:", error);
    }
  }
  
  async getAlarms() {
    try {
      const alarmsList = await this.load<AlarmType[]>(ALARMS_KEY);
      if (alarmsList) {
        return alarmsList;
      }
    } catch (error) {
      console.error("Error getting alarm data:", error);
    }
  }

  async deleteAlarmByName(name: string): Promise<void> {
    try {
      const existingAlarms = await this.load<AlarmType[]>(ALARMS_KEY);

      if (existingAlarms) {
        const updatedAlarms = existingAlarms.filter((alarm) => alarm.name !== name);
        await this.save(ALARMS_KEY, updatedAlarms);
      }
    } catch (error) {
      console.error('Error deleting alarm data:', error);
    }
  }
}

export const dataStorageService = new DataStorageService();
