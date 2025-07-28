let taskTitle = document.querySelector("#inputTitle");
let taskDescription = document.querySelector("#inputDescription");
let addBtn = document.querySelector(".add-btn");
let greet = document.querySelector(".greeting-container");
let taskContainer = document.querySelector(".task-container");
let inPutsBox1 = document.querySelector(".inputs-1");
let inPutsBox2 = document.querySelector(".inputs-2");
let delAllBtn = document.querySelector(".del-all-btn");
let delAllDone = document.querySelector(".del-all-done-btn");
let taskCounter = document.querySelector(".task-counter");
let taskStatus = document.querySelector(".task-status");
let delAllConfirm = document.querySelector(".pop-bg");
let yesAllDelBtn = document.querySelector("#yes-all");
let noAllDelBtn = document.querySelector("#no-all");
let confirmText = document.querySelector("#confirm-text");
let progressBar = document.querySelector(".progressbar");
let aboutHelp = document.querySelector(".about-help");
let helpAboutContainer = document.querySelector(".help-about-container");
let closeBtn = document.querySelector(".close");
let fullscreenBlur = document.querySelector(".fullscreen-blur");
let congContanier = document.querySelector(".cong-contanier");
let congClose = document.querySelector(".close-cong");
let scrollAddBtn = document.querySelector(".scroll-add-btn");

// task arr
let tasks = [];
tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let randomColor;
let isConfirming = false;
let isEditing = false;
let editingTaskId = null;

console.log(tasks);

showCards();
displayBtnTask();

// functions

function saveDataToLocal(tasks) {
  let taskString = JSON.stringify(tasks);
  localStorage.setItem("tasks", taskString);
}

function greeting() {
  if (tasks.length === 0) {
    greet.style.display = "inline";
  } else {
    greet.style.display = "none";
  }
}

//done card cal

function doneCardTotal() {
  let totalTasks = tasks.length;
  let completedTasks = tasks.filter((task) => task.done).length;
  taskStatus.textContent = `${completedTasks}/${totalTasks}`;
  let progress = (completedTasks / totalTasks) * 100;
  progressBar.style.height = progress + "%";
}

//dis all btn

function disableWhileEditing(status) {
  const allEditBtns = document.querySelectorAll(".ri-edit-line");
  const allDelBtns = document.querySelectorAll(".pin-unpin");
  const allCheckBtns = document.querySelectorAll("#check-btn");

  allEditBtns.forEach(
    (btn) => (btn.style.pointerEvents = status ? "none" : "auto")
  );
  allDelBtns.forEach(
    (btn) => (btn.style.pointerEvents = status ? "none" : "auto")
  );
  allCheckBtns.forEach(
    (btn) => (btn.style.pointerEvents = status ? "none" : "auto")
  );

  delAllBtn.disabled = status;
  delAllDone.disabled = status;
}

