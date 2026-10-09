
const concepts = {
  ai: {
    title: "Artificial Intelligence",
    description: "Artificial Intelligence enables computers to perform tasks that typically require human intelligence, such as reasoning, recognizing patterns, and understanding language.",
    links: ["ml", "data", "nlp", "edu"]
  },
  ml: {
    title: "Machine Learning",
    description: "Machine Learning is a branch of AI in which computers learn patterns from data to make predictions or decisions without being explicitly programmed for every case.",
    links: ["ai", "data", "kg"]
  },
  data: {
    title: "Data",
    description: "Data consists of facts, observations, or measurements. It can be analyzed by machine learning systems and organized into knowledge graphs.",
    links: ["ai", "ml", "kg"]
  },
  kg: {
    title: "Knowledge Graph",
    description: "A knowledge graph represents entities as nodes and their relationships as edges, helping people and computers explore connected information.",
    links: ["data", "ml", "edu"]
  },
  edu: {
    title: "Education",
    description: "Education can use knowledge graphs to connect learning topics, reveal prerequisite concepts, and help learners discover related information.",
    links: ["ai", "kg", "nlp"]
  },
  nlp: {
    title: "Natural Language Processing",
    description: "Natural Language Processing is an AI field that helps computers analyze, process, and generate human language.",
    links: ["ai", "edu"]
  }
};

const nodeElements = [...document.querySelectorAll(".concept-node")];
const network = document.querySelector("#network");
const linesSvg = document.querySelector("#network-lines");
const titleElement = document.querySelector("#concept-title");
const descriptionElement = document.querySelector("#concept-description");
const connectionsElement = document.querySelector("#connections");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#concept-search");
const searchMessage = document.querySelector("#search-message");

function drawConnections() {
  const bounds = network.getBoundingClientRect();
  linesSvg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
  linesSvg.replaceChildren();

  Object.entries(concepts).forEach(([id, concept]) => {
    concept.links.forEach(targetId => {
      if (id >= targetId) return;

      const first = network.querySelector(`[data-node="${id}"]`);
      const second = network.querySelector(`[data-node="${targetId}"]`);
      if (!first || !second) return;

      const a = first.getBoundingClientRect();
      const b = second.getBoundingClientRect();

      const x1 = a.left + a.width / 2 - bounds.left;
      const y1 = a.top + a.height / 2 - bounds.top;
      const x2 = b.left + b.width / 2 - bounds.left;
      const y2 = b.top + b.height / 2 - bounds.top;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg", "line"
      );
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      linesSvg.appendChild(line);
    });
  });
}

function selectConcept(id) {
  const concept = concepts[id];
  if (!concept) return;

  nodeElements.forEach(node => {
    node.classList.toggle("selected", node.dataset.node === id);
  });

  titleElement.textContent = concept.title;
  descriptionElement.textContent = concept.description;
  connectionsElement.replaceChildren();

  concept.links.forEach(linkId => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "connection-chip";
    button.textContent = concepts[linkId].title;
    button.addEventListener("click", () => selectConcept(linkId));
    connectionsElement.appendChild(button);
  });

  searchMessage.textContent = "";
}

nodeElements.forEach(node => {
  node.addEventListener("click", () => selectConcept(node.dataset.node));
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();

  const match = Object.entries(concepts).find(([id, concept]) =>
    concept.title.toLowerCase().includes(query) ||
    id === query
  );

  if (match) {
    selectConcept(match[0]);
    searchMessage.textContent = `Found: ${match[1].title}`;
  } else {
    searchMessage.textContent =
      "Concept not found. Try AI, Data, Education, Machine Learning, Knowledge Graph, or Natural Language Processing.";
  }
});

window.addEventListener("resize", drawConnections);
window.addEventListener("load", drawConnections);
if ("ResizeObserver" in window) {
  new ResizeObserver(drawConnections).observe(network);
}

const questions = [
  {
    question: "What does a node represent in a knowledge graph?",
    options: ["A concept or entity", "A page background", "A website password"],
    answer: 0,
    explanation: "Nodes represent entities or concepts."
  },
  {
    question: "What does an edge represent?",
    options: ["A font style", "A relationship between concepts", "A file name"],
    answer: 1,
    explanation: "Edges connect nodes and represent relationships."
  },
  {
    question: "Which field teaches computers to learn patterns from data?",
    options: ["Web styling", "File management", "Machine Learning"],
    answer: 2,
    explanation: "Machine Learning learns patterns from data."
  }
];

let questionIndex = 0;
let score = 0;
let answered = false;

const progress = document.querySelector("#quiz-progress");
const questionTitle = document.querySelector("#quiz-question");
const optionsContainer = document.querySelector("#quiz-options");
const quizFeedback = document.querySelector("#quiz-feedback");
const nextButton = document.querySelector("#next-question");

function renderQuestion() {
  const question = questions[questionIndex];
  answered = false;

  progress.textContent =
    `Question ${questionIndex + 1} of ${questions.length}`;
  questionTitle.textContent = question.question;
  quizFeedback.textContent = "";
  optionsContainer.replaceChildren();
  nextButton.disabled = true;
  nextButton.textContent =
    questionIndex === questions.length - 1 ? "See Results →" : "Next Question →";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option;

    button.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      const correct = index === question.answer;
      if (correct) score++;

      [...optionsContainer.children].forEach((item, itemIndex) => {
        item.disabled = true;
        if (itemIndex === question.answer) item.classList.add("correct");
        else if (itemIndex === index) item.classList.add("incorrect");
      });

      quizFeedback.textContent =
        `${correct ? "Correct!" : "Not quite."} ${question.explanation}`;
      nextButton.disabled = false;
    });

    optionsContainer.appendChild(button);
  });
}

nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    progress.textContent = "Quiz completed";
    questionTitle.textContent = `Your score: ${score} / ${questions.length}`;
    optionsContainer.replaceChildren();

    quizFeedback.textContent =
      score === questions.length
        ? "Excellent! You answered every question correctly."
        : "Good effort! Review the learning section and try again.";

    nextButton.disabled = false;
    nextButton.textContent = "Try Again";
    nextButton.onclick = () => {
      questionIndex = 0;
      score = 0;
      nextButton.onclick = null;
      renderQuestion();
    };
  }
});

renderQuestion();

document.querySelector("#feedback-form").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const name = form.elements.name.value.trim();

  document.querySelector("#feedback-status").textContent =
    `Thank you, ${name}! The form works, but feedback has not been saved to a database yet.`;

  form.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();

selectConcept("ai");
drawConnections();