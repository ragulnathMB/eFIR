import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addTranslateScript = () => {
      if (!window.googleTranslateElementInit) {
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en", // Default language is English
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              includedLanguages: "bn,gu,pa,mr,kn,or,as,ur,ne,si,hi,ta,te,ml", // Only Indian languages
            },
            "google_translate_element"
          );
        };

        const script = document.createElement("script");
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    addTranslateScript();
  }, []);

  return (
    <div id="google_translate_element" style={{ color:'white' }}>
      <style>
        {`
          /* Hide the Google Translate icon */
          .goog-te-gadget-icon {
            display: none !important;
          }

          /* Style the entire Google Translate widget */
          div#google_translate_element div.goog-te-gadget-simple {
            font-size: 15px;
            background-color: transparent !important; /* Set background to black */
            border: 2px solid white; /* Remove border */
            color:'white' !important;
            border-radius:30px;
          }

          
          /* Style the span inside the dropdown */
          #google_translate_element span {
            color: white !important; /* Text color */
          }
            
            

        `}
      </style>
    </div>
  );
};

export default GoogleTranslate;
