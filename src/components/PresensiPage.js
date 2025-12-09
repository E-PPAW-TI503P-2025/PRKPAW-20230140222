import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ----- Kamera -----
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, []);

  // ----- Ambil lokasi -----
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
        setLoadingLocation(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // ----- Check In (Lokasi + Foto) -----
  const handleCheckIn = async () => {
    if (!coords || !image) {
      setError("Lokasi dan foto wajib ada!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
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

  // ----- Check Out -----
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Gagal melakukan check-out"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">Lakukan Presensi</h2>

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* ----- MAP ----- */}
        {coords && (
          <div className="my-4 border rounded-lg overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "250px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* ----- KAMERA ----- */}
        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>

        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="bg-blue-600 text-white py-2 rounded w-full"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="bg-gray-600 text-white py-2 rounded w-full"
            >
              Foto Ulang 🔄
            </button>
          )}
        </div>

        {/* ----- TOMBOL PRESENSI ----- */}
        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
