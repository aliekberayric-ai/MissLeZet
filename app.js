document.getElementById("year").textContent = new Date().getFullYear();

// ===== GitHub Pages Asset Fix =====
function repoBase(){
  if (location.hostname.endsWith("github.io")) {
    const parts = location.pathname.split("/").filter(Boolean);
    return parts.length ? `/${parts[0]}/` : "/";
  }
  return "/";
}
function assetUrl(u){
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  const base = repoBase();
  if (u.startsWith("/")) return base + u.replace(/^\/+/, "");
  return base + u.replace(/^\.?\//, "");
}

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add("in"));
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach(el => obs.observe(el));

// Lightbox
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
const lbClose = document.getElementById("lbClose");
const closeLb = () => { lb.style.display = "none"; lbImg.src = ""; lbCap.textContent = ""; };
lbClose.addEventListener("click", closeLb);
lb.addEventListener("click", (e) => { if(e.target === lb) closeLb(); });
window.addEventListener("keydown", (e) => { if(e.key === "Escape") closeLb(); });

// ===== Paket-Konfigurator =====
const pkgModal = document.getElementById("pkgModal");
const pkgModalClose = document.getElementById("pkgModalClose");
const pkgModalTitle = document.getElementById("pkgModalTitle");
const pkgModalDesc = document.getElementById("pkgModalDesc");
const pkgBuilder = document.getElementById("pkgBuilder");

const pkgPeople = document.getElementById("pkgPeople");
const pkgPerPerson = document.getElementById("pkgPerPerson");
const pkgTotal = document.getElementById("pkgTotal");
const pkgTotalHint = document.getElementById("pkgTotalHint");
const pkgReset = document.getElementById("pkgReset");
const pkgApply = document.getElementById("pkgApply");

let currentPkg = null;
let selectedMap = new Map();

// Language
let SITE = null;
let LANG = localStorage.getItem("ml_lang") || "de";

const t = (val) => {
  if (val == null) return "";
  if (typeof val === "object" && !Array.isArray(val)) {
    return val[LANG] ?? val.de ?? Object.values(val)[0] ?? "";
  }
  return val;
};
const tList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "object") return val[LANG] ?? val.de ?? [];
  return [];
};

function setLang(lang){
  LANG = lang;
  localStorage.setItem("ml_lang", LANG);
  render();
  document.documentElement.lang = (LANG==="tr" ? "tr" : (LANG==="en" ? "en" : "de"));
}

document.getElementById("langDE").addEventListener("click", () => setLang("de"));
document.getElementById("langTR").addEventListener("click", () => setLang("tr"));
document.getElementById("langEN").addEventListener("click", () => setLang("en"));
document.getElementById("btnPdf").addEventListener("click", () => window.print());