function showCards() {
  taskContainer.innerHTML = "";
  tasks.forEach(function (e) {
    let taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.innerHTML = `
        <div class="card-btn">
          <i class="ri-check-line" id="check-btn"></i>
          <div class="pin-unpin">
            <i class="ri-pushpin-2-line"></i>
            <i class="ri-unpin-line"></i>
          </div>
          <i class="ri-edit-line"></i>
        </div>
        <div class="done-card ${e.done ? "done" : ""}"></div>
        <div class="card-title">${e.tName}</div>
        <div class="card-description">
          <p>${e.tDis}</p>
        </div>
        <div class="confirm-popup-card">
          <div class="card-confirm-del">
            <p>Confirm Delete</p>
            <div class="confirm-btn-container">
              <button id="yes"><i class="ri-check-fill"></i></button>
              <button id="no"><i class="ri-close-line"></i></button>
            </div>
          </div>
        </div>`;

    //card rotate & color
    taskCard.dataset.rotate = e.rotate;
    taskCard.style.transform = `rotate(${e.rotate}deg) scale(1)`;
    taskCard.style.background = `var(--color-${e.color})`;

    let unPin = taskCard.querySelector(".pin-unpin");
    let confirmDelCard = taskCard.querySelector(".confirm-popup-card");
    let yesDelBtn = taskCard.querySelector("#yes");
    let noDelBtn = taskCard.querySelector("#no");
    let checkBtn = taskCard.querySelector("#check-btn");
    let doneCard = taskCard.querySelector(".done-card");
    let titleDone = taskCard.querySelector(".card-title");
    let disDone = taskCard.querySelector(".card-description p");
    let editBtn = taskCard.querySelector(".ri-edit-line");

    //card hover
    taskCard.addEventListener("mouseenter", () => {
      if (!isConfirming && !isEditing) {
        taskCard.style.transform = `rotate(0deg) scale(1.1)`;
        taskCard.style.boxShadow = `0 2px 8px var(--color-${e.color})`;
      }
    });

    taskCard.addEventListener("mouseleave", () => {
      if (!isConfirming && !isEditing) {
        const rotate = taskCard.dataset.rotate;
        taskCard.style.transform = `rotate(${rotate}deg) scale(1)`;
        taskCard.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
      }
    });

    // task done
    if (e.done) {
      titleDone.classList.add("done-line-through");
      disDone.classList.add("done-line-through");
      checkBtn.style.background = "red";
    }

    checkBtn.addEventListener("click", () => {
      if (!isConfirming) {
        doneCard.classList.toggle("done");

        if (e.done === true) {
          e.done = false;
        } else {
          e.done = true;
        }
        saveDataToLocal(tasks);
        showCards();
      }
    });

    //task card delete

    unPin.addEventListener("click", () => {
      if (isConfirming) return;
      isConfirming = true;
      confirmDelCard.style.display = "inline";

      taskTitle.disabled = true;
      taskDescription.disabled = true;
      addBtn.disabled = true;
      delAllBtn.disabled = true;
      delAllDone.disabled = true;

      yesDelBtn.onclick = () => {
        taskCard.classList.add("delete-animate");

        setTimeout(() => {
          const index = tasks.findIndex((task) => task.id === e.id);
          if (index !== -1) {
            tasks.splice(index, 1);
            saveDataToLocal(tasks);
            isConfirming = false;
            showCards();

            taskTitle.disabled = false;
            taskDescription.disabled = false;
            addBtn.disabled = false;
            delAllBtn.disabled = false;
            delAllDone.disabled = false;
          }
        }, 300);
      };

      noDelBtn.onclick = () => {
        confirmDelCard.style.display = "none";
        isConfirming = false;

        taskTitle.disabled = false;
        taskDescription.disabled = false;
        addBtn.disabled = false;
        delAllBtn.disabled = false;
        delAllDone.disabled = false;
      };
    });

    // edit task

    editBtn.addEventListener("click", () => {
      if (isConfirming) return;

      taskTitle.value = e.tName;
      taskDescription.value = e.tDis;
      taskTitle.focus();

      randomColor = e.color;
      addBtn.style.background = `var(--color-${e.color})`;
      taskTitle.style.background = `var(--color-${e.color})`;

      isEditing = true;
      editingTaskId = e.id;

      addBtn.textContent = "Update";

      disableWhileEditing(true);
    });

    taskContainer.appendChild(taskCard);
  });
  doneCardTotal();
  displayBtnTask();
  greeting();
}

//input random color
let lastColor = null;

inPutsBox1.addEventListener("click", () => {
  let newColor;
  do {
    newColor = Math.floor(Math.random() * 10) + 1;
  } while (newColor === lastColor);

  randomColor = newColor;
  lastColor = newColor;

  inPutsBox1.style.backgroundColor = `var(--color-${randomColor})`;
  addBtn.style.background = `var(--color-${randomColor})`;
});

// inPutsBox1.addEventListener("blur", () => {
//   inPutsBox1.style.backgroundColor = "";
// });

// inPutsBox2.addEventListener("focus", () => {
//   inPutsBox2.style.backgroundColor = `var(--color-${randomColor})`;
// });

// inPutsBox2.addEventListener("blur", () => {
//   inPutsBox2.style.backgroundColor = "";
// });

//add button

