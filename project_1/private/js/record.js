window.onload = async () => {
  await loadPersonalARecord();
  await loadPersonalBRecord();
  await loadPersonalCRecord();
  await getPlayerNameById();
};

async function loadPersonalARecord() {
  const resp = await fetch("/exes/exeA");
  const result = await resp.json();
  console.log(result);
  let htmlStrA = /*html*/ `
        <th scope="col" width="100px" ><i class="fas fa-crown"></i></th>
        <th scope="col"  width="400px">Push Up</th>   
        <th scope="col">${result.point}</td>
    `;

  document.querySelector("#pushup").innerHTML = htmlStrA;
}

async function loadPersonalBRecord() {
  const resp = await fetch("exes/exeB");
  const result = await resp.json();

  let htmlStrB = /*html*/ `
  
        <th scope="col"  width="100px"><i class="fas fa-crown"></i></th>
        <th scope="col"  width="400px">button</th>   
        <th scope="col">${result.point}</td>
 
    `;

  document.querySelector("#button").innerHTML = htmlStrB;
}

async function getPlayerNameById() {
  //get userinfo
  const resp = await fetch("/users/info", {
    METHOD: "GET",
  });

  const result = await resp.json();

  const member = result.user.player_name;
  const capitalizedName = member[0].toUpperCase() + member.substring(1);
  document.querySelector("#user").innerText = capitalizedName;
}

async function loadPersonalCRecord() {
  const resp = await fetch("exes/exeC");
  const result = await resp.json();

  let htmlStrC = /*html*/ `
  
        <th scope="col" width="100px" ><i class="fas fa-crown"></i></th>
        <th scope="col"  width="400px">bubble</th>   
        <th scope="col">${result.point}</td>
 
    `;

  document.querySelector("#bubble").innerHTML = htmlStrC;
}
