import React, { useState, useEffect } from "react";

const Footer = () => {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 700);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 700);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);
  return (
    <div>
      {isDesktop ? (
        <footer className="footer-container">
          <div className="footer-left">
            <a
              className="author"
              href="https://www.linkedin.com/in/lucas-mcgill/"
            >
              <img src="/Lucas.png" width="90px" />
              <p>Lucas McGill </p>
            </a>
            <a className="author" href="https://www.linkedin.com/in/sam-dokus/">
              <img src="/Sam.png" width="90px" />
              <p>Sam Dokus</p>
            </a>
            <a
              className="author"
              href="https://www.linkedin.com/in/dipti-yadav/"
            >
              <img src="/Dipti.png" width="90px" />
              <p>Dipti Yadav</p>
            </a>

            <a className="author" href="https://www.linkedin.com/in/abbasio/">
              <img src="/Omar.png" width="90px" />
              <p>Omar Abbasi</p>
            </a>
          </div>
          <div className="footer-right">
            <a href="https://github.com/Cross-Wars/Cross-Wars-v2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                fill="currentColor"
                className="bi bi-github"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </footer>
      ) : (
        <footer className="footer-container">
          <div className="footer-left">
            <a
              className="author"
              href="https://www.linkedin.com/in/lucas-mcgill/"
            >
              <p>Lucas McGill</p>
            </a>
            <a className="author" href="https://www.linkedin.com/in/sam-dokus/">
              <p>Sam Dokus</p>
            </a>
            <a
              className="author"
              href="https://www.linkedin.com/in/dipti-yadav/"
            >
              <p>Dipti Yadav</p>
            </a>

            <a className="author" href="https://www.linkedin.com/in/abbasio/">
              <p>Omar Abbasi</p>
            </a>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Footer;
