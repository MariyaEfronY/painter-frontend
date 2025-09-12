// src/components/SearchPainter.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const SearchPainter = ({ colors }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedPainter, setSearchedPainter] = useState(null);
  const [notFound, setNotFound] = useState(false); // ✅ new state
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!phone.trim()) return;

    try {
      setLoading(true);
      setSearchedPainter(null);
      setNotFound(false);

      // ✅ Correct endpoint
      const { data } = await API.get("/painters/search", {
        params: { phoneNumber: phone },
      });

      setSearchedPainter(data);
    } catch (err) {
      console.error("Search failed:", err);

      // ✅ If backend returns 404 → show "not found"
      if (err.response && err.response.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }

      setSearchedPainter(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔍 Search Section */}
      <section
        style={{
          padding: "2.5rem 2rem",
          backgroundColor: colors.cardBg,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter mobile number..."
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              outline: "none",
              color: colors.textDark,
            }}
          />
          <button
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
            onClick={handleSearch}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </section>

      {/* 🎯 Search Result */}
      <section style={{ padding: "4rem 2rem" }}>
        {searchedPainter && (
          <>
            <h2
              style={{
                textAlign: "center",
                fontSize: "1.75rem",
                fontWeight: "bold",
                marginBottom: "2.5rem",
              }}
            >
              Search Result
            </h2>

            <motion.div
              key={searchedPainter._id}
              whileHover={{ scale: 1.05 }}
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: "1rem",
                padding: "1.5rem",
                textAlign: "center",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                maxWidth: "320px",
                margin: "0 auto",
              }}
              onClick={() => navigate(`/painters/${searchedPainter._id}`)}
            >
              <img
                src={searchedPainter.profileImage || "/default-avatar.png"}
                alt={searchedPainter.name}
                style={{
                  width: "6rem",
                  height: "6rem",
                  borderRadius: "50%",
                  margin: "0 auto 1rem",
                  objectFit: "cover",
                }}
              />
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                {searchedPainter.name}
              </h3>
              <p style={{ fontSize: "0.875rem", color: colors.textMuted }}>
                {searchedPainter.city}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  marginTop: "0.5rem",
                  color: colors.textMuted,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {searchedPainter.bio}
              </p>
              <button
                onClick={() => navigate(`/painters/${searchedPainter._id}`)}
                style={{
                  marginTop: "1rem",
                  backgroundColor: colors.secondary,
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>
            </motion.div>
          </>
        )}

        {/* ❌ No painter found */}
        {notFound && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: colors.textMuted }}>
              No painter found with this phone number
            </h3>
          </div>
        )}
      </section>
    </>
  );
};

export default SearchPainter;
