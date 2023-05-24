var ext_langs = [
  "ar",
  "af",
  "az",
  "bg",
  "cz",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fa",
  "fi",
  "fr",
  "hu",
  "it",
  "is",
  "ja",
  "ko",
  "lt",
  "lv",
  "mk",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "tr",
  "uk",
  "ur",
  "uz",
  "zh",
];

var ext_lang_names_ru = {
  ar: "Арабский",
  af: "Африкаанс",
  az: "Азербайджанский",
  bg: "Болгарский",
  cz: "Чешский",
  de: "Немецкий",
  el: "Греческий",
  en: "Английский",
  es: "Испанский",
  et: "Эстонский",
  fa: "Персидский",
  fi: "Финский",
  fr: "Французский",
  hu: "Венгерский",
  it: "Итальянский",
  is: "Исландский",
  ja: "Японский",
  ko: "Корейский",
  lt: "Латвийский",
  lv: "Литовский",
  mk: "Македонский",
  nl: "Голландский",
  no: "Норвежский",
  pl: "Польский",
  pt: "Португальский",
  ro: "Румынский",
  ru: "Русский",
  sk: "Словацкий",
  sl: "Словенский",
  sv: "Шведский",
  tr: "Турецкий",
  uk: "Украинский",
  ur: "Урду",
  uz: "Узбекский",
  zh: "Китайский",
};

var ext_lang_alikes = {
  ar: ["fa", "ur"],
  af: ["nl"],
  az: ["tr", "uz"],
  bg: ["mk"],
  cz: ["pl", "sk"],
  de: ["nl"],
  el: [],
  en: [],
  es: ["pt"],
  et: ["fi"],
  fa: ["ar", "ur"],
  fi: ["et"],
  fr: ["it"],
  hu: ["ro"],
  it: ["fr"],
  is: ["no", "sv"],
  ja: ["ko", "zh"],
  ko: ["ja", "zh"],
  lt: ["lv"],
  lv: ["lt"],
  nl: ["af"],
  no: ["sv", "is"],
  mk: ["bg"],
  pl: ["cz"],
  pt: ["es"],
  ro: ["hu"],
  ru: ["uk"],
  sk: ["sl", "cz"],
  sl: ["sk", "cz"],
  sv: ["no", "is"],
  tr: ["uz", "az"],
  uk: ["ru"],
  ur: ["ar", "fa"],
  uz: ["tr", "az"],
  zh: ["ko", "ja"],
};

var ext_lang_price = {
  ar: 15,
  af: 15,
  az: 15,
  bg: 15,
  cz: 10,
  de: 5,
  el: 5,
  en: 5,
  es: 10,
  et: 10,
  fa: 15,
  fi: 10,
  fr: 5,
  hu: 10,
  it: 5,
  is: 10,
  ja: 10,
  ko: 10,
  lt: 10,
  lv: 10,
  nl: 15,
  no: 10,
  mk: 10,
  pl: 10,
  pt: 10,
  ro: 10,
  ru: 5,
  sk: 10,
  sl: 10,
  sv: 10,
  tr: 15,
  uk: 5,
  ur: 15,
  uz: 15,
  zh: 10,
};

var ext_lang;
var ext_query;

var ext_stats = {
  tries: 0,
  score: 0,
  points: 0,
  last_win: 0,
  price: 0,
  langs_excluded: 0,
  max_langs_excluded: 5,
};

function queryExtract(lang) {
  var exscript = $('<script id="ex_script"></script>');
  exscript.attr(
    "src",
    "http://" +
      lang +
      ".wikipedia.org/w/api.php?action=query&prop=extracts&exintro&exsentences=4&explaintext&generator=random&grnnamespace=0&format=json&formatversion=2&callback=renderExtract"
  );
  $("#exlang").append(exscript);
}

function renderExtract(ext) {
  ext_query = ext.query;
  $("#ex_div").text(ext_query.pages[0].extract);
  $("#ex_status_price").text(ext_stats.price);
  $("#ex_status_ques").show();
}

function renderAnswers(ans) {
  $("#ex_ans").empty();
  for (i = 0; i < 4; i++) {
    var ans_elt = $("<a></a>");
    ans_elt
      .text(ext_lang_names_ru[ans[i]])
      .attr("id", "ex_ans_" + ans[i])
      .addClass("ex_ans")
      .attr("href", 'javascript:selectAnswer("' + ans[i] + '")');
    $("#ex_ans").append(ans_elt);
  }
}

function renderNewgame() {
  $("#ex_script").remove();
  $("#ex_div").text("Loading...");
  $("#ex_statusdiv > *").hide();
}

function renderEndgame(lang) {
  $("#ex_ans .ex_ans").attr("href", "#").css("color", "black");
  $("#ex_ans #ex_ans_" + lang).css("color", "red");
  $("#ex_ans #ex_ans_" + ext_lang).css("color", "green");
  $("#ex_score").text(ext_stats.points + " (" + ext_stats.score + "/" + ext_stats.tries + ")");
  $("#ex_statusdiv > *").hide();
  if (ext_stats.last_win >= 0)
    $(ext_stats.last_win == 1 ? "#ex_status_right" : "#ex_status_wrong").show();
  else if (lang == "exclude") $("#ex_status_exclude").show();
  $("#ex_status_orig_link")
    .attr(
      "href",
      "http://" + ext_lang + ".wikipedia.org/w/index.php?curid=" + ext_query.pages[0].pageid
    )
    .text(ext_query.pages[0].title);
  $("#ex_status_orig").show();
}

function refreshExtract() {
  renderNewgame();
  shuffleArray(ext_langs);
  var lang = ext_langs[0];
  console.log(lang);
  ext_stats.price = ext_lang_price[lang];
  queryExtract(lang);
  var ans = [lang];
  shuffleArray(ext_lang_alikes[lang]);
  if (ext_lang_alikes[lang].length > 0) {
    ans.push(ext_lang_alikes[lang][0]);
  }
  for (i = 1; ans.length < 4; i++)
    if (ans.length < 2 || ans[1] != ext_langs[i]) ans.push(ext_langs[i]);
  shuffleArray(ans);
  ext_lang = lang;
  renderAnswers(ans);
}

function selectAnswer(lang) {
  if (lang == ext_lang) {
    ext_stats.score++;
    ext_stats.points += ext_stats.price;
    ext_stats.last_win = 1;
  } else {
    ext_stats.last_win = 0;
  }
  ext_stats.tries++;
  renderEndgame(lang);
}

function excludeLanguage() {
  console.log("excluded: " + ext_lang);
  ext_langs.splice(ext_langs.indexOf(ext_lang), 1);
  ext_stats.langs_excluded++;
  ext_stats.last_win = -1;
  renderEndgame("exclude");
}

function shuffleArray(d) {
  for (var c = d.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d;
}
