"use client";

export default function Error() {
  const logoPath = "/media/bw_transperrent-02.png";

  return (
    <div className="under-construction under-construction-500 dark">
      {/* Background video / mobile photo (same as main page) */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/media/busybuddy-bg.webm" type="video/webm" />
        </video>
        <div className="video-overlay"></div>
        <div className="video-fallback"></div>
      </div>

      {/* Centered 500 card, same style as 404 */}
      <div className="construction-card">
        <div className="card-header">
          <img src={logoPath} alt="BusyBuddy.Toys" className="logo" />
        </div>
        <div className="card-content">
          <div className="card-panel card-panel-main">
            <h1>Oooooooops… 500 error.</h1>
            <p>
              Something went wrong on our side — would you like to go back to
              the homepage?
            </p>
            <a href="/" className="contact-submit ui-button">
              Home
            </a>
          </div>
        </div>
      </div>

      {/* Footer kept identical to main page */}
      <footer className="site-footer" aria-label="Company information">
        UR Innovate Studio, SIA, 40203588615, Ražots Latvijā 2026
      </footer>
    </div>
  );
}





