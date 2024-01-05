import { Audio } from "expo-av";

export const playAlarm = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require("assets/test-audio.mp3")
  );
  await sound.playAsync();
};
