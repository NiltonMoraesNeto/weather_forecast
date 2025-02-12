"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchWeatherForecast } from "@/services/weather-forecast-service";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListWeather } from "@/models/weather";

export default function Login() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<ListWeather | null>(null);
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

  const getWeather = async () => {
    if (!city) return;
    try {
      const response = await searchWeatherForecast(city, API_KEY);
      if (response) {
        setWeather(response.data);
      } else {
        setWeather(null);
        toast.error("Error", {
          description: "Erro ao buscar previsão do tempo",
        });
      }
    } catch {
      toast.error("Error", {
        description: "Erro ao buscar previsão do tempo",
      });
      setWeather(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Previsão do tempo</h1>
        <Input
          type="text"
          placeholder="Digite a cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <Button
          type="button"
          variant="default"
          className="w-full"
          onClick={getWeather}
        >
          Pesquisar
        </Button>
        {weather && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-100 text-center">
            <h3 className="text-xl font-semibold flex justify-center">
              <span className="mr-5 mt-1">{weather.name}</span>
              <Avatar>
                <AvatarImage src={`/svg/${weather.sys.country}.svg`} />
                <AvatarFallback>flag country</AvatarFallback>
              </Avatar>
            </h3>
            <p className="text-lg">
              🌡️ Temperatura: {Math.round(weather.main.temp)}°C
            </p>
            <p className="text-lg">
              ☁️ Clima: {weather.weather[0].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