addBtn.addEventListener("click", () => {
  if (!randomColor) {
    randomColor = Math.floor(Math.random() * 10) + 1;
  }

  let taskName = taskTitle.value.trim();
  let taskDis = taskDescription.value.trim();

  if (
    taskName !== "" &&
    taskName.length >= 2 &&
    taskName.length <= 16 &&
    taskDis !== "" &&
    taskDis.length >= 2 &&
    taskDis.length <= 40
  ) {
    if (isEditing) {
      let index = tasks.findIndex((task) => task.id === editingTaskId);
      if (index !== -1) {
        tasks[index].tName = taskName;
        tasks[index].tDis = taskDis;
        tasks[index].color = randomColor || tasks[index].color;
        saveDataToLocal(tasks);
        showCards();

        isEditing = false;
        editingTaskId = null;
        addBtn.textContent = "Add";
        addBtn.style.background = `var(--color-${randomColor})`;
        taskTitle.value = "";
        taskDescription.value = "";
        taskTitle.focus();
        disableWhileEditing(false);

        return;
      }
    }

    let rDeg = Math.floor(Math.random() * 11) - 8;
    let taskId = Date.now() + Math.floor(Math.random() * 1000);
    tasks.push({
      id: taskId,
      tName: taskName,
      tDis: taskDis,
      rotate: rDeg,
      color: randomColor,
      done: false,
    });
    inPutsBox1.click();
    saveDataToLocal(tasks);
    showCards();
    taskTitle.value = "";
    taskDescription.value = "";
  } else {
    alert(
      "Oops! Title must be 2-16 characters, and description must be 2-40characters long."
    );
  }
  taskTitle.focus();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !isConfirming) {
    addBtn.click();
  }
});

taskTitle.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    taskDescription.focus();
  }
});

taskDescription.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    e.preventDefault();
    taskTitle.focus();
  }
});

//delete done all task
let deleteMode = "";

delAllDone.addEventListener("click", () => {
  deleteMode = "done";
  confirmText.textContent =
    "This will permanently delete all marked tasks. Are you sure?";
  delAllConfirm.style.display = "inline";
});

delAllBtn.addEventListener("click", () => {
  deleteMode = "all";
  confirmText.textContent =
    "This will permanently delete all tasks. Are you sure?";
  delAllConfirm.style.display = "inline";
});

yesAllDelBtn.addEventListener("click", () => {
  if (deleteMode === "done") {
    tasks = tasks.filter((task) => !task.done);
  } else if (deleteMode === "all") {
    tasks = [];
    localStorage.removeItem("tasks");
  }
  saveDataToLocal(tasks);
  showCards();
  delAllConfirm.style.display = "none";
  displayBtnTask();
});

noAllDelBtn.addEventListener("click", () => {
  delAllConfirm.style.display = "none";
});

function displayBtnTask() {
  if (tasks.length >= 1) {
    taskCounter.style.display = "inline";
    delAllBtn.style.display = "inline";

    const anyDone = tasks.some((task) => task.done);
    if (anyDone) {
      delAllDone.style.display = "inline";
    } else {
      delAllDone.style.display = "none";
    }
  } else {
    taskCounter.style.display = "none";
    delAllBtn.style.display = "none";
    delAllDone.style.display = "none";
  }
}

// theme
const themeToggleBtn = document.querySelector(".theme-toggle");
const icon = themeToggleBtn.querySelector("i");

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.classList.add("light-theme");
    icon.classList.replace("ri-moon-line", "ri-sun-line");
  } else {
    document.documentElement.classList.remove("light-theme");
    icon.classList.replace("ri-sun-line", "ri-moon-line");
  }
}

themeToggleBtn.addEventListener("click", () => {
  const isLight = document.documentElement.classList.toggle("light-theme");
  let newTheme = "";
  if (isLight) {
    newTheme = "light";
  } else {
    newTheme = "dark";
  }
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
});

let savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  savedTheme = prefersLight ? "light" : "dark";
}
applyTheme(savedTheme);

//help & about

aboutHelp.addEventListener("click", () => {
  helpAboutContainer.style.display = "inline";
  fullscreenBlur.style.display = "inline";
});

closeBtn.addEventListener("click", () => {
  fullscreenBlur.style.display = "none";
  helpAboutContainer.style.display = "none";
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollAddBtn.style.display = "block";
  } else {
    scrollAddBtn.style.display = "none";
  }
});

scrollAddBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(() => {
    taskTitle.focus();
  }, 800);
});
