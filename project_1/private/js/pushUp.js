let isGameStart = false;

var stage;
var detections;

let GridArray = [
  { x: 20, y: 510, width: 800, height: 450 },
  { x: 470, y: 510, width: 800, height: 450 },
  { x: 920, y: 510, width: 800, height: 450 },
  { x: 20, y: 200, width: 800, height: 600 },
  { x: 470, y: 200, width: 800, height: 600 },
  { x: 920, y: 200, width: 800, height: 600 },
];
var num = Math.floor(Math.random() * 6);

const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const ctx = canvasElement.getContext("2d");

//non-stop capture point

function onResults(results) {
  ctx.save();
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (isGameStart) {
    if (results.poseLandmarks) {
      detections = results;

      ctx.beginPath();
      ctx.rect(GridArray[num].x, GridArray[num].y, GridArray[num].width, GridArray[num].height);
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 10;
      ctx.stroke();

      //jump

      let leftAnklePoint = [results.poseLandmarks[27].x * 1742, results.poseLandmarks[27].y * 980];
      let rightAnklePoint = [results.poseLandmarks[28].x * 1742, results.poseLandmarks[28].y * 980];
      let xMidAnklePoint = (leftAnklePoint[0] + rightAnklePoint[0]) / 2;
      let yMidAnklePoint = (leftAnklePoint[1] + rightAnklePoint[1]) / 2;

      //push up
      let rightWrist = [
        results.poseLandmarks[16].x,
        results.poseLandmarks[16].y,
        results.poseLandmarks[16].z,
      ];
      let rightElbow = [
        results.poseLandmarks[14].x,
        results.poseLandmarks[14].y,
        results.poseLandmarks[14].z,
      ];
      let rightShoulder = [
        results.poseLandmarks[12].x,
        results.poseLandmarks[12].y,
        results.poseLandmarks[12].z,
      ];
      let leftShoulder = [
        results.poseLandmarks[11].x,
        results.poseLandmarks[11].y,
        results.poseLandmarks[11].z,
      ];
      let leftElbow = [
        results.poseLandmarks[13].x,
        results.poseLandmarks[13].y,
        results.poseLandmarks[13].z,
      ];
      let leftWrist = [
        results.poseLandmarks[15].x,
        results.poseLandmarks[15].y,
        results.poseLandmarks[15].z,
      ];
      let rightDownAngle = calculate_angle(rightShoulder, rightElbow, rightWrist);
      let leftDownAngle = calculate_angle(leftShoulder, leftElbow, leftWrist);
      let rightUpAngle = calculate_angle(leftShoulder, rightShoulder, rightElbow);
      let leftUpAngle = calculate_angle(rightShoulder, leftShoulder, leftElbow);

      //Calculate Reference Point
      let rightShoulderPoint = [
        results.poseLandmarks[12].x * 1742,
        results.poseLandmarks[12].y * 980,
      ];
      let leftShoulderPoint = [
        results.poseLandmarks[11].x * 1742,
        results.poseLandmarks[11].y * 980,
      ];
      let xMidShoulderPoint = (rightShoulderPoint[0] + leftShoulderPoint[0]) / 2;
      let yMidShoulderPoint = (rightShoulderPoint[1] + leftShoulderPoint[1]) / 2;
      let ShoulderGridDistance = Math.sqrt(
        (xMidShoulderPoint - (2 * GridArray[num].x + GridArray[num].width) / 2) ** 2 +
          (yMidShoulderPoint - (2 * GridArray[num].y + GridArray[num].height) / 2) ** 2
      );
      let AnkleGridDistance = Math.sqrt(
        (xMidAnklePoint - (2 * GridArray[num].x + GridArray[num].width) / 2) ** 2 +
          (yMidAnklePoint - (2 * GridArray[num].y + GridArray[num].height) / 2) ** 2
      );

      //Check count condition
      if (
        rightDownAngle > 160 &&
        rightUpAngle < 120 &&
        leftUpAngle < 120 &&
        leftDownAngle > 160 &&
        ShoulderGridDistance < 250 &&
        GridArray[num].y == 510
      ) {
        stage = "up";
      }

      if (
        stage == "up" &&
        rightDownAngle < 160 &&
        rightUpAngle > 120 &&
        leftUpAngle > 120 &&
        leftDownAngle < 160 &&
        ShoulderGridDistance < 250 &&
        GridArray[num].y == 510
      ) {
        stage = "down";

        counter++;
        document.getElementById("myAudio").play();
        document.querySelector(".scores").innerText = counter;
        num = Math.floor(Math.random() * 6);
        console.log("inner", num);
      }
      if (AnkleGridDistance < 250 && GridArray[num].y == 200) {
        counter++;
        document.getElementById("myAudio").play();
        document.querySelector(".scores").innerText = counter;
        num = Math.floor(Math.random() * 6);
        console.log("inner", num);
      }
    }
    //draw landmark and connector
    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 4,
    });
    drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });
  }
}

