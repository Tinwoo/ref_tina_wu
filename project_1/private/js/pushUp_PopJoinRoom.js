// Get the modal
var joinModal = document.getElementById("joinModal");

// Get the button that opens the modal
var btn = document.getElementById("joinBtn");
document.querySelector("#joinBtn").addEventListener("click", async () => {
  //submit form to join host
  document.querySelector("#join-form-register").addEventListener("submit", async (e) => {
    console.log("Register!");
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("nick_name", form.NewNickName.value);
    console.log("nickname", form.NewNickName.value);

    console.log("testing");

    const resp = await fetch(`/form/${form.NewNickName.value}`, {
      method: "POST",
      body: formData,
    });

    const result = await resp.json();
    console.log(result);
    const hostName = result.hostname;

    if (result.success) {
      const resp = await fetch("/users/info", {
        METHOD: "GET",
      });
      //get my name
      const result = await resp.json();
      const member = result.user.player_name;

      joinModal.style.display = "none";
      var time = 1;
      if (time == 1) {
        //socket io connect
        let socket = io.connect();

        //receive counter from opponent by socket io
        socket.on("counter", async (data) => {
          const msg = data.counter;

          if (data.counter == undefined) {
            document.querySelector(".dual-count").innerText = 0;
          }
          document.querySelector(".dual-count").innerText = data.counter;
          document.getElementById("myAudio").play();

          console.log("counter", msg);
        });

        document.querySelector(".dual-count").innerText = 0;
        document.querySelector(".vsName").innerText = hostName;

        //single game play
        document.querySelector(".myName").innerText = member;
        document.querySelector(".scores").innerText = 0;
        var counter = document.querySelector(".scores").innerText;

        const videoElement = document.getElementsByClassName("input_video")[0];
        const canvasElement = document.getElementsByClassName("output_canvas")[0];
        const ctx = canvasElement.getContext("2d");

        //setting
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

        //non-stop capture point
        async function onResults(results) {
          ctx.save();
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

          if (results.poseLandmarks) {
            detections = results;

            ctx.beginPath();
            ctx.rect(
              GridArray[num].x,
              GridArray[num].y,
              GridArray[num].width,
              GridArray[num].height
            );
            ctx.strokeStyle = "#FF0000";
            ctx.lineWidth = 10;
            ctx.stroke();

            //jump

            let leftAnklePoint = [
              results.poseLandmarks[27].x * 1742,
              results.poseLandmarks[27].y * 980,
            ];
            let rightAnklePoint = [
              results.poseLandmarks[28].x * 1742,
              results.poseLandmarks[28].y * 980,
            ];
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

              const test = await fetch(`/counter/${form.NewNickName.value}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ counter }),
              });
            }
            if (AnkleGridDistance < 250 && GridArray[num].y == 200) {
              counter++;
              document.getElementById("myAudio").play();

              document.querySelector(".scores").innerText = counter;
              num = Math.floor(Math.random() * 6);
              console.log("inner", num);

              const test = await fetch(`/counter/${form.NewNickName.value}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ counter }),
              });
            }
          }
          //draw landmark and connector
          drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 4,
          });
          drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 2 });
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
        pose.onResults(onResults);

        document.querySelector(".start").classList.add("hidden");

        let totalTime = 60;
        document.querySelector(".timer").innerHTML = totalTime;
        counter = 0;
        document.querySelector(".scores").innerHTML = counter;

        let countDown = setInterval(async function () {
          if (totalTime <= 0) {
            clearInterval(countDown);
            if (parseInt(counter) == parseInt(document.querySelector(".dual-count").innerText)) {
              alert("draw");
            } else if (
              parseInt(counter) > parseInt(document.querySelector(".dual-count").innerText)
            ) {
              alert("You win");
            } else if (
              parseInt(counter) < parseInt(document.querySelector(".dual-count").innerText)
            ) {
              alert("You lose");
            }
            document.querySelector(".dual-count").innerText = "";
            document.querySelector(".vsName").innerText = "";

            //single game play
            document.querySelector(".myName").innerText = "";

            document.querySelector(".start").classList.remove("hidden");

            await getPersonalAHighestRecord();

            console.log("counter", counter);
            ctx.restore();
            deleteRoom();
            time = 1;
            updateScore(counter);
          } else {
            totalTime -= 1;
            document.querySelector(".timer").innerHTML = totalTime;
          }
        }, 1000);

        //camera
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
      } else {
        return;
      }
    } else if (!result.success) {
      alert("Wrong Room Number");
    }
  });
});

//get the personal highest record
async function getPersonalAHighestRecord() {
  const resp = await fetch("/exes/exeA");
  const result = await resp.json();
  document.querySelector(".personalHighestScores").innerText = result.point;
}

export async function deleteRoom() {
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
    window.location.href = "pushUp.html";
  } else {
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
  }
  return Math.abs(angle);
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("joinClose")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  joinModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  joinModal.style.display = "none";
  deleteRoom();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == joinModal) {
    joinModal.style.display = "none";
    deleteRoom();
  }
};
