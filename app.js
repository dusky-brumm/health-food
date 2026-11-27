"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const money = (amount) => `${new Intl.NumberFormat("ru-KZ").format(amount)} ₸`;
const icon = (name) =>
  `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const plans = JSON.parse($("#program-data").textContent);
const siteRoot = new URL(document.body.dataset.root || "./", document.baseURI);
const asset = (name) => new URL(`assets/${name}`, siteRoot).href;
const requestedDays = Number(new URLSearchParams(location.search).get("days"));
const state = { program: document.body.dataset.activeProgram || "balance", duration: [1,5,20].includes(requestedDays) ? requestedDays : 1, day: 0 };

// Keep the original React/GSAP carousel off the initial loading path.
const orbitHost = $("#dish-orbit-root");
let orbitLoading = false;
function loadDishOrbit() {
  if (orbitLoading || !orbitHost) return;
  orbitLoading = true;
  const openWeeklyMenu = () => {
    $("#weekly-menu").open = true;
    $("#weekly-menu").scrollIntoView({ behavior: "auto" });
  };
  import(asset("dish-orbit/dish-orbit.js"))
    .then(({ mountDishOrbit }) =>
      mountDishOrbit(orbitHost, {
        onPrograms: () => $("#programs").scrollIntoView({ behavior: "auto" }),
        onWeeklyMenu: openWeeklyMenu,
      }),
    )
    .catch(() => {
      orbitHost.setAttribute("aria-busy", "false");
      orbitHost.classList.add("orbit-failed");
      orbitHost.replaceChildren();
      const message = document.createElement("p");
      message.textContent =
        "Карусель не загрузилась. Меню на неделю доступно ниже.";
      const fallback = document.createElement("button");
      fallback.className = "button";
      fallback.textContent = "Открыть меню недели";
      fallback.addEventListener("click", openWeeklyMenu);
      orbitHost.append(message, fallback);
    });
}
if (orbitHost && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        loadDishOrbit();
      }
    },
    { rootMargin: "600px" },
  );
  observer.observe(orbitHost);
} else {
  loadDishOrbit();
}

const daysText = (count) => (count === 1 ? "1 день" : `${count} дней`);

function updatePlan() {
  const plan = plans[state.program];
  $$("[data-duration]").forEach((button) => {
    const selected = Number(button.dataset.duration) === state.duration;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const labels = {
    "plan-name": plan.name, "plan-calories": plan.kcal,
    "plan-description": plan.description, "plan-meals": plan.meals,
    "plan-price": money(plan.price),
    "plan-days-label": state.duration === 1 ? "Пробный день" : daysText(state.duration),
    "plan-total-label": `За ${daysText(state.duration)} — от`,
    "plan-total": money(plan.price * state.duration),
  };
  Object.entries(labels).forEach(([id, text]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  });
  $$("[data-plan-total]").forEach(element => {
    element.textContent = money(plans[element.dataset.planTotal].price * state.duration);
  });
  $$("[data-plan-days]").forEach(element => element.textContent = daysText(state.duration));
  $$("[data-program-detail]").forEach(link => {
    const plan = plans[link.dataset.programDetail];
    link.href = new URL(`programs/${plan.slug}/?days=${state.duration}`, siteRoot).href;
  });
}
$$("[data-duration]").forEach((button) =>
  button.addEventListener("click", () => {
    state.duration = Number(button.dataset.duration);
    updatePlan();
  }),
);

const baseMeals = [
  {
    type: "Завтрак",
    time: "08:00–09:00",
    photo: "breakfast.jpg",
    name: "Ягодный смузи-боул",
    description: "Ягоды, гранола и немного хорошего утра",
    kcal: 350,
    protein: 12,
    fat: 10,
    carbs: 53,
    ingredients:
      "Натуральный йогурт, банан, малина, голубика, манго, овсяная гранола.",
    allergens: "Молоко, глютен. Гранола может содержать орехи.",
    weight: "280 г",
  },
  {
    type: "Обед",
    time: "12:00–13:00",
    photo: "lunch.jpg",
    name: "Боул с тофу и овощами",
    description: "Тофу, эдамаме и радуга свежих овощей",
    kcal: 510,
    protein: 28,
    fat: 18,
    carbs: 59,
    ingredients:
      "Тофу, эдамаме, кукуруза, огурец, томаты, краснокочанная капуста, салат, оливковое масло.",
    allergens: "Соя. Состав заправки необходимо уточнить перед заказом.",
    weight: "340 г",
  },
  {
    type: "2 перекуса",
    time: "11:00 / 16:00",
    photo: "snack.jpg",
    name: "Йогурт и ягодный десерт",
    description: "Две маленькие паузы для удовольствия",
    kcal: 300,
    protein: 16,
    fat: 10,
    carbs: 36,
    ingredients:
      "Натуральный йогурт, клубника, малина, овсяные хлопья, семена чиа. Две отдельные порции.",
    allergens: "Молоко, глютен.",
    weight: "2 × 150 г",
  },
  {
    type: "Ужин",
    time: "18:00–19:00",
    photo: "dinner.jpg",
    name: "Лосось с тёплыми овощами",
    description: "Нежная рыба, зелень и лёгкий соус",
    kcal: 540,
    protein: 38,
    fat: 28,
    carbs: 34,
    ingredients:
      "Филе лосося, картофель, шпинат, огурец, томаты, лимон, оливковое масло, зелень.",
    allergens: "Рыба. Состав соуса необходимо уточнить перед заказом.",
    weight: "320 г",
  },
];
const menuVariations = [
  {
    names: [
      "Ягодный смузи-боул",
      "Боул с тофу и овощами",
      "Йогурт и ягодный десерт",
      "Лосось с тёплыми овощами",
    ],
    calories: [350, 510, 300, 540],
  },
  {
    names: [
      "Гранола с манго и ягодами",
      "Тофу с эдамаме и зеленью",
      "Йогурт с чиа и малиной",
      "Лосось с лимоном и шпинатом",
    ],
    calories: [370, 495, 310, 525],
  },
  {
    names: [
      "Смузи-боул с голубикой",
      "Овощной боул с кукурузой",
      "Ягодный йогурт с хлопьями",
      "Лосось с овощным гарниром",
    ],
    calories: [360, 500, 300, 530],
  },
  {
    names: [
      "Гранола с бананом и малиной",
      "Тофу с хрустящими овощами",
      "Йогурт с клубникой и чиа",
      "Лосось с зеленью и лимоном",
    ],
    calories: [380, 520, 290, 540],
  },
  {
    names: [
      "Смузи-боул с манго",
      "Зелёный боул с тофу",
      "Дуэт ягодных десертов",
      "Лосось с тёплым салатом",
    ],
    calories: [350, 515, 305, 520],
  },
];
function mealsForDay(day) {
  return baseMeals.map((meal, index) => ({
    ...meal,
    name: menuVariations[day].names[index],
    kcal: menuVariations[day].calories[index],
  }));
}
function renderMenu() {
  const meals = mealsForDay(state.day);
  $("#day-menu").innerHTML = meals
    .map(
      (meal, index) =>
        `<button class="meal-card" data-meal="${index}" aria-label="${meal.name}: посмотреть состав и пищевую ценность"><div class="meal-image"><img src="${asset(meal.photo)}" width="700" height="560" alt="${baseMeals[index].name}" loading="lazy"><span class="meal-badge">${meal.type}</span><span class="meal-time">${meal.time}</span></div><div class="meal-body"><h3>${meal.name}</h3><p>${meal.description}</p><div class="meal-meta"><span>${meal.kcal} ккал</span><span class="meal-more">Состав ${icon("plus")}</span></div></div></button>`,
    )
    .join("");
  $("#daily-total").textContent =
    `${new Intl.NumberFormat("ru-KZ").format(meals.reduce((sum, meal) => sum + meal.kcal, 0))} ккал за день`;
  $("#day-menu").setAttribute("aria-labelledby", `day-tab-${state.day}`);
  $$("[data-day]").forEach((button) => {
    const selected = Number(button.dataset.day) === state.day;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
}
$$("[data-day]").forEach((button) =>
  button.addEventListener("click", () => {
    state.day = Number(button.dataset.day);
    renderMenu();
  }),
);
$(".day-tabs").addEventListener("keydown", (event) => {
  const tab = event.target.closest("[data-day]");
  if (!tab) return;
  let nextDay;
  if (event.key === "ArrowRight") nextDay = (state.day + 1) % 5;
  if (event.key === "ArrowLeft") nextDay = (state.day + 4) % 5;
  if (event.key === "Home") nextDay = 0;
  if (event.key === "End") nextDay = 4;
  if (nextDay !== undefined) {
    event.preventDefault();
    state.day = nextDay;
    renderMenu();
    $(`[data-day="${nextDay}"]`).focus();
  }
});

function openModal(dialog) {
  dialog.showModal();
}
$$("dialog").forEach((dialog) => {
  $("[data-close]", dialog).addEventListener("click", () => dialog.close());
  if ("closedBy" in HTMLDialogElement.prototype) {
    dialog.closedBy = "any";
    return;
  }
  const isOutside = (event) => {
    const box = dialog.getBoundingClientRect();
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    );
  };
  let pressedOutside = false;
  dialog.addEventListener("pointerdown", (event) => {
    pressedOutside = isOutside(event);
  });
  dialog.addEventListener("pointerup", (event) => {
    if (pressedOutside && isOutside(event)) dialog.close();
    pressedOutside = false;
  });
});
$("#day-menu").addEventListener("click", (event) => {
  const button = event.target.closest("[data-meal]");
  if (!button) return;
  const meal = mealsForDay(state.day)[Number(button.dataset.meal)];
  $("#meal-content").innerHTML =
    `<img class="meal-detail-photo" width="700" height="389" src="${asset(meal.photo)}" alt="${meal.name}"><div class="meal-detail-body"><span class="eyebrow">${meal.type} · ${meal.weight}</span><h2 id="meal-title">${meal.name}</h2><div class="macro-grid"><div><strong>${meal.kcal}</strong><span>ккал</span></div><div><strong>${meal.protein} г</strong><span>Белки</span></div><div><strong>${meal.fat} г</strong><span>Жиры</span></div><div><strong>${meal.carbs} г</strong><span>Углеводы</span></div></div><h3>Что внутри</h3><p>${meal.ingredients}</p><h3>Аллергены</h3><p>${meal.allergens}</p><p class="small-note">Пример блюда для демонстрации сайта. Фото иллюстративное, состав и пищевая ценность ориентировочные. Фактическое меню нужно подтвердить у кухни.</p><button class="button button-full" id="meal-select-plan">Выбрать программу питания</button></div>`;
  $("#meal-select-plan").addEventListener("click", () => {
    $("#meal-dialog").close();
    $("#programs").scrollIntoView({ behavior: "auto" });
  });
  openModal($("#meal-dialog"));
});

const quiz = { step: 0, goal: null, format: null, duration: null };
const quizSteps = [
  {
    title: "Какая у вас цель?",
    description: "Начнём с главного. Что хочется добавить в свою жизнь?",
    key: "goal",
    options: [
      {
        value: "light",
        title: "Хочу чувствовать лёгкость",
        caption: "Снижение веса",
        icon: "leaf",
      },
      {
        value: "balance",
        title: "Хочу питаться сбалансированно",
        caption: "Поддержание формы",
        icon: "sun",
      },
      {
        value: "power",
        title: "Мне нужно больше энергии",
        caption: "Активный ритм",
        icon: "zap",
      },
    ],
  },
  {
    title: "Что для вас важнее?",
    description: "Так мы поймём, с чего начать знакомство с рационом.",
    key: "format",
    options: [
      { value: "taste", title: "Разнообразие и новые вкусы", icon: "utensils" },
      { value: "time", title: "Больше времени для себя", icon: "clock" },
      { value: "routine", title: "Удобный ритм питания", icon: "heart" },
    ],
  },
  {
    title: "На сколько дней планируем?",
    description:
      "Можно начать с одного дня и посмотреть, подходит ли вам формат.",
    key: "duration",
    options: [
      {
        value: "1",
        title: "Сначала попробую",
        caption: "1 день",
        icon: "leaf",
      },
      {
        value: "5",
        title: "На рабочую неделю",
        caption: "5 дней",
        icon: "bag",
      },
      {
        value: "20",
        title: "Хочу сделать это привычкой",
        caption: "20 дней",
        icon: "sun",
      },
    ],
  },
];
function focusQuizHeading() {
  const heading = $("#quiz-title");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}
function renderQuiz() {
  const progress = `<div class="quiz-progress" aria-label="Шаг ${Math.min(quiz.step + 1, 3)} из 3">${quizSteps.map((_, index) => `<span class="${index <= quiz.step ? "is-done" : ""}"></span>`).join("")}</div>`;
  if (quiz.step === 3) {
    const plan = plans[quiz.goal];
    const preferences = {
      taste: "Вам важно разнообразие — начните со знакомства с меню по дням.",
      time: "Готовый рацион освободит время от покупок и приготовления еды.",
      routine: "Готовые порции помогут организовать приёмы пищи в течение дня.",
    };
    $("#quiz-content").innerHTML =
      `${progress}<div class="result-icon">${icon("leaf")}</div><span class="eyebrow">Есть идея для вашего ритма</span><h2 id="quiz-title">Вам подойдёт программа «${plan.name}»</h2><p>${preferences[quiz.format]}</p><div class="quiz-result-card"><strong>${plan.name}</strong><p>${plan.kcal} · ${plan.meals}<br>${money(plan.price)} / день · ${daysText(Number(quiz.duration))}<br>Всего ${money(plan.price * Number(quiz.duration))}</p></div><p class="small-note">Это подбор по предпочтениям, а не расчёт индивидуальной потребности в калориях. Калорийность и ограничения можно согласовать со специалистом.</p><button class="button button-full" id="apply-quiz">Выбрать эту программу</button><div class="quiz-actions"><button class="quiz-back" id="quiz-back">Вернуться к ответам</button></div>`;
    $("#apply-quiz").addEventListener("click", () => {
      if (document.body.dataset.activeProgram !== quiz.goal) {
        window.location.assign(new URL(`programs/${plan.slug}/?days=${quiz.duration}#programs`, siteRoot));
        return;
      }
      state.program = quiz.goal;
      state.duration = Number(quiz.duration);
      updatePlan();
      $("#quiz-dialog").close();
      $("#programs").scrollIntoView({ behavior: "auto" });
      showToast(`Программа «${plan.name}» выбрана`);
    });
  } else {
    const step = quizSteps[quiz.step];
    $("#quiz-content").innerHTML =
      `${progress}<span class="eyebrow">Подбор программы</span><h2 id="quiz-title">${step.title}</h2><p>${step.description}</p><div class="quiz-options" role="group" aria-label="${step.title}">${step.options.map((option) => `<button class="quiz-option ${quiz[step.key] === option.value ? "is-selected" : ""}" data-answer="${option.value}" aria-pressed="${quiz[step.key] === option.value}">${icon(option.icon)}<span>${option.title}</span>${option.caption ? `<span>${option.caption}</span>` : ""}</button>`).join("")}</div><div class="quiz-actions">${quiz.step ? '<button class="quiz-back" id="quiz-back">Назад</button>' : '<span class="small-note">Три простых вопроса</span>'}<button class="button" id="quiz-next" ${quiz[step.key] ? "" : "disabled"}>${quiz.step === 2 ? "Посмотреть результат" : "Продолжить"}</button></div>`;
    $$("[data-answer]", $("#quiz-content")).forEach((button) =>
      button.addEventListener("click", () => {
        quiz[step.key] = button.dataset.answer;
        $$("[data-answer]").forEach((option) => {
          const selected = option === button;
          option.classList.toggle("is-selected", selected);
          option.setAttribute("aria-pressed", String(selected));
        });
        $("#quiz-next").disabled = false;
      }),
    );
    $("#quiz-next").addEventListener("click", () => {
      if (!quiz[step.key]) return;
      quiz.step += 1;
      renderQuiz();
      focusQuizHeading();
    });
  }
  $("#quiz-back")?.addEventListener("click", () => {
    quiz.step -= 1;
    renderQuiz();
    focusQuizHeading();
  });
}
$$("[data-quiz]").forEach((button) =>
  button.addEventListener("click", () => {
    quiz.step = 0;
    renderQuiz();
    closeMobileMenu();
    openModal($("#quiz-dialog"));
  }),
);

