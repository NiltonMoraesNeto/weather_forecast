import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Weather from './page';
import { searchWeatherForecast } from '@/services/weather-forecast-service';
import { toast } from 'sonner';

// Mock do serviço de previsão do tempo
jest.mock('@/services/weather-forecast-service');
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Weather', () => {
  it('deve renderizar o componente corretamente', () => {
    render(<Weather />);

    // Verifique se o título aparece
    expect(screen.getByText(/Previsão do tempo/i)).toBeInTheDocument();
    // Verifique se o input está presente
    expect(screen.getByPlaceholderText(/Digite a cidade/i)).toBeInTheDocument();
    // Verifique se o botão está presente
    expect(screen.getByText(/Pesquisar/i)).toBeInTheDocument();
  });

  it('deve chamar a função de previsão do tempo quando o botão for clicado', async () => {
    render(<Weather />);

    const cityInput = screen.getByPlaceholderText(/Digite a cidade/i);
    const button = screen.getByText(/Pesquisar/i);

    // Simulando a digitação no campo de input
    fireEvent.change(cityInput, { target: { value: 'São Paulo' } });

    // Simulando o clique no botão
    fireEvent.click(button);

    // Espera que a função 'searchWeatherForecast' tenha sido chamada com o parâmetro correto
    expect(searchWeatherForecast).toHaveBeenCalledWith('São Paulo', expect.any(String));
  });

  it('deve exibir as informações do clima quando a previsão for recebida', async () => {
    // Mock da resposta da API
    searchWeatherForecast.mockResolvedValueOnce({
      data: {
        name: 'São Paulo',
        sys: { country: 'BR' },
        main: { temp: 25 },
        weather: [{ description: 'Ensolarado' }],
      },
    });

    render(<Weather />);

    const cityInput = screen.getByPlaceholderText(/Digite a cidade/i);
    const button = screen.getByText(/Pesquisar/i);

    // Simulando a digitação no campo de input
    fireEvent.change(cityInput, { target: { value: 'São Paulo' } });

    // Simulando o clique no botão
    fireEvent.click(button);

    // Espera que as informações do clima apareçam na tela
    await waitFor(() => {
      expect(screen.getByText('São Paulo')).toBeInTheDocument();
      expect(screen.getByText('🌡️ Temperatura: 25°C')).toBeInTheDocument();
      expect(screen.getByText('☁️ Clima: Ensolarado')).toBeInTheDocument();
    });
  });

  it('deve exibir uma mensagem de erro se a API falhar', async () => {
  // Mock da resposta da API para simular falha
  searchWeatherForecast.mockRejectedValueOnce(new Error('Erro na API'));

  render(<Weather />);

  const cityInput = screen.getByPlaceholderText(/Digite a cidade/i);
  const button = screen.getByText(/Pesquisar/i);

  // Simulando a digitação no campo de input
  fireEvent.change(cityInput, { target: { value: 'São Paulo' } });

  // Simulando o clique no botão
  fireEvent.click(button);

  // Espera para garantir que o erro seja tratado
  await waitFor(() => {
    // Verifica se o toast.error foi chamado corretamente
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith("Error", {
      description: "Erro ao buscar previsão do tempo",
    });
  });

  // Limpar mocks após o teste
  jest.clearAllMocks();
});

    
});