//pose detection
const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

{
  pose.onResults(onResults);
}

const camera = new Camera(videoElement, {
  onFrame: async () => {
    let timeStamp = new Date().getTime();

    if (timeStamp % 2 === 0) {
      await pose.send({ image: videoElement });
    }
  },
  width: 1742,
  height: 980,
});
camera.start();

var counter = document.querySelector(".scores").innerText;

//#### add key for start and restart the game ####
document.querySelector(".start").addEventListener("click", (event) => {
  isGameStart = true;

  document.querySelector(".start").classList.add("hidden");

  //set timer
  if (isGameStart) {
    let totalTime = 60;
    document.querySelector(".timer").innerHTML = totalTime;
    counter = 0;
    document.querySelector(".scores").innerHTML = counter;

    let countDown = setInterval(async function () {
      if (totalTime <= 0) {
        clearInterval(countDown);
        isGameStart = false;
        document.querySelector(".start").classList.remove("hidden");
        await getPersonalAHighestRecord();
        console.log("counter", counter);
        ctx.restore();

        updateScore(counter);
      } else {
        totalTime -= 1;
        document.querySelector(".timer").innerHTML = totalTime;
      }
    }, 1000);
  }
});

window.onload = async function () {
  await getExeAHighestRecord();
  await getPersonalAHighestRecord();
  await deleteRoom();
};

// get highest record of the game
async function getExeAHighestRecord() {
  const resp = await fetch("/exes/exeA/highest");
  const result = await resp.json();
  console.log("resultA:", result);
  if (result.max === null) {
    document.querySelector(".highestRecord").innerText = 0;
  } else {
    document.querySelector(".highestRecord").innerText = result.max;
  }
}

//get the personal highest record
async function getPersonalAHighestRecord() {
  const resp = await fetch("/exes/exeA");
  const result = await resp.json();
  if (result) {
    document.querySelector(".personalHighestScores").innerText = result.point;
  }
}

//insert personal scores
async function insertExeC(scores) {
  const resp = await fetch("/exes/exeC", {
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

async function deleteRoom() {
  const resp = await fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await resp.json();
}

export async function updateScore(score) {
  const resp = await fetch("/exes/exeA", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
  });
  const result = await resp.json();
  if (result.success) {
    alert(`Updated Success !!!You have got ${score}`);
    window.location.href = "pushUp.html";
    //form.reset();
  } else {
    alert(result.message);
    window.location.href = "pushUp.html";
  }
}

export function calculate_angle(a, b, c) {
  let A = Math.sqrt(
    (c[1] - b[1]) * (c[1] - b[1]) + (c[0] - b[0]) * (c[0] - b[0]) + (c[2] - b[2]) * (c[2] - b[2])
  );
  let B = Math.sqrt(
    (b[1] - a[1]) * (b[1] - a[1]) + (b[0] - a[0]) * (b[0] - a[0]) + (b[2] - a[2]) * (b[2] - a[2])
  );
  let C = Math.sqrt(
    (c[1] - a[1]) * (c[1] - a[1]) + (c[0] - a[0]) * (c[0] - a[0]) + (c[2] - a[2]) * (c[2] - a[2])
  );
  let angle = (Math.acos((A * A + B * B - C * C) / (2 * A * B)) * 180) / Math.PI;

  if (angle > 180.0) {
    angle = 360 - angle;
    //
  }
  return Math.abs(angle);
}
