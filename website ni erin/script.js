document.addEventListener("DOMContentLoaded", function () {

  // =====================================
  // DEVELOPERS AND STAFF
  // =====================================

  const team = {
    developers: [
      {
        name: "Ramie",
        role: "Lead Developer",
        image: "IMAGE/dev ramie.jpeg"
      },
      {
        name: "Josh",
        role: "Frontend Developer",
        image: "IMAGE/dev ketzuki.jpeg"
      },
      {
        name: "Ber",
        role: "Backend Developer",
        image: "IMAGE/dev ber.jpeg"
      },
      {
        name: "Erin",
        role: "UI/UX Designer",
        image: "IMAGE/dev erin.jpeg"
      }
    ],

    staff: [
      {
        name: "Cosmic",
        role: "Staff Member",
        image: "IMAGE/staff cosmic.jpeg"
      },
      {
        name: "Kozume",
        role: "Staff Member",
        image: "IMAGE/staff kozume.jpeg"
      }
    ]
  };

  // =====================================
  // ROBLOX COMMUNITIES
  // =====================================

  const communities = [
    {
      name: "Erin Community",
      description: "Join Erin's Roblox community!",
      url: "https://www.roblox.com/share/g/178172255"
    },
    {
      name: "Ramie Community",
      description: "Join Ramie's Roblox community!",
      url: "https://www.roblox.com/share/g/393184105"
    },
    {
      name: "Our Community",
      description:
        "Join our official Roblox community for game updates, announcements, and sneak peeks!",
      url: "https://www.roblox.com/share/g/12878378"
    }
  ];

  // =====================================
  // CLICK SOUND EFFECT
  // NO MP3 FILE REQUIRED
  // =====================================

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  let audioContext = null;

  function playClickSound(isEnter = false) {
    if (!AudioContextClass) return;

    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(function () {});
      }

      const now = audioContext.currentTime;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";

      // Slightly different sound for ENTER STUDIO
      const startFrequency = isEnter ? 750 : 620;
      const endFrequency = isEnter ? 980 : 440;
      const duration = isEnter ? 0.15 : 0.09;

      oscillator.frequency.setValueAtTime(
        startFrequency, now
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        endFrequency, now + duration
      );

      gain.gain.setValueAtTime(0.001, now);

      gain.gain.exponentialRampToValueAtTime(
        0.055, now + 0.012
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001, now + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + duration + 0.01);

      oscillator.onended = function () {
        oscillator.disconnect();
        gain.disconnect();
      };

    } catch (error) {
      console.log("Sound unavailable:", error);
    }
  }

  // One click handler for all buttons and links
  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;

    const clickable = event.target.closest(
      "button, .community-card, #brandLink"
    );

    if (!clickable) return;

    const isEnter = clickable.id === "enterBtn";

    playClickSound(isEnter);
  });

  // =====================================
  // PAGE NAVIGATION
  // =====================================

  const pages = {
    intro: document.getElementById("introPage"),
    home: document.getElementById("homePage"),
    transition: document.getElementById("transitionPage"),
    members: document.getElementById("membersPage"),
    community: document.getElementById("communityPage"),
    about: document.getElementById("aboutPage")
  };

  let transitionTimer = null;

  function showPage(pageName) {
    clearTimeout(transitionTimer);

    Object.values(pages).forEach(function (page) {
      if (!page) return;

      page.hidden = true;
      page.classList.remove("active");
    });

    const selectedPage = pages[pageName];

    if (!selectedPage) {
      console.error("Page not found:", pageName);
      return;
    }

    selectedPage.hidden = false;

    // Restart fade animation
    void selectedPage.offsetWidth;
    selectedPage.classList.add("active");

    window.scrollTo(0, 0);
  }

  // =====================================
  // ENTER STUDIO
  // =====================================

  const enterBtn = document.getElementById("enterBtn");

  if (enterBtn) {
    enterBtn.addEventListener("click", function () {
      showPage("home");
    });
  }

  // =====================================
  // SECTION NAVIGATION
  // =====================================

  document.querySelectorAll(".nav-card").forEach(
    function (card) {
      card.addEventListener("click", function () {
        openSection(card.dataset.target);
      });
    }
  );

  function openSection(section) {
    const titles = {
      developers: "DEVELOPERS",
      staff: "STAFF TEAM",
      community: "OUR COMMUNITY",
      about: "ABOUT US"
    };

    if (!titles[section]) return;

    const transitionTitle =
      document.getElementById("transitionTitle");

    if (transitionTitle) {
      transitionTitle.textContent = titles[section];
    }

    showPage("transition");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    transitionTimer = setTimeout(function () {

      if (section === "community") {
        renderCommunities();
        showPage("community");

      } else if (section === "about") {
        showPage("about");

      } else {
        renderMembers(section);
        showPage("members");
      }

    }, reduceMotion ? 0 : 1100);
  }

  // =====================================
  // IMAGE PLACEHOLDER
  // =====================================

  function createPlaceholder() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
           width="400" height="500"
           viewBox="0 0 400 500">
        <rect width="400" height="500" fill="#303d57"/>
        <circle cx="200" cy="195" r="61" fill="#8391b8"/>
        <path d="M75 410c0-75 56-125 125-125s125 50 125 125"
              fill="#8391b8"/>
      </svg>
    `;

    return "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(svg);
  }

  // =====================================
  // DISPLAY DEVELOPERS AND STAFF
  // =====================================

  function renderMembers(section) {
    const grid = document.getElementById("membersGrid");
    const title = document.getElementById("membersTitle");
    const description =
      document.getElementById("membersDescription");

    if (!grid || !title || !description) return;

    grid.replaceChildren();

    if (section === "developers") {
      title.textContent = "Developers";
      description.textContent =
        "The creative minds behind our work.";
    } else {
      title.textContent = "Staff Team";
      description.textContent =
        "The people who keep everything running.";
    }

    const members = team[section] || [];

    members.forEach(function (member) {

      const card = document.createElement("article");
      card.className = "member-card";

      const photo = document.createElement("img");
      photo.className = "member-photo";
      photo.src = member.image;
      photo.alt = member.name + " profile picture";
      photo.loading = "lazy";

      photo.onerror = function () {
        this.onerror = null;
        this.src = createPlaceholder();
      };

      const info = document.createElement("div");
      info.className = "member-info";

      const name = document.createElement("h3");
      name.textContent = member.name;

      const role = document.createElement("p");
      role.textContent = member.role;

      info.append(name, role);
      card.append(photo, info);
      grid.appendChild(card);
    });
  }

  // =====================================
  // ROBLOX COMMUNITY LINKS
  // =====================================

  function renderCommunities() {
    const grid = document.getElementById("communityGrid");

    if (!grid) return;

    grid.replaceChildren();

    communities.forEach(function (community) {

      const card = document.createElement("a");

      card.className = "community-card";
      card.href = community.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";

      const icon = document.createElement("span");
      icon.className = "community-icon";
      icon.textContent = "✦";

      const title = document.createElement("h3");
      title.textContent = community.name;

      const description = document.createElement("p");
      description.textContent = community.description;

      const link = document.createElement("span");
      link.className = "community-link";
      link.textContent = "JOIN COMMUNITY ↗";

      card.append(icon, title, description, link);

      grid.appendChild(card);
    });
  }

  // =====================================
  // BACK BUTTONS
  // =====================================

  document.querySelectorAll("[data-back]").forEach(
    function (button) {
      button.addEventListener("click", function () {
        showPage(button.dataset.back);
      });
    }
  );

  // =====================================
  // STUDIO LOGO
  // =====================================

  const brandLink = document.getElementById("brandLink");

  if (brandLink) {
    brandLink.addEventListener("click", function (event) {
      event.preventDefault();
      showPage("intro");
    });
  }

  // =====================================
  // START WEBSITE
  // =====================================

  showPage("intro");

  console.log("Studio Website v7 - Click Sounds Ready!");

});
