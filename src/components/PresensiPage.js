import React, { useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);   // ← lokasi
  const [loadingLocation, setLoadingLocation] = useState(true);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };
  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // Modifikasi handleCheckIn untuk mengirim lokasi
  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Gagal melakukan check-in"
      );
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Gagal melakukan check-out"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      {coords && (
  <div className="my-4 border rounded-lg overflow-hidden">
    <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>Lokasi Presensi Anda</Popup>
      </Marker>
    </MapContainer>
  </div>
)}

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
