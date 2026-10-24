(function () {
  "use strict";

  const html = document.documentElement;
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const mobileLinks = Array.from(document.querySelectorAll(".mobile-nav__links a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toast = document.getElementById("toast");
  const certModal = document.getElementById("certModal");
  const certModalTitle = document.getElementById("certModalTitle");
  const certModalMeta = document.getElementById("certModalMeta");
  const certModalBody = document.getElementById("certModalBody");
  const certModalLink = document.getElementById("certModalLink");
  const projectModal = document.getElementById("projectModal");
  const projectModalTitle = document.getElementById("projectModalTitle");
  const projectModalMeta = document.getElementById("projectModalMeta");
  const projectModalImage = document.getElementById("projectModalImage");
  const projectModalCategory = document.getElementById("projectModalCategory");
  const projectModalCategoryText = document.getElementById("projectModalCategoryText");
  const projectModalDescription = document.getElementById("projectModalDescription");
  const projectModalFeatures = document.getElementById("projectModalFeatures");
  const projectModalPeriod = document.getElementById("projectModalPeriod");
  const projectModalRole = document.getElementById("projectModalRole");
  const projectModalTags = document.getElementById("projectModalTags");
  const projectModalGithub = document.getElementById("projectModalGithub");
  const projectModalThumbs = document.getElementById("projectModalThumbs");
  const projectDetailBtns = Array.from(document.querySelectorAll(".project-detail-btn"));
  const projectStatus = document.getElementById("projectStatus");
  const contactForm = document.getElementById("contactForm");
  const contactFormStatus = document.getElementById("contactFormStatus");
  let toastTimer;
  let lastFocusedElement;

  if (backToTop) {
    backToTop.hidden = false;
  }

  function closeMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Buka menu navigasi");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.classList.remove("nav-open");
  }

  function openMobileNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Tutup menu navigasi");
    mobileNav.setAttribute("aria-hidden", "false");
    document.body.classList.add("nav-open");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      if (navToggle.getAttribute("aria-expanded") === "true") {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileNav();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) {
        closeMobileNav();
      }
    });
  }

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
    mobileLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  function updateScrollUi() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 12);
    }

    if (progress) {
      const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, percentage)) + "%";
    }

    if (backToTop) {
      backToTop.classList.toggle("is-visible", scrollTop > 560);
    }

    if (sections.length) {
      const marker = scrollTop + window.innerHeight * 0.33;
      let currentId = sections[0].id;
      sections.forEach(function (section) {
        if (section.offsetTop <= marker) {
          currentId = section.id;
        }
      });
      setActiveNav(currentId);
    }
  }

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          updateScrollUi();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateScrollUi();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.08 }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  function animateCounter(element) {
    const target = parseFloat(element.getAttribute("data-count"));
    const decimals = parseInt(element.getAttribute("data-decimals") || "0", 10);
    const duration = 1200;
    const start = performance.now();

    if (Number.isNaN(target)) return;

    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = target * eased;
      element.textContent = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
      if (elapsed < 1) {
        window.requestAnimationFrame(tick);
      } else {
        element.textContent = decimals > 0 ? target.toFixed(decimals) : String(target);
      }
    }

    if (prefersReducedMotion) {
      element.textContent = decimals > 0 ? target.toFixed(decimals) : String(target);
    } else {
      window.requestAnimationFrame(tick);
    }
  }

  const counters = Array.from(document.querySelectorAll("[data-count]"));
  if (counters.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const counterObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const filter = button.getAttribute("data-filter");
        let visibleCount = 0;

        filterButtons.forEach(function (item) {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });

        projectCards.forEach(function (card) {
          const category = card.getAttribute("data-category");
          const show = filter === "all" || category === filter;
          card.hidden = !show;
          if (show) {
            visibleCount += 1;
          }
        });

        if (projectStatus) {
          const label = (button.firstChild ? button.firstChild.textContent : button.textContent).trim().replace(/\s+/g, " ");
          projectStatus.textContent = visibleCount + " proyek ditampilkan untuk kategori " + label + ".";
        }
      });
    });
  }

  const projectData = {
    evalgpt: {
      title: "EvalGPT",
      meta: "Februari – Juli 2026 · Tugas Akhir · Full-Stack Developer",
      category: "Web App",
      period: "Februari – Juli 2026 · Tugas Akhir",
      role: "Full-Stack Developer",
      description: "Aplikasi web untuk mengevaluasi akurasi respons GPT-4o mini pada dataset IndoMMLU. Mengintegrasikan OpenAI API, pendekatan Chain-of-Thought dan Non-CoT, serta Levenshtein Distance untuk menilai kesesuaian jawaban.",
      features: [
        "Integrasi OpenAI API untuk evaluasi respons model",
        "Penerapan pendekatan Chain-of-Thought dan Non-CoT",
        "Perhitungan skor kesesuaian dengan Levenshtein Distance",
        "Pengolahan dataset IndoMMLU dan tampilan hasil evaluasi",
        "Antarmuka yang terstruktur untuk analisis hasil"
      ],
      tags: ["OpenAI API", "GPT-4o mini", "Chain-of-Thought", "Levenshtein Distance", "Evaluasi AI", "Web App"],
      image: "./assets/img/projects/evalgpt/evalgpt-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    "material-lapangan": {
      title: "Aplikasi Pengelolaan Material Lapangan",
      meta: "Agustus – Desember 2025 · Proyek Magang · Full-Stack Developer",
      category: "Web App",
      period: "Agustus – Desember 2025 · Proyek Magang",
      role: "Full-Stack Developer",
      description: "Aplikasi berbasis web untuk mengelola material masuk, distribusi ke tim lapangan, pemakaian berdasarkan Work Order, pengembalian sisa, serta pencatatan material rusak atau hilang.",
      features: [
        "Manajemen material masuk, stok, dan distribusi",
        "Pencatatan pemakaian berdasarkan Work Order",
        "Pengembalian sisa material dan status mutasi",
        "Pencatatan material rusak atau hilang",
        "Rekapitulasi dan pelaporan kebutuhan material"
      ],
      tags: ["Laravel", "MySQL", "ERD", "Black-box Testing", "Administrasi", "Material Tracking"],
      image: "./assets/img/projects/material/material-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    "elaper-dinas": {
      title: "e-LaPer Dinas",
      meta: "Agustus – September 2025 · Proyek QA · Quality Assurance",
      category: "Quality Assurance",
      period: "Agustus – September 2025 · Proyek QA",
      role: "Quality Assurance",
      description: "Pengujian aplikasi web e-LaPer Dinas melalui functional dan black-box testing, penyusunan skenario pengujian, dokumentasi bug, retesting, serta koordinasi hasil pengujian dengan tim pengembang.",
      features: [
        "Penyusunan test case dan skenario pengujian",
        "Pelaksanaan functional testing dan black-box testing",
        "Identifikasi, dokumentasi, dan pelaporan bug",
        "Retesting setelah perbaikan",
        "Koordinasi dan pelacakan hasil temuan"
      ],
      tags: ["Functional Testing", "Black-box Testing", "Test Scenario", "Bug Reporting", "Retesting"],
      image: "./assets/img/projects/e-laper-dinas/e-laper-dinas-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    "na-laundry": {
      title: "Na Laundry",
      meta: "September – Desember 2024 · Proyek Akademik · UI/UX Designer",
      category: "UI/UX",
      period: "September – Desember 2024 · Proyek Akademik",
      role: "UI/UX Designer",
      description: "Merancang UI/UX aplikasi laundry berbasis mobile menggunakan Figma, mencakup desain antarmuka, alur penggunaan, notifikasi layanan, dan pelacakan status pesanan.",
      features: [
        "Perancangan wireframe dan high-fidelity UI",
        "User flow untuk pemesanan dan pelacakan status",
        "Desain sistem notifikasi layanan",
        "Prototyping interaktif di Figma",
        "Perancangan pengalaman pengguna untuk aplikasi mobile"
      ],
      tags: ["Figma", "Mobile Design", "User Flow", "Prototyping", "UI/UX"],
      image: "./assets/img/projects/na-laundry/na-laundry-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    bekom: {
      title: "Bekom",
      meta: "Februari – Mei 2024 · Proyek Akademik · Full-Stack Developer",
      category: "Web App",
      period: "Februari – Mei 2024 · Proyek Akademik",
      role: "Full-Stack Developer",
      description: "Website layanan servis komputer dan HP dengan informasi layanan, pelacakan status perbaikan, estimasi biaya, dan laporan servis untuk memudahkan pelanggan memantau progres.",
      features: [
        "Katalog layanan servis dan estimasi biaya",
        "Form pengajuan servis dan pelacakan status",
        "Manajemen data servis oleh admin",
        "Laporan layanan dan status perbaikan",
        "Sistem CRUD untuk pengelolaan data"
      ],
      tags: ["Web Development", "CRUD", "Status Tracking", "Reporting", "PHP/HTML/CSS"],
      image: "./assets/img/projects/bekom/bekom-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    decafe: {
      title: "DeCafe",
      meta: "September – Desember 2023 · Proyek Akademik · Full-Stack Developer",
      category: "Web App",
      period: "September – Desember 2023 · Proyek Akademik",
      role: "Full-Stack Developer",
      description: "Website pemesanan untuk kafe dengan katalog menu, estimasi biaya, serta notifikasi status pesanan secara real-time untuk meningkatkan pengalaman pelanggan.",
      features: [
        "Katalog menu dan keranjang pemesanan",
        "Perhitungan total biaya otomatis",
        "Update status pesanan secara real-time",
        "Manajemen menu oleh admin",
        "Antarmuka pelanggan yang ringkas dan mudah digunakan"
      ],
      tags: ["Web Development", "Catalog", "Order Status", "Real-time", "PHP/HTML/CSS"],
      image: "./assets/img/projects/decafe/decafe-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    "db-akademik": {
      title: "Database Akademik",
      meta: "Februari – Mei 2023 · Proyek Individu · Database Developer",
      category: "Database",
      period: "Februari – Mei 2023 · Proyek Individu",
      role: "Database Developer",
      description: "Membangun database akademik dengan MySQL untuk entitas mahasiswa, dosen, jurusan, dan nilai. Struktur dirancang dengan prinsip normalisasi untuk menjaga integritas data dan efisiensi query.",
      features: [
        "Perancangan ERD dan relasi antar tabel",
        "Normalisasi database untuk mengurangi redundansi",
        "Implementasi tabel mahasiswa, dosen, jurusan, matakuliah, dan nilai",
        "Pembuatan query dasar untuk pelaporan",
        "Menjaga integritas referensial data"
      ],
      tags: ["MySQL", "Normalisasi", "Relasi Tabel", "SQL", "Database Design"],
      image: "./assets/img/projects/akademik/akademik-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    },
    "inventory-barang": {
      title: "Sistem Inventory Barang",
      meta: "Desember 2022 · Proyek Individu · Database Developer",
      category: "Database",
      period: "Desember 2022 · Proyek Individu",
      role: "Database Developer",
      description: "Merancang sistem inventaris menggunakan Microsoft Access dengan relasi antar tabel, form input/output, dan laporan stok untuk memudahkan pengelolaan serta pelacakan ketersediaan barang.",
      features: [
        "Perancangan tabel, relasi, dan kunci utama",
        "Form input barang, pemasukan, dan pengeluaran",
        "Laporan stok dan mutasi barang",
        "Validasi data dan tampilan ringkas",
        "Sistem pelacakan ketersediaan stok"
      ],
      tags: ["Microsoft Access", "Relasi Tabel", "Form", "Laporan Stok", "Database Design"],
      image: "./assets/img/projects/inventory/inventory-0.png",
      gallery: [],
      github: "https://github.com/ElviraGladysSamsul"
    }
  };

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    document.body.removeChild(textarea);
    return copied;
  }

  const copyButtons = Array.from(document.querySelectorAll("[data-copy-email]"));
  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const email = button.getAttribute("data-copy-email");
      if (!email) return;

      function success() {
        showToast("Email " + email + " berhasil disalin.");
      }

      function failure() {
        showToast("Salin manual: " + email);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(success).catch(function () {
          if (fallbackCopy(email)) {
            success();
          } else {
            failure();
          }
        });
      } else if (fallbackCopy(email)) {
        success();
      } else {
        failure();
      }
    });
  });

  function closeCertModal() {
    if (!certModal) return;
    if (typeof certModal.close === "function") {
      certModal.close();
    }
  }

  function openCertModal(button) {
    if (!certModal) return;
    const title = button.getAttribute("data-cert-title") || "Sertifikat";
    const meta = button.getAttribute("data-cert-meta") || "";
    const type = button.getAttribute("data-cert-type") || "pdf";
    const src = button.getAttribute("data-cert-src");

    if (!src) return;

    if (typeof certModal.showModal !== "function") {
      window.open(src, "_blank", "noopener");
      return;
    }

    lastFocusedElement = document.activeElement;
    certModalTitle.textContent = title;
    certModalMeta.textContent = meta;
    certModalLink.href = src;
    certModalBody.replaceChildren();

    if (type === "image") {
      const image = document.createElement("img");
      image.src = src;
      image.alt = "Pratinjau " + title;
      certModalBody.appendChild(image);
    } else {
      const frame = document.createElement("iframe");
      frame.src = src;
      frame.title = "Pratinjau " + title;
      certModalBody.appendChild(frame);
    }

    document.body.classList.add("modal-open");
    certModal.showModal();
    const closeButton = certModal.querySelector("[data-close-modal]");
    if (closeButton) {
      closeButton.focus();
    }
  }

  const certButtons = Array.from(document.querySelectorAll(".cert-card__open"));
  certButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openCertModal(button);
    });
  });

  function closeProjectModal() {
    if (!projectModal) return;
    if (typeof projectModal.close === "function") {
      projectModal.close();
    }
  }

  function openProjectModal(projectId) {
    if (!projectModal || !projectData[projectId]) return;
    const data = projectData[projectId];
    lastFocusedElement = document.activeElement;

    if (projectModalTitle) projectModalTitle.textContent = data.title || "Proyek";
    if (projectModalMeta) projectModalMeta.textContent = data.meta || "";
    if (projectModalCategory) projectModalCategory.textContent = data.category || "";
    if (projectModalCategoryText) projectModalCategoryText.textContent = data.category || "";
    if (projectModalDescription) projectModalDescription.textContent = data.description || "";
    if (projectModalPeriod) projectModalPeriod.textContent = data.period || "";
    if (projectModalRole) projectModalRole.textContent = data.role || "";

    if (projectModalImage) {
      projectModalImage.src = data.image || "./assets/img/projects/project-cover.svg";
      projectModalImage.alt = "Pratinjau " + (data.title || "proyek");
    }

    if (projectModalFeatures) {
      projectModalFeatures.replaceChildren();
      if (Array.isArray(data.features)) {
        data.features.forEach(function (feature) {
          const item = document.createElement("li");
          item.textContent = feature;
          projectModalFeatures.appendChild(item);
        });
      }
    }

    if (projectModalTags) {
      projectModalTags.replaceChildren();
      if (Array.isArray(data.tags)) {
        data.tags.forEach(function (tag) {
          const span = document.createElement("span");
          span.textContent = tag;
          projectModalTags.appendChild(span);
        });
      }
    }

    if (projectModalGithub) {
      projectModalGithub.href = data.github || "https://github.com/ElviraGladysSamsul";
    }

    if (projectModalThumbs) {
      projectModalThumbs.replaceChildren();
      if (Array.isArray(data.gallery) && data.gallery.length > 0) {
        projectModalThumbs.hidden = false;
        data.gallery.forEach(function (src, index) {
          const button = document.createElement("button");
          button.className = "project-detail__thumb";
          button.type = "button";
          button.setAttribute("aria-label", "Tampilkan screenshot " + (index + 1));
          const img = document.createElement("img");
          img.src = src;
          img.alt = (data.title || "Proyek") + " screenshot " + (index + 1);
          img.loading = "lazy";
          button.appendChild(img);
          button.addEventListener("click", function () {
            if (projectModalImage) {
              projectModalImage.src = src;
              projectModalImage.alt = "Pratinjau " + (data.title || "proyek") + " screenshot " + (index + 1);
            }
            Array.from(projectModalThumbs.querySelectorAll(".project-detail__thumb")).forEach(function (thumb, i) {
              thumb.classList.toggle("is-active", i === index);
            });
          });
          if (index === 0) button.classList.add("is-active");
          projectModalThumbs.appendChild(button);
        });
      } else {
        projectModalThumbs.hidden = true;
      }
    }

    if (typeof projectModal.showModal !== "function") {
      window.open(data.github || "https://github.com/ElviraGladysSamsul", "_blank", "noopener");
      return;
    }

    document.body.classList.add("modal-open");
    projectModal.showModal();
    const closeButton = projectModal.querySelector("[data-close-project-modal]");
    if (closeButton) {
      closeButton.focus();
    }
  }

  projectDetailBtns.forEach(function (button) {
    button.addEventListener("click", function () {
      const projectId = button.getAttribute("data-project");
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (projectModal) {
    const closeButtons = Array.from(projectModal.querySelectorAll("[data-close-project-modal]"));
    closeButtons.forEach(function (button) {
      button.addEventListener("click", closeProjectModal);
    });

    projectModal.addEventListener("click", function (event) {
      if (event.target === projectModal) {
        closeProjectModal();
      }
    });

    projectModal.addEventListener("close", function () {
      document.body.classList.remove("modal-open");
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    });

    projectModal.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeProjectModal();
      }
    });
  }

  if (certModal) {
    const closeButton = certModal.querySelector("[data-close-modal]");
    if (closeButton) {
      closeButton.addEventListener("click", closeCertModal);
    }

    certModal.addEventListener("click", function (event) {
      if (event.target === certModal) {
        closeCertModal();
      }
    });

    certModal.addEventListener("close", function () {
      if (certModal.open === false) {
        document.body.classList.remove("modal-open");
      }
      if (certModalBody) {
        certModalBody.replaceChildren();
      }
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      const honey = contactForm.querySelector('[name="_honey"]');
      if (honey && honey.value) {
        event.preventDefault();
        if (contactFormStatus) {
          contactFormStatus.className = "contact-form__status is-success";
          contactFormStatus.textContent = "Pesan terkirim. Terima kasih sudah menghubungi saya.";
        }
        try {
          contactForm.reset();
        } catch (error) {
          // ignore
        }
        return;
      }

      if (!window.fetch || typeof FormData === "undefined") {
        return;
      }

      event.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitButton ? submitButton.innerHTML : null;

      if (contactFormStatus) {
        contactFormStatus.className = "contact-form__status";
        contactFormStatus.textContent = "Mengirim pesan...";
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg> Mengirim...';
      }

      const formData = new FormData(contactForm);
      const payload = {};
      formData.forEach(function (value, key) {
        if (key === "_honey") {
          return;
        }
        payload[key] = value;
      });

      fetch("https://formsubmit.co/ajax/elviragladyssamsul@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("network");
          }
          return response.json();
        })
        .then(function (data) {
          if (data && (data.success === true || data.success === "true")) {
            if (contactFormStatus) {
              contactFormStatus.className = "contact-form__status is-success";
              contactFormStatus.textContent = "Pesan terkirim. Terima kasih sudah menghubungi saya.";
            }
            try {
              contactForm.reset();
            } catch (error) {
              // ignore
            }
          } else {
            throw new Error("form");
          }
        })
        .catch(function () {
          if (contactFormStatus) {
            contactFormStatus.className = "contact-form__status is-error";
            contactFormStatus.innerHTML =
              'Gagal mengirim. Coba lagi atau <a href="mailto:elviragladyssamsul@gmail.com">kirim lewat email</a>.';
          }
        })
        .finally(function () {
          if (submitButton) {
            submitButton.disabled = false;
            if (originalHtml !== null) {
              submitButton.innerHTML = originalHtml;
            }
          }
        });
    });
  }

  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();

