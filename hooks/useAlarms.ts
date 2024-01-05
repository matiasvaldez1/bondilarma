import { useEffect, useState } from "react";
import { AlarmType } from "types";
import { dataStorageService } from "services/DataStorageService";
import { useIsFocused } from "@react-navigation/native";

const useAlarms = () => {
  const [alarm, setAlarm] = useState<AlarmType | null>(null);
  const [loading, setLoading] = useState(false);
  const focused = useIsFocused();

  const fetchAlarm = async () => {
    setAlarm(null);
    try {
      setLoading(true);
      const alarm = await dataStorageService.getAlarm();

      if (alarm) {
        setAlarm(alarm);
        setLoading(false);
        return;
      }
      setAlarm(null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching alarm data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (focused) {
      fetchAlarm();
    }
  }, [focused]);

  return { alarm, refetch: fetchAlarm, loading };
};

export default useAlarms;
