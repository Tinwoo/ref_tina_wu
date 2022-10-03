window.onload = function () {
  signup();
};

function signup() {
  document.querySelector("#form-signup").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const player_name = form.player_name.value;
    const username = form.username.value;
    const password = form.password.value;
    console.log("player_name:", player_name, "username:", username, "password:", password);
    const resp = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_name, username, password }),
    });

    const result = await resp.json();
    if (result.message == "please enter all fields") {
      alert("please enter all fields");
      window.location.href = "signup.html";
    } else if (result.message == "Email and player name already exist") {
      alert("Email and player name already exist");
      window.location.href = "signup.html";
    } else if (result.message == "Email already exists") {
      alert("Email already exists");
      window.location.href = "signup.html";
    } else if (result.message == "Player name already exists") {
      alert("Player name already exists");
      window.location.href = "signup.html";
    } else if (result.success === true) {
      alert("Account created");
      window.location.href = "login.html";
    } else {
      alert("please enter all fields");
    }
  });
}

function checkEmail() {
  const email = document.querySelector("#email");
  const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  if (!filter.test(email.value)) {
    alert("Please provide a valid email address");
    email.focus;
    return false;
  }
}

function validateForm() {
  const player_name = form.player_name.value;
  const password = form.password.value;

  if (player_name == null || player_name == "") {
    alert("Name can't be blank");
    return false;
  } else if (password.length < 4) {
    alert("Password must be at least 4 characters long.");
    return false;
  }
}