const certModal = document.getElementById("certModal");

if (certModal) {
  const certTitle = document.getElementById("certModalTitle");
  const certMeta = document.getElementById("certModalMeta");
  const certBody = document.getElementById("certModalBody");
  const certDescription = document.getElementById("certModalDescription");
  const certFocusTitle = document.getElementById("certModalFocusTitle");
  const certFocus = document.getElementById("certModalFocus");
  const certLink = document.getElementById("certModalLink");
  const certClose = document.getElementById("certModalClose");

  document.querySelectorAll(".cert-card__open").forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.dataset.certTitle || "Sertifikat";
      const meta = button.dataset.certMeta || "";
      const src = button.dataset.certSrc || "";
      const description =
        button.dataset.certDescription ||
        "Informasi kegiatan belum tersedia.";
      const focusItems = (button.dataset.certFocus || "")
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean);

      // Isi judul dan informasi sertifikat
      certTitle.textContent = title;
      certMeta.textContent = meta;
      certDescription.textContent = description;

      // Tampilkan gambar sertifikat
      certBody.replaceChildren();

      if (src) {
        const image = document.createElement("img");
        image.className = "cert-modal__image";
        image.src = src;
        image.alt = `Gambar sertifikat ${title}`;
        image.loading = "eager";
        certBody.appendChild(image);

        certLink.href = src;
        certLink.hidden = false;
      } else {
        certBody.textContent = "Gambar sertifikat belum tersedia.";
        certLink.hidden = true;
      }

      // Tampilkan fokus pembelajaran atau pencapaian
      certFocus.replaceChildren();

      focusItems.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        certFocus.appendChild(li);
      });

      certFocusTitle.textContent = focusItems.length
        ? "Fokus Pembelajaran / Pencapaian"
        : "Informasi Tambahan";

      // Buka modal
      if (!certModal.open) {
        certModal.showModal();
      }
    });
  });

  // Tutup melalui tombol X
  certClose?.addEventListener("click", () => {
    certModal.close();
  });

  // Tutup saat pengguna mengklik area backdrop
  certModal.addEventListener("click", (event) => {
    if (event.target === certModal) {
      certModal.close();
    }
  });
  
}


document.querySelectorAll(".project-gallery").forEach((gallery) => {
  const mainImage = gallery.querySelector(".project-gallery__preview");
  const counter = gallery.querySelector(".project-gallery__counter");
  const thumbnails = gallery.querySelectorAll(".project-gallery__thumb");

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const imagePath = thumb.dataset.image;
      const imageIndex = thumb.dataset.index;

      if (!imagePath || !mainImage) return;

      mainImage.src = imagePath;
      mainImage.alt = `Screenshot EvalGPT ${imageIndex}`;

      if (counter) {
        counter.textContent = `${imageIndex} / ${thumbnails.length}`;
      }

      thumbnails.forEach((item) => {
        item.classList.remove("is-active");
        item.removeAttribute("aria-current");
      });

      thumb.classList.add("is-active");
      thumb.setAttribute("aria-current", "true");
    });
  });
});
