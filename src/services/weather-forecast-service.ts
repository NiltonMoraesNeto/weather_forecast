import api from "./api";

export const searchWeatherForecast = async (city: string, API_KEY: string) => {
  try {
    const response = await api.get(`weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt`);
    return response
  } catch {
    return false;
  }
};

export const searchWeatherForecastNexDays = async (city: string, API_KEY: string) => {
  try {
    const response = await api.get(`forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pt`);
    return response
  } catch {
    return false;
  }
};
