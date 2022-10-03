window.onload = async function () {
  await getExeARank();
  await getExeBRank();
  await getExeCRank();
};

async function getExeARank() {
  const resp = await fetch("/exes/exeA/rank");
  const rank = await resp.json();
  console.log("rankA", rank);
  let htmlStr = "";
  if (rank.length) {
    for (let i = 0; i < rank.length; i++) {
      htmlStr += /*html*/ `
  <tr>
    <th scope="row">${i + 1}</th>
    <td>${rank[i]["player_name"]}</td>
    <td>${rank[i]["max"]}</td>
  </tr>
 `;
    }
  }
  document.querySelector(".pushUpRank").innerHTML = htmlStr;
}

async function getExeBRank() {
  const resp = await fetch("/exes/exeB/rank");
  const rank = await resp.json();
  console.log("B:", rank);
  let htmlStr = "";
  if (rank.length) {
    for (let i = 0; i < rank.length; i++) {
      htmlStr += /*html*/ `
  <tr>
    <th scope="row">${i + 1}</th>
    <td>${rank[i]["player_name"]}</td>
    <td>${rank[i]["max"]}</td>
  </tr>
 `;
    }
  }

  document.querySelector(".buttonRank").innerHTML = htmlStr;
}

async function getExeCRank() {
  const resp = await fetch("/exes/exeC/rank");
  const rank = await resp.json();
  console.log("C:", rank);
  let htmlStr = "";
  if (rank.length) {
    for (let i = 0; i < rank.length; i++) {
      htmlStr += /*html*/ `
  <tr>
    <th scope="row">${i + 1}</th>
    <td>${rank[i]["player_name"]}</td>
    <td>${rank[i]["max"]}</td>
  </tr>
 `;
    }
  }

  document.querySelector(".bubbleRank").innerHTML = htmlStr;
}
