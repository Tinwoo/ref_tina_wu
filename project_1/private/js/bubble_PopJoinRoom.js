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
        socket.on("scores", async (data) => {
          const msg = data.scores;
          console.log(msg);

          if (data.scores == undefined) {
            document.querySelector(".dual-count").innerText = 0;
          }
          document.querySelector(".dual-count").innerText = data.scores;
          document.getElementById("myAudio").play();

          console.log("counter", msg);
        });

        document.querySelector(".dual-count").innerText = 0;
        document.querySelector(".vsName").innerText = hostName;

        //single game play
        document.querySelector(".myName").innerText = member;

        //automatic start
        let isGameStart = true;
        // hidden button
        document.querySelector(".start").classList.add("hidden");
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

        // #### draw random circles ####
        class Circle {
          constructor(x, y, r, c) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.c = c;
            this.hitTime = 0;

            this.dx = 8;
            this.dx *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
            this.dy = 8;
            this.dy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;

            this.drawCircle = function () {
              ctx.beginPath();
              ctx.fillStyle = this.c;
              ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowColor = "white";
              ctx.shadowBlur = 25;
            };

            this.animate = function () {
              this.x += this.dx;
              this.y += this.dy;

              if (this.x + this.r > canvasElement.width || this.x - this.r < 0) {
                this.dx = -this.dx;
              }
              if (this.y + this.r > canvasElement.height || this.y - this.r < 0) {
                this.dy = -this.dy;
              }

              this.drawCircle();
            };
          }
        }

        let r = 0;
        let x = 0;
        let y = 0;
        let c = 0;

        let color = "rgb(100,200,200)";
        let counter = 0;

        // #### create circles ####
        const circles = [];
        for (let i = 0; i < 15; i++) {
          r = Math.floor(Math.random() * 50) + 60;
          x = Math.floor(Math.random() * (canvasElement.width - r * 2)) + r;
          y = Math.floor(Math.random() * (canvasElement.height - r * 2)) + r;
          c = color;
          circles.push(new Circle(x, y, r, c));
        }

        // ########

        async function updateCircles(landmarkX, landmarkY) {
          for (let i = 0; i < circles.length; i++) {
            circles[i].animate();
            if (
              landmarkX !== null &&
              landmarkY !== null &&
              Math.sqrt((landmarkX - circles[i].x) ** 2 + (landmarkY - circles[i].y) ** 2) < 50 &&
              circles[i].hitTime === 0
            ) {
              circles[i].hitTime = 1;
              circles[i].c = "gold";

              circles[i].animate();

              let audio = new Audio("fast_sword.mp3");
              audio.play();

              circles[i].r = Math.floor(Math.random() * 50) + 60;
              circles[i].x =
                Math.floor(Math.random() * (canvasElement.width - circles[i].r * 2)) + circles[i].r;
              circles[i].y =
                Math.floor(Math.random() * (canvasElement.height - circles[i].r * 2)) +
                circles[i].r;

              counter = 0;
              scores += 1;
              document.querySelector(".scores").innerHTML = scores;

              const test = await fetch(`/score/${form.NewNickName.value}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ scores }),
              });
              console.log("scores of KungFu", scores);
            } else if (
              circles[i].hitTime === 1 &&
              landmarkX !== null &&
              landmarkY !== null &&
              Math.sqrt((landmarkX - circles[i].x) ** 2 + (landmarkY - circles[i].y) ** 2) < 50
            ) {
              circles[i].hitTime = 0;

              circles[i].c = color;
              circles[i].animate();
              if (counter) {
                let audio = new Audio("fast_sword.mp3");
                audio.play();

                circles[i].r = Math.floor(Math.random() * 50) + 60;
                circles[i].x =
                  Math.floor(Math.random() * (canvasElement.width - circles[i].r * 2)) +
                  circles[i].r;
                circles[i].y =
                  Math.floor(Math.random() * (canvasElement.height - circles[i].r * 2)) +
                  circles[i].r;

                scores += 1;
                document.querySelector(".scores").innerHTML = scores;
                const test = await fetch(`/score/${form.NewNickName.value}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ scores }),
                });
                console.log("scores of KungFu", scores);
              }
            }
          }
        }

        let landmark = null;
        let landmarkX = 300;
        let landmarkY = 300;

        let scores = 0;
        let isPalmMode = false;
        let isBoxingMode = false;
        let isKungFuMode = false;

        async function onResults(results) {
          ctx.save();
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

          if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
              if (isBoxingMode) {
                let landmarkMiddle = landmarks[10];
                let landmarkMiddleX = Math.floor(landmarkMiddle.x * 1742);
                let landmarkMiddleY = Math.floor(landmarkMiddle.y * 980);
                landmarkX = landmarkMiddleX;
                landmarkY = landmarkMiddleY;

                //show the touching area
                ctx.beginPath();
                console.log(landmarkX, landmarkY);
                ctx.arc(landmarkX, landmarkY, 70, 0, 5 * Math.PI);
                ctx.fillStyle = "rgba(250,0,130,0.9)";
                ctx.fill();
                ctx.stroke();
              } else if (isKungFuMode) {
                let landmarkMiddleTop = landmarks[12];
                let landmarkMiddleTopX = Math.floor(landmarkMiddleTop.x * 1742);
                let landmarkMiddleTopY = Math.floor(landmarkMiddleTop.y * 980);
                landmarkX = landmarkMiddleTopX;
                landmarkY = landmarkMiddleTopY;

                //show the touching area
                ctx.beginPath();
                console.log(landmarkX, landmarkY);
                ctx.arc(landmarkX, landmarkY, 70, 0, 5 * Math.PI);
                ctx.fillStyle = "rgba(250,0,130,0.9)";
                ctx.fill();
                ctx.stroke();

                drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                  color: "#00FF00",
                  lineWidth: 5,
                });
                drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 20 });
              } else {
                let landmarkIndex = landmarks[5];
                let landmarkIndexX = Math.floor(landmarkIndex.x * 1742);
                let landmarkIndexY = Math.floor(landmarkIndex.y * 980);

                let landmarkPinky = landmarks[17];
                let landmarkPinkyX = Math.floor(landmarkPinky.x * 1742);
                let landmarkPinkyY = Math.floor(landmarkPinky.y * 980);

                let landmarkWrist = landmarks[0];
                let landmarkWristX = Math.floor(landmarkWrist.x * 1742);
                let landmarkWristY = Math.floor(landmarkWrist.y * 980);

                let a = Math.sqrt(
                  (landmarkIndexX - landmarkPinkyX) ** 2 + (landmarkIndexY - landmarkPinkyY) ** 2
                );
                let b = Math.sqrt(
                  (landmarkIndexX - landmarkWristX) ** 2 + (landmarkIndexY - landmarkWristY) ** 2
                );
                let c = Math.sqrt(
                  (landmarkPinkyX - landmarkWristX) ** 2 + (landmarkPinkyY - landmarkWristY) ** 2
                );
                landmarkX = Math.floor(
                  (a * landmarkWristX + b * landmarkPinkyX + c * landmarkIndexX) / (a + b + c)
                );
                landmarkY = Math.floor(
                  (a * landmarkWristY + b * landmarkPinkyY + c * landmarkIndexY) / (a + b + c)
                );

                //show the incentre: circle
                ctx.beginPath();
                console.log(landmarkX, landmarkY);
                ctx.arc(landmarkX, landmarkY, 70, 0, 5 * Math.PI);
                ctx.fillStyle = "rgba(250,0,130,0.9)";
                ctx.fill();
                ctx.stroke();
              }
            }
          }
          if (isGameStart) {
            updateCircles(landmarkX, landmarkY);
          }

          ctx.restore();
        }

        // ##### choose mode for the game#####
        document.querySelector(".BoxingMode").addEventListener("click", () => {
          isBoxingMode = true;
          isKungFuMode = false;
          isPalmMode = false;
        });

        document.querySelector(".KungFuMode").addEventListener("click", () => {
          isKungFuMode = true;
          isBoxingMode = false;
          isPalmMode = false;
        });

        document.querySelector(".PalmMode").addEventListener("click", () => {
          isPalmMode = true;
          isBoxingMode = false;
          isKungFuMode = false;
        });

        //#### add key for start and restart the game ####

        //set timer
        if (isGameStart) {
          let totalTime = 60;
          document.querySelector(".timer").innerHTML = totalTime;
          scores = 0;
          document.querySelector(".scores").innerHTML = scores;

          let countDown = setInterval(async function () {
            if (totalTime <= 0) {
              clearInterval(countDown);
              deleteRoom();
              isGameStart = false;
              document.querySelector(".start").classList.remove("hidden");
              scores = document.querySelector(".scores").innerText;
              await insertExeC(scores);
              await updateHighestScore();
              if (parseInt(scores) == parseInt(document.querySelector(".dual-count").innerText)) {
                alert("draw");
              } else if (
                parseInt(scores) > parseInt(document.querySelector(".dual-count").innerText)
              ) {
                alert("You win");
              } else if (
                parseInt(scores) < parseInt(document.querySelector(".dual-count").innerText)
              ) {
                alert("You lose");
              }
              window.location.href = "bubble.html";
            } else {
              totalTime -= 1;
              document.querySelector(".timer").innerHTML = totalTime;
            }
          }, 1000);
        }
      } else {
        return;
      }
    } else if (!result.success) {
      alert("Please try again");
    }
  });
});

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
//get the personal highest record
async function updateHighestScore() {
  const resp = await fetch("/exes/exeC");
  const result = await resp.json();
  document.querySelector(".personalHighestScores").innerText = result.point;
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
  } else {
    alert(result.message);
  }
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