function uiStaticText(){
  const map = {
    de: {
      ctaTop: "Angebot anfragen →",
      btnMenu: "Menü ansehen",
      heroHint: "Tipp: Inhalte & Galerie kannst du später über /admin pflegen.",
      quickTitle: "Quick Facts",
      q1: "Buffets & Fingerfood für 10–300+ Personen",
      q2: "Vegetarisch/Vegan möglich",
      q3: "Pünktlich & zuverlässig",
      adminHint: "Admin: /admin",
      aboutTitle:"Über uns",
      aboutSub:"Miss Lezzet – türkische Klassiker modern serviert.",
      howTitle:"So funktioniert’s",
      howHint:"Allergene/Unverträglichkeiten im Kontaktformular angeben.",
      packagesTitle:"Pakete",
      packagesSub:"Schnell wählen – wir passen alles individuell an.",
      teamTitle:"Mitarbeiter",
      teamSub:"Menschen, die den Geschmack möglich machen.",
      teamHint:"Team kannst du im Admin pflegen.",
      pricesTitle:"Preisliste",
      pricesSub:"Richtwerte – Angebote nach Auswahl & Personenanzahl.",
      menuTitle:"Menü",
      menuSub:"Beispielauswahl – kombinierbar nach Wunsch.",
      galleryTitle:"Galerie",
      gallerySub:"Klick auf ein Bild → Lightbox.",
      galleryHint:"Bilder hochladen & Reihenfolge ändern: /admin → Galerie.",
      socialTitle:"Stimmen",
      socialSub:"Kurz & vertrauensstark.",
      contactTitle:"Kontaktformular",
      contactSub:"Schreib uns kurz – wir melden uns schnell.",
      contactBoxTitle:"Kontakt",
      contactHint:"Formspree leitet Anfragen per E-Mail weiter.",
      fName:"Name", fEmail:"E-Mail", fDate:"Event-Datum", fPeople:"Personenanzahl", fMsg:"Nachricht", fSend:"Anfrage senden",
      fSpam:"Anti-Spam aktiv. Kein Backend nötig.",
      imprintTitle:"Impressum",
      imprintSub:"Bitte mit euren echten Daten ergänzen.",
      recommended:"Empfohlen",
      build:"Zusammenstellen",
      quote:"Anfragen →",
      modalPeople:"Personenanzahl",
      modalPer:"Betrag pro Person",
      modalTotal:"Gesamtbetrag",
      add:"+ hinzufügen",
      selEmpty:"Wähle Speisen aus, um zu berechnen.",
      needPeople:"Jetzt noch Personenanzahl eintragen → dann berechnen wir den Gesamtbetrag.",
      selected:"Ausgewählt",
      applyHint:"Tipp: „Übernehmen“ schreibt die Auswahl automatisch ins Kontaktformular.",
      none:"(nichts ausgewählt)"
    },
    tr: {
      ctaTop: "Teklif iste →",
      btnMenu: "Menüyü gör",
      heroHint: "İpucu: İçerik ve galeriyi /admin üzerinden yönetebilirsin.",
      quickTitle: "Özet",
      q1: "10–300+ kişi için büfe & fingerfood",
      q2: "Vejetaryen/Vegan mümkün",
      q3: "Dakik & güvenilir",
      adminHint: "Admin: /admin",
      aboutTitle:"Hakkımızda",
      aboutSub:"Miss Lezzet – modern sunumlu Türk klasikleri.",
      howTitle:"Nasıl çalışır",
      howHint:"Alerjen/özel istekleri formda belirtin.",
      packagesTitle:"Paketler",
      packagesSub:"Hızlı seç — biz sana göre uyarlayalım.",
      teamTitle:"Ekip",
      teamSub:"Lezzeti mümkün kılan insanlar.",
      teamHint:"Ekibi admin’den düzenleyebilirsin.",
      pricesTitle:"Fiyatlar",
      pricesSub:"Tahmini — net teklif seçime ve kişi sayısına göre.",
      menuTitle:"Menü",
      menuSub:"Örnek seçenekler — isteğe göre kombine.",
      galleryTitle:"Galeri",
      gallerySub:"Resme tıkla → büyüt.",
      galleryHint:"Resim yükle & sıralamayı değiştir: /admin → Galeri.",
      socialTitle:"Yorumlar",
      socialSub:"Kısa & güven veren.",
      contactTitle:"İletişim",
      contactSub:"Kısaca yaz — hızlı döneriz.",
      contactBoxTitle:"İletişim",
      contactHint:"Formspree mesajları e-posta ile iletir.",
      fName:"Ad Soyad", fEmail:"E-posta", fDate:"Tarih", fPeople:"Kişi", fMsg:"Mesaj", fSend:"Gönder",
      fSpam:"Anti-spam aktif. Backend gerekmez.",
      imprintTitle:"Künye",
      imprintSub:"Lütfen gerçek bilgileri ekleyin.",
      recommended:"Önerilen",
      build:"Seçim yap",
      quote:"Teklif al →",
      modalPeople:"Kişi sayısı",
      modalPer:"Kişi başı",
      modalTotal:"Toplam",
      add:"+ ekle",
      selEmpty:"Hesaplamak için ürün seç.",
      needPeople:"Kişi sayısını gir → toplam hesaplanır.",
      selected:"Seçilenler",
      applyHint:"İpucu: “Uygula” seçimi iletişim formuna yazar.",
      none:"(seçilmedi)"
    },
    en: {
      ctaTop: "Request a quote →",
      btnMenu: "View menu",
      heroHint: "Tip: Manage content & gallery via /admin.",
      quickTitle: "Quick Facts",
      q1: "Buffets & finger food for 10–300+ guests",
      q2: "Vegetarian/Vegan available",
      q3: "On time & reliable",
      adminHint: "Admin: /admin",
      aboutTitle:"About",
      aboutSub:"Miss Lezzet — Turkish classics, modern presentation.",
      howTitle:"How it works",
      howHint:"Add allergies/dietary needs in the form.",
      packagesTitle:"Packages",
      packagesSub:"Pick fast — we’ll tailor everything to your event.",
      teamTitle:"Team",
      teamSub:"People behind the flavor.",
      teamHint:"Edit team in the admin panel.",
      pricesTitle:"Pricing",
      pricesSub:"Guidelines — final quote depends on selection & guest count.",
      menuTitle:"Menu",
      menuSub:"Sample options — mix & match.",
      galleryTitle:"Gallery",
      gallerySub:"Click an image → lightbox.",
      galleryHint:"Upload images & reorder: /admin → Gallery.",
      socialTitle:"Reviews",
      socialSub:"Short & trust-building.",
      contactTitle:"Contact",
      contactSub:"Send a quick note — we’ll reply fast.",
      contactBoxTitle:"Contact",
      contactHint:"Formspree forwards submissions via email.",
      fName:"Name", fEmail:"Email", fDate:"Event date", fPeople:"Guests", fMsg:"Message", fSend:"Send inquiry",
      fSpam:"Anti-spam enabled. No backend needed.",
      imprintTitle:"Imprint",
      imprintSub:"Please add your legal details.",
      recommended:"Recommended",
      build:"Customize",
      quote:"Request a quote →",
      modalPeople:"Guests",
      modalPer:"Per person",
      modalTotal:"Total",
      add:"+ add",
      selEmpty:"Select items to calculate.",
      needPeople:"Enter guests → we calculate total.",
      selected:"Selected",
      applyHint:"Tip: “Apply” adds selection to contact form.",
      none:"(none selected)"
    }
  };
  return map[LANG] || map.de;
}

