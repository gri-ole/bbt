// BusyBuddy.Toys - Under Construction Landing Page
// -------------------------------------------------
// This React component renders:
// - Configurable blurred video background (local .webm or YouTube)
// - Centered glassmorphism card with brand name and subtitle
// - Date-based animated construction progress bar with percentage
// - Optional soft floating pastel particles for subtle motion
// - Day/Night theme toggle for the whole page

const { useEffect, useState } = React;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Toggle which background source to use:
//   "local"   -> uses a local .webm video file from the project
//   "youtube" -> uses a YouTube video embed
//
// You can change this to "youtube" if you prefer a YouTube background.
const backgroundMode = "local";

// Local video path (you will place your .webm file here later).
// For example: /media/busybuddy-bg.webm served from your static host.
const LOCAL_VIDEO_SRC = "/media/busybuddy-bg.webm";

// BusyBuddy logo path (place your logo file there, e.g. PNG from the design).
const LOGO_SRC = "/media/busybuddy-logo.png";

// Etsy logo path (place Etsy logo file there, e.g. PNG).
const ETSY_LOGO_SRC = "/media/etsy-logo.png";

// Instagram logo path (e.g. WEBP or PNG).
const INSTAGRAM_LOGO_SRC =
  "/media/instagram-logo.png";

// Placeholder YouTube video ID for a calm background.
// Replace "YOUTUBE_VIDEO_ID" with your desired Montessori-style video ID.
const YOUTUBE_VIDEO_ID = "YOUTUBE_VIDEO_ID";

// Project timeline used for the progress calculation
const START_DATE = new Date("2026-02-20T00:00:00");
const END_DATE = new Date("2026-04-25T23:59:59");

// Animation settings
const ANIMATION_DURATION_MS = 2000; // How long the bar animates from 0 -> target

// ---------------------------------------------------------------------------
// Utility: calculate date-based target progress (0-100)
// ---------------------------------------------------------------------------
function getTargetProgressPercentage(now = new Date()) {
  const total = END_DATE.getTime() - START_DATE.getTime();
  const elapsed = now.getTime() - START_DATE.getTime();

  if (total <= 0) return 100;

  const raw = (elapsed / total) * 100;
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, raw));
}

// ---------------------------------------------------------------------------
// Background video component
// ---------------------------------------------------------------------------
function BackgroundVideo({ mode }) {
  const useLocal = mode === "local";

  return (
    <div className="bb-bg">
      <div className="bb-bg-mediaWrapper">
        {useLocal ? (
          // Local video background (.webm). File to be provided by you later.
          <video
            className="bb-bg-video"
            src={LOCAL_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          // YouTube video background (autoplay, muted, looped).
          <iframe
            className="bb-bg-video"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}&playsinline=1&rel=0&modestbranding=1&showinfo=0`}
            title="BusyBuddy.Toys background video"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* Dark overlay to ensure foreground readability */}
      <div className="bb-bg-overlay" />

      {/* Optional soft floating particles */}
      <div className="bb-particles">
        <span className="bb-particle bb-particle--1" />
        <span className="bb-particle bb-particle--2" />
        <span className="bb-particle bb-particle--3" />
        <span className="bb-particle bb-particle--4" />
        <span className="bb-particle bb-particle--5" />
        <span className="bb-particle bb-particle--6" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress bar component
// ---------------------------------------------------------------------------
function ProgressBar({ percentage }) {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <div className="bb-progress">
      <div className="bb-progress-header">
        <span className="bb-progress-label">Launch progress</span>
        <span className="bb-progress-value">
          {clamped.toFixed(0)}
          <span className="bb-progress-symbol">%</span>
        </span>
      </div>

      <div className="bb-progress-track">
        <div
          className="bb-progress-fill"
          style={{ width: `${clamped}%` }}
        >
          <div className="bb-progress-highlight" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main App component
// ---------------------------------------------------------------------------
function App() {
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [theme, setTheme] = useState("night"); // 'night' | 'day'

  useEffect(() => {
    // Compute the target completion based on the current date
    const target = getTargetProgressPercentage();

    const startTime = performance.now();

    // Animate from 0 -> target using requestAnimationFrame
    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / ANIMATION_DURATION_MS);

      // Ease-out cubic for a smooth finish
      const eased = 1 - Math.pow(1 - t, 3);
      const currentValue = eased * target;

      setDisplayedProgress(currentValue);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "night" ? "day" : "night"));
  };

  const rootClassName = `bb-root bb-root--${theme}`;

  return (
    <div className={rootClassName}>
      {/* Background layer (video + overlay + particles), как было раньше */}
      <BackgroundVideo mode={backgroundMode} />

      {/* Foreground content */}
      <main className="bb-main">
        <section className="bb-card">
          <header className="bb-card-header">
            <div className="bb-themeToggle" onClick={toggleTheme}>
              <div className={`bb-themeToggle-track bb-themeToggle-track--${theme}`}>
                <div className="bb-themeToggle-knob" />
                <span className="bb-themeToggle-label bb-themeToggle-label--day">
                  Day
                </span>
                <span className="bb-themeToggle-label bb-themeToggle-label--night">
                  Night
                </span>
              </div>
            </div>

            <div className="bb-logoRow">
              <img
                src={LOGO_SRC}
                alt="BusyBuddy.Toys logo"
                className="bb-logo"
              />
              <div>
                <p className="bb-subtitle">
                  <strong>Website is under construction</strong>
                </p>
              </div>
            </div>
          </header>

          <p className="bb-body-text">
            Have you ever dreamt of becoming a better version of yourself?
            Simpler, more beautiful, more perfect?
          </p>
          <p className="bb-body-text">
            That&rsquo;s exactly what we&rsquo;re building right now.
          </p>
          <p className="bb-body-text">
            We are going through a full rebuild &mdash; thoughtfully redesigned,
            carefully refined, and crafted with the same intention we put into
            every wooden toy.
          </p>
          <p className="bb-body-text">
            While our new space is taking shape, the play doesn&rsquo;t have to
            stop.
          </p>
          <p className="bb-body-text bb-inlineRow">
            <img
              src={ETSY_LOGO_SRC}
              alt="Etsy logo"
              className="bb-inlineLogo"
            />
            <span>
              You can shop our Montessori toys on Etsy.
            </span>
          </p>
          <p className="bb-body-text bb-inlineRow">
            <img
              src={INSTAGRAM_LOGO_SRC}
              alt="Instagram logo"
              className="bb-inlineLogo bb-inlineLogo--insta"
            />
            <span>
              Or step into our workshop on Instagram &mdash; see how each piece
              comes to life.
            </span>
          </p>

          <ProgressBar percentage={displayedProgress} />
        </section>
      </main>
    </div>
  );
}

// Expose App globally so main.jsx can render it when using Babel in the browser.
window.App = App;


