//#### basic setting ####
const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const ctx = canvasElement.getContext("2d");

//hands detection
const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 6,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1742,
  height: 980,
});
camera.start();

let landmark = null;
let landmarkX = null;
let landmarkY = null;
let audio = new Audio("button_beep.mp3");
let tempCX_one = 250;
let tempCY_one = 250;
let tempCX_two = 900;
let tempCY_two = 500;
let color_one = "gold";
let color_two = "blue";
let counter_one = 0;
let counter_two = 0;
let isGameStart = false;
let scores_one = 0;
let scores_two = 0;
let scores = 0;
let isThumbMode = false;
let isIndexMode = false;

// ##### choose mode for the game#####
document.querySelector(".ThumbMode").addEventListener("click", () => {
  isThumbMode = true;
});

document.querySelector(".IndexMode").addEventListener("click", () => {
  isThumbMode = false;
  // isIndexMode = true;
});

//#### add key for start and restart the game ####
document.querySelector(".start").addEventListener("click", (event) => {
  isGameStart = true;
  // hidden button
  document.querySelector(".start").classList.add("hidden");

  //set timer
  if (isGameStart) {
    let totalTime = 20;
    document.querySelector(".timer").innerHTML = totalTime;
    scores_one = 0;
    scores_two = 0;
    scores = 0;
    document.querySelector(".scores").innerHTML = 0;
    let countDown = setInterval(async function () {
      if (totalTime <= 0) {
        clearInterval(countDown);
        alert("game over");
        isGameStart = false;

        // //alert game over with notification(scores)

        document.querySelector(".start").classList.remove("hidden");
        scores = document.querySelector(".scores").innerText;
        await insertExeB(scores);
        await getPersonalBHighestRecord();
      } else {
        totalTime -= 1;
        document.querySelector(".timer").innerHTML = totalTime;
      }
    }, 1000);
  }
});

function onResults(results) {
  ctx.save();
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      if (isThumbMode) {
        landmark = landmarks[4];
        landmarkX = Math.floor(landmark.x * 1742);
        landmarkY = Math.floor(landmark.y * 980);
      } else {
        landmark = landmarks[8];
        landmarkX = Math.floor(landmark.x * 1742);
        landmarkY = Math.floor(landmark.y * 980);
      }
      //show the touching finger
      ctx.beginPath();
      console.log(landmarkX, landmarkY);
      ctx.arc(landmarkX, landmarkY, 50, 0, 5 * Math.PI);
      ctx.fillStyle = "rgba(250,0,130,0.9)";
      ctx.fill();
      ctx.stroke();
    }

    if (isGameStart) {
      drawCircle_one(landmarkX, landmarkY);
      drawCircle_two(landmarkX, landmarkY);
    }
  }
  // count scores
  document.querySelector(".scores").innerHTML = scores_one + scores_two;

  ctx.restore();
}

//#### circle_one ####
function drawCircle_one(landmarkX, landmarkY) {
  ctx.beginPath();
  console.log("in");
  ctx.arc(200, 400, 100, 0, Math.Pi * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.stroke();

  // draw circle_one pattern

  let circleX = tempCX_one;
  let circleY = tempCY_one;
  ctx.beginPath();
  ctx.shadowColor = "red";
  ctx.shadowBlur = 15;
  ctx.arc(circleX, circleY, 50, 0, 5 * Math.PI);
  ctx.fillStyle = color_one;
  ctx.fill();
  ctx.shadowColor = "red";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(circleX, circleY, 35, 0, 5 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "red";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(circleX, circleY, 20, 0, 5 * Math.PI);
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.stroke();

  //check if hitting the circle and add scores
  if (
    landmarkX !== null &&
    landmarkY !== null &&
    Math.sqrt((landmarkX - circleX) ** 2 + (landmarkY - circleY) ** 2) < 40
  ) {
    color_one = "gray";

    counter_one = 1;
  }
  if (counter_one) {
    console.log("in counter loop");
    counter_one += 1;

    audio.play();
    color_one = "gray";
    if (counter_one === 3) {
      tempCX_one = Math.floor(Math.random() * 1400 + 200);
      tempCY_one = Math.floor(Math.random() * 400 + 300);
      color_one = "gold";
      counter_one = 0;
      scores_one += 2;
      console.log("scores_one:", scores_one);
    }
  }
}

//#### circle_two ####
function drawCircle_two(landmarkX, landmarkY) {
  let circleX = tempCX_two;
  let circleY = tempCY_two;
  ctx.beginPath();
  ctx.shadowColor = "purple";
  ctx.shadowBlur = 15;
  ctx.arc(circleX, circleY, 70, 0, 5 * Math.PI);
  ctx.fillStyle = color_two;
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "purple";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(circleX, circleY, 45, 0, 5 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
  ctx.shadowColor = "purple";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(circleX, circleY, 35, 0, 5 * Math.PI);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.stroke();

  //check if hitting the circle and add scores
  if (
    landmarkX !== null &&
    landmarkY !== null &&
    Math.sqrt((landmarkX - circleX) ** 2 + (landmarkY - circleY) ** 2) < 70
  ) {
    color_two = "gray";
    counter_two = 1;
  }
  if (counter_two) {
    counter_two += 1;
    color_two = "gray";
    audio.play();
    if (counter_two === 3) {
      tempCX_two = Math.floor(Math.random() * 1400 + 200);
      tempCY_two = Math.floor(Math.random() * 400 + 300);
      color_two = "blue";
      counter_two = 0;
      scores_two += 1;

      console.log("scores_two:", scores_two);
    }
  }
}

window.onload = async function () {
  await getExeBHighestRecord();
  await getPersonalBHighestRecord();
};

// get highest record of the game
async function getExeBHighestRecord() {
  const resp = await fetch("/exes/exeB/highest");
  const result = await resp.json();
  if (result.max === null) {
    document.querySelector(".highestRecord").innerText = 0;
  } else {
    document.querySelector(".highestRecord").innerText = result.max;
  }
}

//get the personal highest record
async function getPersonalBHighestRecord() {
  const resp = await fetch("/exes/exeB");
  const result = await resp.json();
  console.log("getPersonalBHighestRecord:", result);
  if (result) {
    document.querySelector(".personalHighestScores").innerText = result.point;
  }
}

//insert personal scores
async function insertExeB(scores) {
  const resp = await fetch("/exes/exeB", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scores }),
  });
  const result = await resp.json();
  if (result.success) {
    // alert("Updated!");
  } else {
    alert(result.message);
  }
}
