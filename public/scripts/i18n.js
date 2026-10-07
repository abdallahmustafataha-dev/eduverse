(function () {
  "use strict";

  var STORAGE_KEY = "eduverse:lang";
  var LOCALES = { en: "ltr", ar: "rtl" };
  var DEFAULT_LANG = "en";

  var DICT = {
    en: {
      "board.sub": "Local identity prototype · 3 directions",
      "board.eyebrow": "Identity exploration",
      "board.title": "Three heroes, one brand",
      "board.lede":
        "Same EduVerse palette family, same approved copy skeleton, three different readings of the first screen. Each miniature is a real responsive hero: it responds to its own width, not the browser window.",
      "board.hint1": "on a card to read it full width.",
      "board.hint2": "inverts the chrome only.",

      "ui.theme": "Theme",
      "ui.light": "Light",
      "ui.dark": "Dark",
      "ui.language": "Language",
      "ui.fonts": "Fonts",
      "ui.webfonts": "Webfonts",
      "ui.fallback": "Fallback",
      "ui.recommended": "Recommended",
      "ui.expand": "Expand",
      "ui.collapse": "Collapse",

      "cta.start": "Start your journey",
      "cta.explore": "Explore grades",

      "grade.s1": "Secondary 1",
      "grade.s2": "Secondary 2",
      "grade.s3": "Secondary 3",
      "grade.u1": "University 1",
      "grade.u2": "University 2",

      "road.g1": "Primary 1",
      "road.g2": "Primary 2",
      "road.g3": "Primary 3",
      "road.g4": "Primary 4",
      "road.g5": "Primary 5",
      "road.g6": "Primary 6",
      "road.g7": "Preparatory 1",
      "road.g8": "Preparatory 2",
      "road.g9": "Preparatory 3",
      "road.g10": "Secondary 1",
      "road.g11": "Secondary 2",
      "road.g12": "Secondary 3",

      "road.list": "The twelve grades, in order",
      "road.station": "Station {{n}} of {{t}}",
      "road.start": "Start",
      "road.finish": "Secondary 3 — you are ready",
      "road.explore": "Explore a grade",

      "sub.physics": "Physics",
      "sub.chemistry": "Chemistry",
      "sub.biology": "Biology",

      "stat.grades": "grades",
      "stat.subjects": "subjects",
      "stat.curricula": "Egyptian curricula only",

      "a.name": "Maroon Editorial",
      "a.eyebrow": "THE JEWEL OF EDUCO.",
      "a.title": "Everything the Egyptian student needs.",
      "a.sub":
        "Egyptian curricula only — all grades, all subjects, one calm place to study.",
      "a.stats": "Egyptian curricula only",
      "a.note":
        "Paper field with a serif headline and one editorial rule. Reads calm and academic; the logo floats on a white card so the mark never sits on maroon.",

      "b.name": "Deep Maroon Stage",
      "b.eyebrow": "ONE PLACE. EVERY SUBJECT.",
      "b.title": "Your whole secondary year, on a single page.",
      "b.sub":
        "Egyptian Ministry curricula — lessons, revision and exams, without jumping between ten tabs.",
      "b.note":
        "Full-bleed maroon stage with a glow and an orbit ring. Highest contrast of the three; the light logo rides a paper card at the base.",

      "c.name": "Paper & Gold",
      "c.eyebrow": "STUDY SMARTER, NOT LONGER",
      "c.title": "Revision that fits in one evening.",
      "c.sub":
        "Egyptian curricula arranged by grade and subject, so the next step is always obvious.",
      "c.stats": "Free core content. Sponsored, never sold.",
      "c.note":
        "Warm ivory with a brass accent and a preview of real lesson cards. Shows the product instead of describing it; the most energetic of the three.",
      "c.preview1": "Optics · Unit 3 · 12 lessons",
      "c.preview2": "Organic · Unit 1 · 9 lessons",
      "c.preview3": "Genetics · 14 lessons",

      "meta.light": "Light-first",
      "meta.dark": "Dark stage",
      "meta.serif": "Serif display",
      "meta.gentle": "Gentle motion",
      "meta.drama": "Dramatic",
      "meta.expressive": "Expressive motion",
      "meta.product": "Product-forward",
      "meta.energy": "High energy",

      "footer.note":
        "No backend, no build step, no deploy. Copy is written for this comparison and not final marketing copy.",

      "primary.sub": "Paper & Gold · primary",
      "primary.label": "Viewport",
      "primary.desktop": "Desktop 1280",
      "primary.tablet": "Tablet 834",
      "primary.mobile": "Mobile 390",
      "primary.back": "Back to the 3-direction board",
      "primary.caption": "Rendered container width",
      "primary.note":
        "Same direction-c.css as the board — only the stage width changes. The breakpoints are container queries, so these three buttons move the layout exactly the way a real browser window would.",

      "land.skip": "Skip to content",
      "land.nav": "Main",
      "land.vision": "Vision",
      "land.founder": "Founder",
      "land.start": "Start",
      "land.login": "Log in",

      "land.hero.eyebrow": "THE JEWEL OF EDUCO.",
      "land.hero.title": "Everything the Egyptian student needs.",
      "land.hero.sub":
        "Egyptian curricula only — all grades, all subjects, one calm place to study.",
      "land.hero.footnote": "Free core content. Sponsored, never sold.",

      "land.kicker.vision": "WHY EDUVERSE EXISTS",
      "land.title.vision": "Built on the national curriculum, not around it.",
      "vision.g1": "1M concurrent users one day.",
      "vision.g2": "Curriculum-grounded AI, never hallucinations (via EduChat).",
      "vision.g3": "Free core content forever — sponsors + paid courses fund it.",

      "land.kicker.founder": "MEET THE FOUNDER",
      "land.title.founder": "Started at fourteen, for every Egyptian student.",
      "founder.name": "Abdallah Mustafa Taha",
      "founder.role": "Founder, EduCo.",
      "founder.text":
        "Abdallah Mustafa Taha, 14, founded EduCo. to give every Egyptian student everything they need in one place.",
      "founder.portrait": "Portrait slot — photo to be supplied",

      "land.kicker.final": "YOUR ROAD STARTS HERE",
      "land.title.final": "Ready to start?",
      "land.sub.final": "Create your EduID and pick up where Primary 1 leaves off.",

      "foot.family": "The EduCo. family",
      "foot.eduverse": "EduVerse — Students",
      "foot.educo": "EduCo.",
      "foot.educhat": "EduChat",
      "foot.tbd": "Fourth app — TBD",
      "foot.account": "Account",
      "foot.login": "Log in",
      "foot.signup": "Create EduID",
      "foot.privacy": "Privacy",
      "foot.terms": "Terms",
      "foot.contact": "Contact",
      "foot.language": "Language",
      "foot.theme": "Theme",
      "foot.rights": "© 2026 EduCo. All rights reserved.",
      "foot.note": "Egyptian Ministry curricula only. No international content in v1."
    },

    ar: {
      "board.sub": "نموذج هوية محلي · 3 اتجاهات",
      "board.eyebrow": "استكشاف الهوية",
      "board.title": "3 هيروهات، براند واحد",
      "board.lede":
        "نفس عائلة ألوان EduVerse، ونفس هيكل الكوبّي المعتمد، بس ثلاث قراءات مختلفة للشاشة الأولى. كل مصغّرة هيرو حقيقية وبتستجيب لعرضها هي، مش لعرض المتصفح.",
      "board.hint1": "على أي كارت علشان تقراه بالعرض الكامل.",
      "board.hint2": "بيقلب هيكل الصفحة بس.",

      "ui.theme": "الثيم",
      "ui.light": "فاتح",
      "ui.dark": "داكن",
      "ui.language": "اللغة",
      "ui.fonts": "الخطوط",
      "ui.webfonts": "خطوط ويب",
      "ui.fallback": "بديل",
      "ui.recommended": "الموصى به",
      "ui.expand": "كبّر",
      "ui.collapse": "صغّر",

      "cta.start": "ابدأ رحلتك",
      "cta.explore": "استكشف الصفوف",

      "grade.s1": "ثانوي 1",
      "grade.s2": "ثانوي 2",
      "grade.s3": "ثانوي 3",
      "grade.u1": "جامعة 1",
      "grade.u2": "جامعة 2",

      "road.g1": "أولى ابتدائي",
      "road.g2": "ثانية ابتدائي",
      "road.g3": "ثالثة ابتدائي",
      "road.g4": "رابعة ابتدائي",
      "road.g5": "خامسة ابتدائي",
      "road.g6": "سادسة ابتدائي",
      "road.g7": "أولى إعدادي",
      "road.g8": "ثانية إعدادي",
      "road.g9": "ثالثة إعدادي",
      "road.g10": "أولى ثانوي",
      "road.g11": "تانية ثانوي",
      "road.g12": "ثالثة ثانوي",

      "road.list": "الصفوف الاثنا عشر، بالترتيب",
      "road.station": "محطة {{n}} من {{t}}",
      "road.start": "البداية",
      "road.finish": "ثالثة ثانوي — أنت جاهز",
      "road.explore": "استكشف صف",

      "sub.physics": "فيزياء",
      "sub.chemistry": "كيمياء",
      "sub.biology": "أحياء",

      "stat.grades": "صف",
      "stat.subjects": "مادة",
      "stat.curricula": "مناهج مصرية فقط",

      "a.name": "المارون التحريري",
      "a.eyebrow": "جوهرة إديوكو",
      "a.title": "كل اللي يحتاجه الطالب المصري.",
      "a.sub": "مناهج مصرية فقط — كل الصفوف، كل المواد، مكان هادي للمذاكرة.",
      "a.stats": "مناهج مصرية فقط",
      "a.note":
        "خلفية ورقية بعنوان serif وقاعدة تحريرية واحدة. الحاسس هادي ودرسي، واللوجو معمول على كارت أبيض عشان العلامة عمر ما تقعد فوق المارون.",

      "b.name": "مسرح المارون الغامق",
      "b.eyebrow": "مكان واحد. كل المواد.",
      "b.title": "ثانويتك كاملة في صفحة واحدة.",
      "b.sub":
        "مناهج وزارة التربية والتعليم — دروس ومراجعة وامتحانات، من غير ما تنط بين عشر تبويبات.",
      "b.note":
        "مسرح المارون بعرض كامل مع توهج وحلقة مدارية. أعلى تباين بين الثلاثة، واللوجو الفاتح راكب على كارت ورقي في الأسفل.",

      "c.name": "ورقي وذهبي",
      "c.eyebrow": "ذاكر أذكى مش أطول",
      "c.title": "مراجعة تنتهي في مسايدة واحدة.",
      "c.sub":
        "مناهج مصرية مرتبة حسب الصف والمادة، فالخطوة الجاية دايمًا واضحة.",
      "c.stats": "محتوى أساسي مجاني. مدعوم بالإعلانات، مش مباع.",
      "c.note":
        "عاجي دافي مع لمسة نحاسية ومعاينة لكروت دروس حقيقية. بيوريد المنتج بدل ما يوصفه، وهو أعلى الثلاثة طاقة.",
      "c.preview1": "البصريات · الوحدة 3 · 12 درس",
      "c.preview2": "عضوي · الوحدة 1 · 9 دروس",
      "c.preview3": "الوراثة · 14 درس",

      "meta.light": "فاتح أساسي",
      "meta.dark": "خلفية غامقة",
      "meta.serif": "عناوين serif",
      "meta.gentle": "حركة هادية",
      "meta.drama": "درامي",
      "meta.expressive": "حركة تعبيرية",
      "meta.product": "يوريد المنتج",
      "meta.energy": "طاقة عالية",

      "footer.note":
        "مفيش backend، مفيش build، مفيش deploy. الكوبّي ده مكتوب للمقارنة دي ومش كوبي تسويقي نهائي.",

      "primary.sub": "ورقي وذهبي · الأساسي",
      "primary.label": "العرض",
      "primary.desktop": "ديسكتوب 1280",
      "primary.tablet": "تابلت 834",
      "primary.mobile": "موبايل 390",
      "primary.back": "ارجع للبورد",
      "primary.caption": "عرض الحاوية الفعلي",
      "primary.note":
        "نفس direction-c.css بتاع البورد — اللي بيتغير بس هو عرض المسرح. الـ breakpoints كلها container queries، فالأزرار التلاتة بتحرّك التصميم بالظبط زي ما المتصفح هيحرّكه.",

      "land.skip": "تخطَّ إلى المحتوى",
      "land.nav": "القائمة",
      "land.vision": "الرؤية",
      "land.founder": "المؤسس",
      "land.start": "ابدأ",
      "land.login": "تسجيل الدخول",

      "land.hero.eyebrow": "جوهرة إديوكو",
      "land.hero.title": "كل اللي يحتاجه الطالب المصري.",
      "land.hero.sub": "مناهج مصرية فقط — كل الصفوف، كل المواد، مكان هادي للمذاكرة.",
      "land.hero.footnote": "محتوى أساسي مجاني. مدعوم بالإعلانات، مش مباع.",

      "land.kicker.vision": "ليه إديفيرس موجودة",
      "land.title.vision": "مبنية على المنهج الوطني، مش حواليه.",
      "vision.g1": "مليون مستخدم في نفس اللحظة، يوم من الأيام.",
      "vision.g2": "ذكاء اصطناعي مربوط بالمنهج، من غير اختلاقات (عبر EduChat).",
      "vision.g3": "محتوى أساسي مجاني للأبد — الرعاية والمدفوعات بتموّلّه.",

      "land.kicker.founder": "اتعرف على المؤسس",
      "land.title.founder": "بدأ وهو عنده أربعطعشنة، عشان كل طالب مصري.",
      "founder.name": "عبدالله مصطفى طه",
      "founder.role": "مؤسس إديوكو",
      "founder.text":
        "عبدالله مصطفى طه، 14 سنة، أسس إديوكو عشان كل طالب مصري يلاقي كل اللي يحتاجه في مكان واحد.",
      "founder.portrait": "مكان الصورة — هتتسلّم لاحقًا",

      "land.kicker.final": "رحلتك بتبدأ هنا",
      "land.title.final": "جاهز تبدأ؟",
      "land.sub.final": "اعمل EduID وكمّل من حيث الابتدائي الأول وقف.",

      "foot.family": "عائلة إديوكو",
      "foot.eduverse": "إديفيرس — الطلاب",
      "foot.educo": "إديوكو",
      "foot.educhat": "إديتشات",
      "foot.tbd": "التطبيق الرابع — قيد التحديد",
      "foot.account": "الحساب",
      "foot.login": "تسجيل الدخول",
      "foot.signup": "أنشئ EduID",
      "foot.privacy": "الخصوصية",
      "foot.terms": "الشروط",
      "foot.contact": "تواصل",
      "foot.language": "اللغة",
      "foot.theme": "الثيم",
      "foot.rights": "© 2026 إديوكو. كل الحقوق محفوظة.",
      "foot.note": "مناهج وزارة التربية والتعليم فقط. من غير محتوى دولي في الإصدار الأول."
    }
  };

  var root = document.documentElement;

  function read() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored && LOCALES[stored] ? stored : DEFAULT_LANG;
    } catch (err) {
      return DEFAULT_LANG;
    }
  }

  function write(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      return;
    }
  }

  var TEMPLATE = /\{\{(\w+)\}\}/g;

  function interpolate(value, vars) {
    if (value.indexOf("{{") === -1) {
      return value;
    }

    var lookup =
      typeof vars === "string" && vars.charAt(0) === "{" ? safeParse(vars) : vars;

    if (!lookup) {
      return value;
    }

    return value.replace(TEMPLATE, function (match, name) {
      return lookup[name] === undefined ? match : String(lookup[name]);
    });
  }

  function safeParse(text) {
    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }

  function t(key, vars) {
    var lang = current();
    var value = DICT[lang][key];

    if (value === undefined) {
      value = DICT[DEFAULT_LANG][key];
    }

    return value === undefined ? key : interpolate(value, vars);
  }

  function current() {
    var lang = read();

    return LOCALES[lang] ? lang : DEFAULT_LANG;
  }

  function translate(lang) {
    var table = DICT[lang] || DICT[DEFAULT_LANG];
    var nodes = document.querySelectorAll("[data-i18n]");

    for (var i = 0; i < nodes.length; i += 1) {
      var key = nodes[i].getAttribute("data-i18n");
      var value = table[key];

      if (value === undefined) {
        value = DICT[DEFAULT_LANG][key];
      }

      if (value !== undefined) {
        nodes[i].textContent = interpolate(value, nodes[i].getAttribute("data-i18n-var"));
      }
    }

    var ariaNodes = document.querySelectorAll("[data-i18n-aria]");

    for (var j = 0; j < ariaNodes.length; j += 1) {
      var ariaKey = ariaNodes[j].getAttribute("data-i18n-aria");
      var ariaValue = table[ariaKey] || DICT[DEFAULT_LANG][ariaKey];

      if (ariaValue !== undefined) {
        ariaNodes[j].setAttribute("aria-label", ariaValue);
      }
    }
  }

  function apply(lang) {
    root.setAttribute("lang", lang);
    root.setAttribute("dir", LOCALES[lang]);

    var buttons = document.querySelectorAll("[data-lang-set]");

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute(
        "aria-pressed",
        buttons[i].getAttribute("data-lang-set") === lang ? "true" : "false",
      );
    }

    translate(lang);

    document.dispatchEvent(
      new CustomEvent("eduverse:locale", { detail: { lang: lang } }),
    );
  }

  window.EduVerseI18n = { t: t, apply: apply, current: current };

  apply(read());

  function onClick(event) {
    var target = event.target.closest("[data-lang-set]");

    if (!target) {
      return;
    }

    var lang = target.getAttribute("data-lang-set");

    if (!LOCALES[lang]) {
      return;
    }

    write(lang);
    apply(lang);
  }

  function onReady() {
    apply(read());
    document.addEventListener("click", onClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();