// ===== Money / Calc =====
function fmtCurrency(val, currency="EUR"){
  const num = Number(val || 0);
  const locale = LANG === "tr" ? "tr-TR" : (LANG === "en" ? "en-US" : "de-DE");
  try{
    return new Intl.NumberFormat(locale, { style:"currency", currency }).format(num);
  }catch{
    return `${num.toFixed(2)} €`;
  }
}
function closePkgModal(){
  pkgModal.style.display = "none";
  pkgModal.setAttribute("aria-hidden", "true");
}
function getPeople(){
  const n = Number(pkgPeople?.value || 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function calcPerPerson(){
  let sum = 0;
  for (const v of selectedMap.values()) sum += Number(v.price || 0);
  return sum;
}
function updatePkgCalc(currency){
  const UI = uiStaticText();
  const per = calcPerPerson();
  const people = getPeople();
  const total = people > 0 ? per * people : 0;

  pkgPerPerson.textContent = fmtCurrency(per, currency);
  pkgTotal.textContent = fmtCurrency(total, currency);

  if (selectedMap.size === 0){
    pkgTotalHint.textContent = UI.selEmpty;
  } else if (people <= 0){
    pkgTotalHint.textContent = UI.needPeople;
  } else {
    const items = Array.from(selectedMap.values()).map(x => `${x.label} (${fmtCurrency(x.price, currency)})`);
    pkgTotalHint.textContent = `${UI.selected}: ${items.join(" · ")}`;
  }
}

function openPkgModal(pkg){
  const UI = uiStaticText();
  currentPkg = pkg;
  selectedMap.clear();

  const currency = pkg?.builder?.currency || "EUR";
  pkgModalTitle.textContent = `${LANG==="tr" ? "Paket" : (LANG==="en" ? "Package" : "Paket")}: ${pkg.title || ""}`;
  pkgModalDesc.textContent = pkg.desc || "";

  // Modal labels
  document.getElementById("lblPeople").textContent = UI.modalPeople;
  document.getElementById("lblPerPerson").textContent = UI.modalPer;
  document.getElementById("lblTotal").textContent = UI.modalTotal;
  document.getElementById("pkgApplyHint").textContent = UI.applyHint;

  // default people from form
  const peopleInput = document.getElementById("people");
  const existing = Number(peopleInput?.value || 0);
  pkgPeople.value = existing > 0 ? String(existing) : "";

  pkgBuilder.innerHTML = "";
  const cats = pkg?.builder?.categories || [];

  if (!cats.length){
    pkgBuilder.innerHTML = `<div class="hint">${LANG==="tr" ? "Bu paket için henüz liste yok (Admin → Paket-Konfigüratör)." :
      (LANG==="en" ? "No list saved yet for this package (Admin → Builder)." :
      "Für dieses Paket ist noch keine Auswahl-Liste hinterlegt. (Admin → Paket-Konfigurator)")}</div>`;
  } else {
    cats.forEach((cat, cIdx) => {
      const wrap = document.createElement("div");
      wrap.className = "builderCat";
      wrap.innerHTML = `<h4>${cat.title || ""}</h4>`;

      (cat.items || []).forEach((it, iIdx) => {
        const id = `cb_${cIdx}_${iIdx}`;
        const key = `${cIdx}:${iIdx}`;
        const price = Number(it?.price || 0);
        const img = it?.image ? assetUrl(it.image) : "";

        const thumbHtml = img
          ? `<img class="thumb" src="${img}" alt="${it?.label || "Preview"}" loading="lazy">`
          : `<div class="thumbPh">•</div>`;

        const row = document.createElement("div");
        row.className = "builderItem";
        row.innerHTML = `
          <label for="${id}">
            <input id="${id}" type="checkbox" data-key="${key}">
            ${thumbHtml}
            <div>
              <div style="font-weight:900">${it.label || ""}</div>
              <small>${UI.add}</small>
            </div>
          </label>
          <div style="font-weight:1000;color:var(--accent)">${fmtCurrency(price, currency)}</div>
        `;
        wrap.appendChild(row);
      });

      pkgBuilder.appendChild(wrap);
    });

    pkgBuilder.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", () => {
        const key = cb.getAttribute("data-key");
        const [cIdx, iIdx] = key.split(":").map(Number);
        const item = (cats[cIdx]?.items || [])[iIdx];
        const price = Number(item?.price || 0);

        if (cb.checked) selectedMap.set(key, { label: item?.label || "", price });
        else selectedMap.delete(key);

        updatePkgCalc(currency);
      });
    });
  }

  pkgPeople.oninput = () => updatePkgCalc(currency);

  pkgApply.onclick = () => {
    const UI2 = uiStaticText();
    const msg = document.getElementById("message");
    const peopleField = document.getElementById("people");
    const per = calcPerPerson();
    const people = getPeople();
    const total = people > 0 ? per * people : 0;

    if (peopleField && people > 0) peopleField.value = String(people);

    if (msg && currentPkg){
      const lines = Array.from(selectedMap.values())
        .map(x => `- ${x.label}: ${fmtCurrency(x.price, currency)} p.P.`)
        .join("\n");

      const header = LANG==="tr" ? "— Paket Konfigüratör —" : (LANG==="en" ? "— Package Builder —" : "— Paket-Konfigurator —");
      const lblPkg = LANG==="tr" ? "Paket" : (LANG==="en" ? "Package" : "Paket");
      const lblPeople = UI2.modalPeople;
      const lblSel = LANG==="tr" ? "Seçim (kişi başı)" : (LANG==="en" ? "Selection (pp)" : "Auswahl (p.P.)");
      const lblPer = UI2.modalPer;
      const lblTot = UI2.modalTotal;

      const block =
`\n\n${header}
${lblPkg}: ${currentPkg.title}
${lblPeople}: ${people || "-"}
${lblSel}:
${lines || `- ${UI2.none}`}
${lblPer}: ${fmtCurrency(per, currency)}
${lblTot}: ${people > 0 ? fmtCurrency(total, currency) : "-"}
`;
      msg.value += block;
    }

    closePkgModal();
    location.hash = "#kontakt";
  };

  pkgReset.onclick = () => {
    pkgBuilder.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
    selectedMap.clear();
    updatePkgCalc(currency);
  };

  updatePkgCalc(currency);

  pkgModal.style.display = "flex";
  pkgModal.setAttribute("aria-hidden", "false");
}

