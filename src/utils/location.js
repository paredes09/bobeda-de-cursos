export async function getLocationFast() {
    const saved = localStorage.getItem("userLocation");
  
    if (saved) {
      const parsed = JSON.parse(saved);
      // Mostrar inmediatamente
      setLocationText(parsed);
  
      // Verificar IP en segundo plano
      fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .then(ipData => {
          if (ipData.ip !== parsed.ip) {
            // IP cambió, actualizar ubicación
            fetch("https://ipapi.co/json/")
              .then(res => res.json())
              .then(newLoc => {
                const updated = {
                  country: newLoc.country_name,
                  region: newLoc.region,
                  ip: newLoc.ip
                };
                localStorage.setItem("userLocation", JSON.stringify(updated));
                setLocationText(updated);
              });
          }
        });
    } else {
      // No hay nada guardado, obtener ubicación
      const loc = await fetch("https://ipapi.co/json/").then(res => res.json());
      const data = {
        country: loc.country_name,
        region: loc.region,
        ip: loc.ip
      };
      localStorage.setItem("userLocation", JSON.stringify(data));
      setLocationText(data);
    }
  }
  
  function setLocationText(loc) {
    const el = document.getElementById("location");
    if (el) {
      el.textContent = ` ${loc.country}`;
    }
  }