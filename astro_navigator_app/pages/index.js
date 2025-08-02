
import { useState, useEffect } from 'react';
import CitySelector from '../components/CitySelector';
import InfoCard from '../components/InfoCard';
import P5Background from '../components/P5Background';
import { cities } from '../lib/cities';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [astroData, setAstroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/astro-data?lat=${selectedCity.latitude}&lon=${selectedCity.longitude}&date=${date}`);
      const data = await res.json();
      setAstroData(data);
      setLoading(false);
    };
    fetchData();
  }, [selectedCity, date]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <P5Background />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 sm:mb-0">Astro Navigator</h1>
          <div className="w-full sm:w-72">
            <CitySelector selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InfoCard title="Mapa">
              <div className="w-full h-96 bg-white/80 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">[Visualização do Mapa em Breve]</p>
              </div>
            </InfoCard>
          </div>

          <InfoCard title="Dados Astronômicos">
            {loading ? (
              <p>Calculando...</p>
            ) : astroData ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="p-2">Astro</th>
                      <th className="p-2">Nascer</th>
                      <th className="p-2">Ocaso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {astroData.map((body) => (
                      <tr key={body.name} className="border-b border-gray-200">
                        <td className="p-2 font-semibold">{body.name}</td>
                        <td className="p-2">{body.rise ? new Date(body.rise).toLocaleTimeString() : 'N/A'}</td>
                        <td className="p-2">{body.set ? new Date(body.set).toLocaleTimeString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Sem dados para exibir.</p>
            )}
          </InfoCard>

          <InfoCard title="Fases da Lua">
            <div className="w-full h-48 bg-white/80 rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">[Visualização da Lua em Breve]</p>
            </div>
          </InfoCard>

          <InfoCard title="Posição do Sol">
            <div className="w-full h-48 bg-white/80 rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">[Visualização do Sol em Breve]</p>
            </div>
          </InfoCard>
        </div>
      </main>
    </div>
  );
}
