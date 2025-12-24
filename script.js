document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");
  const musicToggle = document.getElementById("music-toggle");
  const cursorGlow = document.getElementById("cursor-glow");
  const scrollToContentBtn = document.getElementById("scroll-to-content-btn");
  const heartsContainer = document.querySelector(".falling-hearts");
  const fireworksCanvas = document.getElementById("fireworks-canvas");
  const backgroundMusic = document.getElementById("background-music");

  // --- Initial fade-in ---
  mainContent.style.opacity = "1";

  // --- Cursor Glow Effect ---
  if (cursorGlow) {
    document.addEventListener("mousemove", (e) => {
      cursorGlow.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
    });
  }

  // --- Music Playback on Interaction ---
  if (musicToggle && backgroundMusic) {
    const handleMusicState = () => {
      if (backgroundMusic.paused || backgroundMusic.muted) {
        musicToggle.innerHTML = '🔇 <span class="tooltip">Unmute</span>';
      } else {
        musicToggle.innerHTML = '🔊 <span class="tooltip">Mute</span>';
      }
    };

    const startAudio = () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
          console.error("Audio playback was prevented by the browser:", error);
        });
      }
    };

    // Add listeners for the first user interaction
    document.addEventListener("scroll", startAudio, { once: true });
    document.addEventListener("touchstart", startAudio, { once: true });
    document.addEventListener("click", startAudio, { once: true });

    // Toggle mute/unmute
    musicToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents the document click listener from firing again
      if (backgroundMusic.paused) {
        startAudio();
      } else {
        backgroundMusic.muted = !backgroundMusic.muted;
      }
      handleMusicState();
    });

    // Update icon based on state changes
    backgroundMusic.addEventListener("play", handleMusicState);
    backgroundMusic.addEventListener("pause", handleMusicState);
    backgroundMusic.addEventListener("volumechange", handleMusicState);

    // Set initial state
    handleMusicState();
  }

  // --- Falling Hearts ---
  if (heartsContainer) {
    function createHeart() {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5-10 seconds
      heartsContainer.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, 10000);
    }
    setInterval(createHeart, 500);
  }

  // --- Scroll-triggered Animations ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );
  animatedElements.forEach((el) => scrollObserver.observe(el));

  // --- Interactive Photo Lightbox ---
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const imgSrc = item.querySelector("img").src;
        const captionText = item.getAttribute("data-caption");
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add("visible");
        lightbox.classList.remove("hidden");
        mainContent.style.filter = "blur(8px)";
      });
    });

    lightbox.addEventListener("click", (e) => {
      if (
        e.target === lightbox ||
        e.target.classList.contains("close-lightbox")
      ) {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("visible");
        mainContent.style.filter = "none";
      }
    });
  }

  // --- Smooth scroll for button ---
  if (scrollToContentBtn) {
    scrollToContentBtn.addEventListener("click", () => {
      const messagesSection = document.getElementById("messages-section");
      if (messagesSection) {
        messagesSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // --- Fireworks ---
  if (fireworksCanvas) {
    const ctx = fireworksCanvas.getContext("2d");
    let fireworks = [];
    let particles = [];

    function setupCanvas() {
      fireworksCanvas.width = fireworksCanvas.clientWidth;
      fireworksCanvas.height = fireworksCanvas.clientHeight;
    }
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    function Firework(sx, sy, tx, ty) {
      this.x = sx;
      this.y = sy;
      this.sx = sx;
      this.sy = sy;
      this.tx = tx;
      this.ty = ty;
      this.distanceToTarget = Math.sqrt(
        Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2)
      );
      this.distanceTraveled = 0;
      this.coordinates = [];
      this.coordinateCount = 3;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.atan2(ty - sy, tx - sx);
      this.speed = 2;
      this.acceleration = 1.05;
      this.brightness = Math.random() * 20 + 50;
      this.targetRadius = 1;
    }

    Firework.prototype.update = function (index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.acceleration;
      let vx = Math.cos(this.angle) * this.speed;
      let vy = Math.sin(this.angle) * this.speed;
      this.distanceTraveled = Math.sqrt(
        Math.pow(this.x - this.sx, 2) + Math.pow(this.y - this.sy, 2)
      );
      if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
      } else {
        this.x += vx;
        this.y += vy;
      }
    };

    Firework.prototype.draw = function () {
      ctx.beginPath();
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${
        this.brightness
      }%)`;
      ctx.stroke();
    };

    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      this.coordinateCount = 5;
      while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
      this.angle = Math.random() * Math.PI * 2;
      this.speed = Math.random() * 10 + 1;
      this.friction = 0.95;
      this.gravity = 1;
      this.hue = Math.random() * 360;
      this.brightness = Math.random() * 20 + 50;
      this.alpha = 1;
      this.decay = Math.random() * 0.03 + 0.015;
    }

    Particle.prototype.update = function (index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);
      this.speed *= this.friction;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + this.gravity;
      this.alpha -= this.decay;
      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.moveTo(
        this.coordinates[this.coordinates.length - 1][0],
        this.coordinates[this.coordinates.length - 1][1]
      );
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.stroke();
    };

    function createParticles(x, y) {
      let particleCount = 30;
      while (particleCount--) {
        particles.push(new Particle(x, y));
      }
    }

    function loop() {
      requestAnimationFrame(loop);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
      ctx.globalCompositeOperation = "lighter";

      let i = fireworks.length;
      while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
      }

      let j = particles.length;
      while (j--) {
        particles[j].draw();
        particles[j].update(j);
      }
    }

    let fireworksInterval;
    const fireworksObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loop();
          fireworksInterval = setInterval(() => {
            let startX = fireworksCanvas.width / 2;
            let startY = fireworksCanvas.height;
            let endX = Math.random() * fireworksCanvas.width;
            let endY = (Math.random() * fireworksCanvas.height) / 2;
            fireworks.push(new Firework(startX, startY, endX, endY));
          }, 800);
        } else {
          clearInterval(fireworksInterval);
        }
      },
      { threshold: 0.1 }
    );

    fireworksObserver.observe(fireworksCanvas);
  }
});
