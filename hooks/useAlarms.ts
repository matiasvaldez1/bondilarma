import { useEffect, useState } from "react";
import { AlarmType } from "types";
import { dataStorageService } from "services/DataStorageService";

const useAlarms = () => {
  const [alarms, setAlarms] = useState<AlarmType[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAlarms = async () => {
    try {
      setLoading(true);
      const alarmsList = await dataStorageService.getAlarms();

      if (alarmsList) {
        setAlarms(alarmsList);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching alarm data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  return { alarms, refetch: fetchAlarms, loading };
};

export default useAlarms;
