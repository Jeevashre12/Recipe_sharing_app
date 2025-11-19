import React, { useEffect } from "react";
import Header from "../components/Header";
import { assets } from "../assets/assets";
import "./Home.css";

const Home = () => {
  useEffect(() => {
    // prevent duplicate injection
    if (document.getElementById("bp-webchat-core")) return;

    const s1 = document.createElement("script");
    s1.id = "bp-webchat-core";
    s1.src = "https://cdn.botpress.cloud/webchat/v3.4/inject.js";
    s1.async = true;
    document.body.appendChild(s1);

    // optional: set any global config required by your bot before loading the bot instance script
    // e.g. window.botpressWebChat = window.botpressWebChat || {}; window.botpressWebChat.init = { /* config */ };

    const s2 = document.createElement("script");
    s2.id = "bp-bot-config";
    s2.src =
      "https://files.bpcontent.cloud/2025/11/18/15/20251118154932-2PBUD865.js";
    s2.defer = true;
    document.body.appendChild(s2);

    // keep scripts persistent (no cleanup) so the chat remains available across navigation
  }, []);

  return (
    <div className="home" style={{ backgroundImage: `url(${assets.bg})` }}>
      <Header />
    </div>
  );
};

export default Home;
