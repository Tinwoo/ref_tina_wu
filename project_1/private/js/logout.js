document.querySelector("#logout").addEventListener("click", async () => {
  console.log("logout");
  const resp = await fetch("/logout", {
    method: "DELETE",
  });

  if (resp.success) {
    alert("logged out");
    window.location.href = "./index.html";
  }
});