function localDate(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Almaty",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
const earliestDate = () => localDate(new Date(Date.now() + 86400000));
let preparedOrder = "";
function renderOrder() {
  const plan = plans[state.program];
  const date = earliestDate();
  $("#order-content").innerHTML =
    `<span class="eyebrow">Хорошее начало</span><h2 id="order-title">Выбранная программа</h2><p>Укажите данные и сохраните черновик заявки.</p><div class="order-summary"><div><strong>${plan.name} · ${daysText(state.duration)}</strong><span>${plan.kcal} · доставка включена</span></div><strong>от ${money(plan.price * state.duration)}</strong></div><form class="order-form" id="order-form"><div class="field-row"><div class="field"><label for="order-name">Ваше имя</label><input id="order-name" name="name" autocomplete="given-name" placeholder="Имя" required maxlength="60"></div><div class="field"><label for="order-phone">Телефон</label><input id="order-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 (___) ___-__-__" required maxlength="25" aria-describedby="phone-error"><span class="form-error" id="phone-error" aria-live="polite" hidden>Укажите номер из 11 цифр, начинающийся с +7 или 8.</span></div></div><div class="field"><label for="order-address">Адрес доставки в Алматы</label><input id="order-address" name="address" autocomplete="street-address" placeholder="Улица, дом, квартира" required maxlength="200"></div><div class="field-row"><div class="field"><label for="order-date">Первый день питания</label><input id="order-date" name="date" type="date" min="${date}" value="${date}" required></div><div class="field"><label for="order-time">Время доставки</label><select id="order-time" name="time"><option>06:00–08:00</option><option>08:00–10:00</option></select></div></div><div class="field"><label for="order-comment">Что нужно учесть <span class="optional-label">(необязательно)</span></label><textarea id="order-comment" name="comment" placeholder="Пожелания, продукты, которые не любите" maxlength="500"></textarea></div><div class="form-note">Это демоверсия. Данные не отправляются на кухню, заказ и доставка не оформляются. Можно скачать черновик.</div><button class="button button-full" type="submit">Подготовить заказ ${icon("check")}</button><p class="small-note">Данные остаются только в текущей вкладке. Оплата не требуется.</p></form>`;
  const phone = $("#order-phone");
  phone.addEventListener("input", () => {
    phone.setCustomValidity("");
    phone.removeAttribute("aria-invalid");
    $("#phone-error").hidden = true;
  });
  phone.addEventListener("blur", () => validatePhone(phone));
  $("#order-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validatePhone(phone)) {
      phone.reportValidity();
      phone.focus();
      return;
    }
    const form = event.currentTarget;
    const values = new FormData(form);
    const firstDay = values.get("date");
    const startInput = $("#order-date");
    if (firstDay < earliestDate()) {
      startInput.setCustomValidity("Выберите дату не раньше завтрашнего дня.");
      startInput.reportValidity();
      startInput.addEventListener(
        "input",
        () => startInput.setCustomValidity(""),
        { once: true },
      );
      return;
    }
    const name = values.get("name").trim();
    const address = values.get("address").trim();
    if (!name || !address) {
      const input = !name ? $("#order-name") : $("#order-address");
      input.setCustomValidity("Пожалуйста, заполните это поле.");
      input.reportValidity();
      input.addEventListener("input", () => input.setCustomValidity(""), {
        once: true,
      });
      return;
    }
    const dateLabel = new Intl.DateTimeFormat("ru-KZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Almaty",
    }).format(new Date(`${firstDay}T12:00:00+05:00`));
    preparedOrder = `HEALTH FOOD — ЧЕРНОВИК ЗАКАЗА\n\nПрограмма: ${plan.name}\nКалорийность: ${plan.kcal}\nПериод: ${daysText(state.duration)}\nСтоимость за день: от ${money(plan.price)}\nВсего: от ${money(plan.price * state.duration)}\nДоставка: включена\nПервый день: ${dateLabel}\nВремя: ${values.get("time")}\n\nИмя: ${name}\nТелефон: ${values.get("phone").trim()}\nАдрес: Алматы, ${address}\nПожелания: ${values.get("comment").trim() || "Нет"}\n\nДемонстрационный черновик. Заказ не отправлен и не подтверждён. Цены и условия нужно согласовать с сервисом.`;
    $("#order-content").innerHTML =
      `<div class="result-icon">${icon("check")}</div><span class="eyebrow">Всё собрано</span><h2 id="order-title">Черновик заявки готов</h2><p id="order-greeting"></p><pre class="prepared-order" id="prepared-order"></pre><div class="result-actions"><button class="button button-full" id="download-order">Скачать черновик</button><button class="button button-outline button-full" id="copy-order">Скопировать детали</button></div><p class="small-note" style="margin-top:17px">Это черновик: он не отправлен в Health Food. Реальный заказ нужно согласовать с сервисом отдельно.</p>`;
    $("#order-greeting").textContent =
      `${name}, вот детали вашего рациона. Сохраните их, чтобы вернуться к выбору позже.`;
    $("#prepared-order").textContent = preparedOrder;
    $("#download-order").addEventListener("click", downloadOrder);
    $("#copy-order").addEventListener("click", copyOrder);
    const title = $("#order-title");
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
    $("#order-dialog").scrollTop = 0;
  });
}
function validatePhone(input) {
  const digits = input.value.replace(/\D/g, "");
  const valid = digits.length === 11 && /^[78]/.test(digits);
  input.setCustomValidity(
    valid ? "" : "Укажите телефон из 11 цифр, начинающийся с +7 или 8.",
  );
  input.setAttribute("aria-invalid", String(!valid));
  $("#phone-error").hidden = valid || !input.value;
  return valid;
}
function downloadOrder() {
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + preparedOrder], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "health-food-order-draft.txt";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
async function copyOrder() {
  try {
    await navigator.clipboard.writeText(preparedOrder);
    $("#copy-order").textContent = "Скопировано";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents($("#prepared-order"));
    selection.removeAllRanges();
    selection.addRange(range);
    $("#copy-order").textContent = "Текст выделен — нажмите Ctrl+C";
  }
}
$$("[data-order]").forEach((button) =>
  button.addEventListener("click", () => {
    if (button.dataset.orderProgram) state.program = button.dataset.orderProgram;
    if (button.hasAttribute("data-trial")) {
      state.duration = 1;
      updatePlan();
    }
    updatePlan();
    renderOrder();
    openModal($("#order-dialog"));
  }),
);
$$("[data-privacy]").forEach((button) =>
  button.addEventListener("click", () => openModal($("#privacy-dialog"))),
);

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 4000);
}
function closeMobileMenu() {
  $("#mobile-nav").hidden = true;
  $(".menu-toggle").setAttribute("aria-expanded", "false");
  $(".menu-toggle").setAttribute("aria-label", "Открыть меню");
}
$(".menu-toggle").addEventListener("click", () => {
  const open = $("#mobile-nav").hidden;
  $("#mobile-nav").hidden = !open;
  $(".menu-toggle").setAttribute("aria-expanded", String(open));
  $(".menu-toggle").setAttribute(
    "aria-label",
    open ? "Закрыть меню" : "Открыть меню",
  );
});
$$("#mobile-nav a").forEach((link) =>
  link.addEventListener("click", closeMobileMenu),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#mobile-nav").hidden) {
    closeMobileMenu();
    $(".menu-toggle").focus();
  }
});
window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
  if (event.matches) closeMobileMenu();
});
$("#current-year").textContent = new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Almaty",
  year: "numeric",
}).format(new Date());
renderMenu();
updatePlan();

const videoDialog = $("#video-dialog");
$$("[data-video]").forEach(button => {
  button.addEventListener("click", () => {
    const videoId = button.dataset.video;
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return;
    const title = button.dataset.videoTitle || "Видео Health Food";
    $("#video-title").textContent = title;
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
    frame.title = title;
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    $("#video-content").replaceChildren(frame);
    $("#video-external").href = `https://www.youtube.com/watch?v=${videoId}`;
    openModal(videoDialog);
  });
});
videoDialog.addEventListener("close", () => $("#video-content").replaceChildren());