pkgModalClose.addEventListener("click", closePkgModal);
pkgModal.addEventListener("click", (e) => { if (e.target === pkgModal) closePkgModal(); });

// ===== Load Content =====
async function loadContent(){
  const res = await fetch("./content.json", { cache: "no-store" });
  SITE = await res.json();
  render();
  setLang(LANG);
}
loadContent().catch(console.error);

// ===== Render =====
function render(){
  if(!SITE) return;
  const UI = uiStaticText();

  // UI labels
  document.getElementById("ctaTop").textContent = UI.ctaTop;
  document.getElementById("btnMenu").textContent = UI.btnMenu;
  document.getElementById("heroHint").innerHTML = UI.heroHint.replace("/admin","<b>/admin</b>");
  document.getElementById("quickTitle").textContent = UI.quickTitle;
  document.getElementById("q1").textContent = UI.q1;
  document.getElementById("q2").textContent = UI.q2;
  document.getElementById("q3").textContent = UI.q3;
  document.getElementById("adminHint").textContent = UI.adminHint;

  document.getElementById("aboutTitle").textContent = UI.aboutTitle;
  document.getElementById("aboutSub").textContent = UI.aboutSub;
  document.getElementById("howTitle").textContent = UI.howTitle;
  document.getElementById("howHint").textContent = UI.howHint;

  document.getElementById("packagesTitle").textContent = UI.packagesTitle;
  document.getElementById("packagesSub").textContent = UI.packagesSub;

  document.getElementById("teamTitle").textContent = UI.teamTitle;
  document.getElementById("teamSub").textContent = UI.teamSub;
  document.getElementById("teamHint").textContent = UI.teamHint;

  document.getElementById("pricesTitle").textContent = UI.pricesTitle;
  document.getElementById("pricesSub").textContent = UI.pricesSub;

  document.getElementById("menuTitle").textContent = UI.menuTitle;
  document.getElementById("menuSub").textContent = UI.menuSub;

  document.getElementById("galleryTitle").textContent = UI.galleryTitle;
  document.getElementById("gallerySub").textContent = UI.gallerySub;
  document.getElementById("galleryHint").textContent = UI.galleryHint;

  document.getElementById("socialTitle").textContent = UI.socialTitle;
  document.getElementById("socialSub").textContent = UI.socialSub;

  document.getElementById("contactTitle").textContent = UI.contactTitle;
  document.getElementById("contactSub").textContent = UI.contactSub;
  document.getElementById("contactBoxTitle").textContent = UI.contactBoxTitle;
  document.getElementById("contactHint").textContent = UI.contactHint;

  document.getElementById("fName").textContent = UI.fName;
  document.getElementById("fEmail").textContent = UI.fEmail;
  document.getElementById("fDate").textContent = UI.fDate;
  document.getElementById("fPeople").textContent = UI.fPeople;
  document.getElementById("fMsg").textContent = UI.fMsg;
  document.getElementById("fSend").textContent = UI.fSend;
  document.getElementById("fSpam").textContent = UI.fSpam;

  document.getElementById("imprintTitle").textContent = UI.imprintTitle;
  document.getElementById("imprintSub").textContent = UI.imprintSub;

  // Fix logo URLs for GitHub Pages
  document.querySelectorAll('img.logoImg').forEach(img => {
    const src = img.getAttribute("src") || "images/Logo.png";
    img.setAttribute("src", assetUrl(src));
  });

  // Brand
  const brandName = t(SITE.brand?.name) || "Miss Lezzet";
  document.getElementById("brandName").textContent = brandName;
  document.getElementById("brandTagline").textContent = t(SITE.brand?.tagline) || "";
  document.getElementById("brandNameFooter").textContent = brandName;
  document.getElementById("brandNameFoot2").textContent = brandName;
  document.title = `${brandName} – Turkish Catering`;

  // Hero (CMS)
  document.getElementById("heroKicker").textContent = t(SITE.hero?.kicker);
  document.getElementById("heroHeadline").textContent = t(SITE.hero?.headline);
  document.getElementById("heroSub").textContent = t(SITE.hero?.sub);

  // About
  document.getElementById("aboutText").textContent = t(SITE.about?.text);
  const bullets = document.getElementById("aboutBullets");
  bullets.innerHTML = "";
  tList(SITE.about?.bullets).forEach(b => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="dot"></span><span>${b}</span>`;
    bullets.appendChild(li);
  });

  // Packages + Modal open buttons
  const pg = document.getElementById("packagesGrid");
  pg.innerHTML = "";

  const pkgList = tList(SITE.packages);

  pkgList.forEach((p, idx) => {
    const title = (p.title || "").toLowerCase();
    const isFeatured =
      title.includes("family") || title.includes("friends") ||
      title.includes("büfe") || title.includes("buffet");

    const card = document.createElement("div");
    card.className = "card reveal";
    card.style.gridColumn = isFeatured ? "span 12" : "span 6";
    if(isFeatured) card.classList.add("packageFeatured");

    const feats = (p.features || []).map(x => `<li style="margin:6px 0;color:var(--muted)">${x}</li>`).join("");

    card.innerHTML = `
      ${isFeatured ? `<div class="packageBadgeTop">${UI.recommended}</div>` : ""}

      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">
        <div>
          <div style="font-weight:1000;font-size:16px">${p.title || ""}</div>
          <div style="color:var(--muted);margin-top:6px;line-height:1.6">${p.desc || ""}</div>
        </div>
        <div style="text-align:right">
          ${p.badge ? `<div style="display:inline-block;padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.04);font-weight:1000;color:var(--accent);font-size:12px">${p.badge}</div>` : ""}
          <div style="margin-top:10px;font-weight:1000;color:var(--accent)">${p.price || ""}</div>
        </div>
      </div>

      ${p.image ? `
        <div style="margin-top:12px;border-radius:18px;overflow:hidden;border:1px solid var(--line)">
          <img src="${assetUrl(p.image)}" alt="${p.title || "Paket"}" style="width:100%;height:${isFeatured ? "280px" : "200px"};object-fit:cover;display:block;opacity:.95">
        </div>` : ""}

      ${feats ? `<ul style="margin:12px 0 0;padding-left:18px">${feats}</ul>` : ""}

      <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
        <button class="btn" type="button" data-pkg-idx="${idx}">${UI.build}</button>
        <a class="btn primary" href="#kontakt">${UI.quote}</a>
      </div>
    `;
    pg.appendChild(card);
    obs.observe(card);
  });

  document.querySelectorAll("[data-pkg-idx]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-pkg-idx"));
      const pkg = pkgList[idx];
      openPkgModal(pkg);
    });
  });

  // Team
  const teamGrid = document.getElementById("teamGrid");
  teamGrid.innerHTML = "";
  tList(SITE.team).forEach(p => {
    const initials = (p.initials || (p.name || "").split(" ").slice(0,2).map(x => x[0]).join("")).toUpperCase();
    const card = document.createElement("div");
    card.className = "card teamCard reveal";
    card.innerHTML = `
      <div class="teamRow">
        <div class="avatar">${initials || "ML"}</div>
        <div>
          <div style="font-weight:1000">${p.name || ""}</div>
          <div class="role">${p.role || ""}</div>
        </div>
      </div>
      <p style="color:var(--muted); margin:12px 0 0; line-height:1.7; font-size:14px">${p.text || ""}</p>
    `;
    teamGrid.appendChild(card);
    obs.observe(card);
  });

  // Pricing
  const pricingGrid = document.getElementById("pricingGrid");
  pricingGrid.innerHTML = "";
  tList(SITE.pricing).forEach(cat => {
    const wrap = document.createElement("div");
    wrap.className = "card priceCard reveal";
    const items = (cat.items || []).map(it => `
      <div class="priceLine"><span>${it.label || ""}</span><b>${it.value || ""}</b></div>
    `).join("");
    wrap.innerHTML = `
      <div style="font-weight:1000; font-size:16px">${cat.title || ""}</div>
      ${items}
      ${cat.hint ? `<div class="hint" style="margin-top:8px">${cat.hint}</div>` : ``}
    `;
    pricingGrid.appendChild(wrap);
    obs.observe(wrap);
  });

  // Menu
  const menuGrid = document.getElementById("menuGrid");
  menuGrid.innerHTML = "";
  tList(SITE.menu).forEach(cat => {
    const wrap = document.createElement("div");
    wrap.className = "card menuCard reveal";
    const chips = (cat.items || []).map(x => `<span class="chip">${x}</span>`).join("");
    wrap.innerHTML = `
      <div style="font-weight:1000; font-size:16px">${cat.title || ""}</div>
      <div class="chips">${chips}</div>
      ${cat.hint ? `<p class="hint" style="margin:10px 0 0">${cat.hint}</p>` : ``}
    `;
    menuGrid.appendChild(wrap);
    obs.observe(wrap);
  });

  // Gallery
  const galleryGrid = document.getElementById("galleryGrid");
  galleryGrid.innerHTML = "";
  tList(SITE.gallery).forEach(item => {
    const src = assetUrl(item.image);
    const cap = item.caption || "";
    const tile = document.createElement("div");
    tile.className = "g";
    tile.innerHTML = `<img src="${src}" alt="${cap}"><span>${cap}</span>`;
    tile.addEventListener("click", () => {
      lbImg.src = src;
      lbCap.textContent = cap;
      lb.style.display = "flex";
    });
    galleryGrid.appendChild(tile);
  });

  // Social
  const socialGrid = document.getElementById("socialGrid");
  socialGrid.innerHTML = "";
  tList(SITE.social).forEach(s => {
    const card = document.createElement("div");
    card.className = "card reveal";
    card.style.gridColumn = "span 6";
    card.innerHTML = `
      <div style="font-weight:1000">${s.title || ""}</div>
      <div style="margin-top:10px;color:var(--muted);line-height:1.6">${s.text || ""}</div>
    `;
    socialGrid.appendChild(card);
    obs.observe(card);
  });

  // Contact
  document.getElementById("contactCity").textContent = t(SITE.contact?.city);
  document.getElementById("contactPhone").textContent = t(SITE.contact?.phone);
  document.getElementById("contactEmail").textContent = SITE.contact?.email || "";

  // Imprint
  document.getElementById("imprintBox").innerHTML = t(SITE.imprintHtml);
}
