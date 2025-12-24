document.addEventListener("DOMContentLoaded", () => {
  // --- Force scroll to top on page load ---
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const mainContent = document.getElementById("main-content");
  const musicToggle = document.getElementById("music-toggle");
  const cursorGlow = document.getElementById("cursor-glow");
  const scrollToContentBtn = document.getElementById("scroll-to-content-btn");
  const heartsContainer = document.querySelector(".falling-hearts");
  const fireworksCanvas = document.getElementById("fireworks-canvas");
  const backgroundMusic = document.getElementById("background-music");

  // --- SHARED FIREWORKS STATE AND FUNCTIONS ---
  let fireworks = [];
  let particles = [];
  let ctx = null;

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
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(
      this.coordinates[this.coordinates.length - 1][0],
      this.coordinates[this.coordinates.length - 1][1]
    );
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
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
    if (!ctx) return;
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
    if (!ctx) return;
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
        messagesSection.classList.add("is-visible");
        // Wait a moment for the CSS transition to begin before scrolling
        setTimeout(() => {
          messagesSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    });
  }

  // --- Fireworks Setup ---
  if (fireworksCanvas) {
    ctx = fireworksCanvas.getContext("2d");
    function setupCanvas() {
      fireworksCanvas.width = fireworksCanvas.clientWidth;
      fireworksCanvas.height = fireworksCanvas.clientHeight;
    }
    setupCanvas();
    window.addEventListener("resize", setupCanvas);

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

  // --- Final Heart Interaction ---
  const finalHeart = document.querySelector(".final-heart");
  const finalSecretMessage = document.getElementById("final-secret-message");
  const slideshowOverlay = document.getElementById("slideshow-overlay");
  const slideshowImg = document.getElementById("slideshow-img");
  const clickPrompt = document.querySelector(".click-prompt");

  if (finalHeart && finalSecretMessage && slideshowOverlay && slideshowImg) {
    const secretMessage = "Made with love, just for you.";
    let isActionTriggered = false;
    let slideshowInterval; // Define interval here to be accessible in both functions

    const stopSlideshow = () => {
      clearInterval(slideshowInterval);
      slideshowOverlay.classList.remove("visible");

      // --- Grand Finale after slideshow ---
      finalSecretMessage.classList.add("visible");
      finalSecretMessage.textContent = secretMessage;

      // --- Grand Finale Fireworks ---
      let finaleCount = 0;
      const grandFinale = setInterval(() => {
        if (finaleCount >= 15 || !fireworksCanvas) {
          clearInterval(grandFinale);
          return;
        }
        let startX = fireworksCanvas.width / 2;
        let startY = fireworksCanvas.height;
        let endX = Math.random() * fireworksCanvas.width;
        let endY = (Math.random() * fireworksCanvas.height) / 2;
        fireworks.push(new Firework(startX, startY, endX, endY));
        finaleCount++;
      }, 100); // Rapid succession

      // Reset for next click
      isActionTriggered = false;
      finalHeart.classList.remove("clicked");

      // --- Show Proposal Section ---
      const proposalSection = document.getElementById("proposal-section");
      if (proposalSection) {
        // Scroll to the new section
        proposalSection.classList.remove("hidden");
        setTimeout(() => {
          proposalSection.scrollIntoView({ behavior: "smooth" });
        }, 300); // Wait a moment for other animations to settle
      }
    };

    // Add listener to close button once
    const closeSlideshowBtn = document.querySelector(".close-slideshow");
    if (closeSlideshowBtn) {
      closeSlideshowBtn.addEventListener("click", stopSlideshow);
    }

    finalHeart.addEventListener("click", () => {
      if (isActionTriggered) return;
      isActionTriggered = true;

      // Hide message and reset heart
      finalSecretMessage.classList.remove("visible");
      finalHeart.classList.add("clicked");
      if (clickPrompt) clickPrompt.style.opacity = "0";

      // --- Start Slideshow ---
      const galleryImages = Array.from(
        document.querySelectorAll(".gallery-item img")
      ).map((img) => img.src);

      if (galleryImages.length > 0) {
        slideshowOverlay.classList.add("visible");

        let currentIndex = 0;

        const showNextImage = () => {
          if (currentIndex >= galleryImages.length) {
            stopSlideshow();
            return;
          }

          slideshowImg.classList.remove("animate");
          void slideshowImg.offsetWidth;
          slideshowImg.classList.add("animate");
          slideshowImg.src = galleryImages[currentIndex];
          currentIndex++;
        };

        // Start the slideshow
        showNextImage(); // Show the first image immediately
        slideshowInterval = setInterval(showNextImage, 3000);
      } else {
        // If no images, just show the message and reset
        stopSlideshow();
      }
    });
  }

  // --- Proposal Section Logic ---
  const proposalSection = document.getElementById("proposal-section");
  if (proposalSection) {
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const celebrationMessage = document.getElementById("celebration-message");
    const proposalQuestion = document.getElementById("proposal-question");
    const proposalButtons = document.querySelector(".proposal-buttons");
    const noBtnMessage = document.getElementById("no-btn-message");

    const funnyMessages = [
      "Oops, try again! 😉",
      "Are you sure about that?",
      "My heart says otherwise...",
      "Is your finger slipping?",
      "This button seems broken...",
      "Maybe try the other one? 👉",
      "Nice try! 😂",
      "I think you misclicked.",
      "Error 404: 'No' not found.",
      "So close! But no.",
      "Is that your final answer? (It can't be)",
      "I don't believe you.",
      "That choice feels… incorrect.",
      "Hmm, let's pretend that didn't happen.",
      "Not today 😌",
      "Try again, champ!",
      "Bold move. Wrong, but bold.",
      "The universe says no.",
      "Let's give that another go.",
      "Interesting choice. Try again.",
      "Oops! That wasn't it.",
      "Your mouse betrayed you.",
      "That option is unavailable.",
      "Denied 🚫",
      "Nope nope nope.",
      "I admire the confidence. Still no.",
      "Something tells me you meant the other one.",
      "Let's rewind and retry.",
      "That answer has been rejected.",
      "Close enough… actually not at all.",
      "We're gonna pretend you didn't click that.",
      "That button is for decoration only.",
      "System says: absolutely not.",
      "Aw, that's cute. But no.",
      "Incorrect, but I like the enthusiasm.",
      "Try the *other* option.",
      "Hmm… suspicious choice.",
      "That ain't it chief.",
      "Let's try that again, shall we?",
      "Nope. Once more!",
      "That click didn't count.",
      "Are you testing me?",
      "I respectfully disagree.",
      "That was a brave attempt.",
      "Nice click. Wrong one.",
      "We're not doing that today.",
      "Incorrect selection detected.",
      "Let's choose wisely this time.",
      "That option is cursed 🧙‍♂️",
    ];

    let shuffledMessages = [];
    let messageIndex = 0;

    const shuffleMessages = () => {
      shuffledMessages = [...funnyMessages].sort(() => Math.random() - 0.5);
      messageIndex = 0;
    };

    const moveButtonAndShowMessage = () => {
      // Move button
      const containerRect = proposalSection.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();
      const newTop = Math.random() * (containerRect.height - btnRect.height);
      const newLeft = Math.random() * (containerRect.width - btnRect.width);
      noBtn.style.top = `${newTop}px`;
      noBtn.style.left = `${newLeft}px`;

      // Show message
      if (shuffledMessages.length === 0) {
        shuffleMessages();
      }
      if (messageIndex >= shuffledMessages.length) {
        shuffleMessages(); // Reshuffle if we've shown them all
      }
      noBtnMessage.textContent = shuffledMessages[messageIndex];
      noBtnMessage.classList.add("visible");
      messageIndex++;
    };

    noBtn.addEventListener("mouseover", moveButtonAndShowMessage);
    noBtn.addEventListener("click", moveButtonAndShowMessage); // For mobile

    yesBtn.addEventListener("click", () => {
      // Hide question, buttons, and funny message
      proposalQuestion.style.display = "none";
      proposalButtons.style.display = "none";
      noBtnMessage.style.display = "none";

      // Show celebration message
      celebrationMessage.classList.remove("hidden");
      celebrationMessage.style.opacity = "1";

      // Trigger a massive fireworks finale
      let finaleCount = 0;
      const grandFinale = setInterval(() => {
        if (finaleCount >= 30 || !fireworksCanvas) {
          clearInterval(grandFinale);
          return;
        }
        // Launch fireworks from multiple locations for a bigger effect
        for (let i = 0; i < 3; i++) {
          let startX = (fireworksCanvas.width / 4) * (i + 1);
          let startY = fireworksCanvas.height;
          let endX = Math.random() * fireworksCanvas.width;
          let endY = (Math.random() * fireworksCanvas.height) / 2;
          fireworks.push(new Firework(startX, startY, endX, endY));
        }
        finaleCount++;
      }, 200);
    });
  }
});
