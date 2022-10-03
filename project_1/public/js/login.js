let user;

window.onload = async () => {
  initLoginForm();
};

function initLoginForm() {
  document.querySelector("#login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    console.log("username:", e.target.username.value);
    console.log("password:", e.target.password.value);
    const resp = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await resp.json();
    if (result.success) {
      console.log(result.message);
      alert("logged in");
      window.location.href = "record.html";
    } else {
      alert("invalid email or password!");
      console.log("Error !!!", result.message);
    }
  });
}
