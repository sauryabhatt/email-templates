/** @format */
import React, { useState, useEffect } from "react";
import Icon from "@ant-design/icons";
import LogoWithText from "../../public/filestore/logo_with_text.js";
import SoundIcon from "../../public/filestore/soundIcon";
import FAQAccordion from "./FAQAccordion";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const FAQ = () => {
  let url = process.env.NEXT_PUBLIC_URL + "/qalara-sound.mp3";
  const [playing, toggle] = useAudio(url);

  return (
    <div id="faq">
      <div id="faq-banner" style={{ marginTop: "-70px" }}>
        <div className="banner-text">
          FAQ for Buyers
          <p className="banner-text-small">
            Frequently Asked Questions for Qalara Buyers
          </p>
          <div>
            <Icon
              component={LogoWithText}
              style={{
                height: "100%",
                width: "135px",
                verticalAlign: "middle",
              }}
            ></Icon>
            <span className="qa-cursor qa-mar-lft" onClick={toggle}>
              <Icon
                component={SoundIcon}
                style={{
                  height: "25px",
                  width: "25px",
                  verticalAlign: "middle",
                }}
              ></Icon>
            </span>
            <div className="qalara-pronounciation-text">
              (pronounced kuh-laa-raa)
            </div>
          </div>
        </div>
      </div>
      <FAQAccordion />
    </div>
  );
};

export default FAQ;
