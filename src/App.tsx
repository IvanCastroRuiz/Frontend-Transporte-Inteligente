import { useState, MouseEvent } from 'react';
import axios from 'axios';

interface RouteResult {
  origin: string;
  optimized: string[];
}

export default function App() {
  const [origin, setOrigin] = useState('');
  const [destinations, setDestinations] = useState('');
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!origin.trim()) {
      setError('Por favor ingrese un origen');
      setLoading(false);
      return;
    }

    if (!destinations.trim()) {
      setError('Por favor ingrese al menos un destino');
      setLoading(false);
      return;
    }

    const destinationsList = destinations.split(',').map(d => d.trim());
    if (destinationsList.includes(origin)) {
      setError('El origen no puede ser uno de los destinos');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/routes/optimize', {
        params: { 
          origin: origin.trim(),
          destinations: destinationsList.join(',')
        },
      });
      setResult(res.data);
    } catch {
      setError('Error al optimizar la ruta. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Transporte Inteligente</h1>
              <p className="text-blue-200 text-sm mt-1">Optimización de rutas con IA</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-700 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="bg-blue-700 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Optimización de Rutas</h2>
            <p className="text-gray-600 mb-6">Ingresa el origen y los destinos para encontrar la ruta más eficiente</p>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                  Origen
                </label>
                <input
                  id="origin"
                  type="text"
                  placeholder="Ej: Bogotá"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="destinations" className="block text-sm font-medium text-gray-700 mb-1">
                  Destinos
                </label>
                <input
                  id="destinations"
                  type="text"
                  placeholder="Ej: Medellín, Cali, Barranquilla"
                  value={destinations}
                  onChange={(e) => setDestinations(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="mt-1 text-sm text-gray-500">Separa los destinos con comas</p>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Optimizando...
                  </div>
                ) : (
                  'Optimizar Ruta'
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ruta Optimizada</h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <ol className="list-decimal ml-6 space-y-2">
                  <li className="font-medium text-blue-800">{result.origin} (Origen)</li>
                  {result.optimized.map((r: string, i: number) => (
                    <li key={i} className="text-blue-600">{r}</li>
                  ))}
                </ol>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-md">
                <iframe
                  title="map"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(
                    result.origin
                  )}&destination=${encodeURIComponent(
                    result.optimized[result.optimized.length - 1]
                  )}&waypoints=${encodeURIComponent(result.optimized.slice(0, -1).join('|'))}`}
                  allowFullScreen
                  className="w-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Transporte Inteligente</h3>
              <p className="text-gray-400 text-sm">
                Solución de optimización de rutas utilizando inteligencia artificial para mejorar la eficiencia del transporte en ciudades con tráfico caótico.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tecnologías</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Algoritmos de optimización
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Análisis de datos geográficos
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Predicción de tráfico
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">APIs de Google</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Distance Matrix API
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Maps JavaScript API
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Directions API
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="text-gray-400 text-sm">
                ¿Tienes preguntas sobre nuestra solución de optimización de rutas?
              </p>
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                Contáctanos
              </button>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>© 2023 Transporte Inteligente. Todos los derechos reservados.</p>
            <p>INGENIERO IVAN JESUS CASTRO RUIZ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}