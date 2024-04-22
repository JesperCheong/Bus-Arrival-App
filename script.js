async function fetchArrivalData(busStopId) {
  try {
    const response = await fetch(`https://arrivelah2.busrouter.sg/?id=${busStopId}`)
    const data = await response.json();
    console.log(data);
    if (data.services && !(data.services.length === 0)) {
      busArrivalData = data.services.map(service => {
        const { no, operator, next, next2, next3 } = service || {};
        const duration_next = next ? Math.floor(next.duration_ms / 60000) : null;
        const duration_next2 = next2 ? Math.floor(next2.duration_ms / 60000) : null;
        const duration_next3 = next3 ? Math.floor(next3.duration_ms / 60000) : null;

        return {
          no,
          operator,
          duration_next,
          duration_next2,
          duration_next3
        };
      });
    } else {
      console.log("No service data available.");
      alert("No service data available.");
      busArrivalData = [];
    }
    console.log(busArrivalData);
  } catch (error) {
    console.warn(error);
    alert(error);
  }
}

function renderBusInfo() {
  spinner.classList.add("d-none");
  const filterBtn = document.getElementById("filterBtn");
  filterBtn.classList.remove("d-none");
  //clear list
  while (busesContainer.firstChild) {
      busesContainer.removeChild(busesContainer.firstChild);
  }
  // filter list
  const hashValue = window.location.hash.substring(1);
  const filteredList = busArrivalData.filter(bus => {
    return (hashValue === "All" || bus.no === hashValue);
  })
  // render filtered list
  filteredList.forEach((bus) => {
    const busInfoWrap = document.createElement("div")
    busInfoWrap.className = "grid-container";
    for (i = 1; i <= 6; i++) {
      const div = document.createElement("div");
      div.className = `item${i}`;
      switch (i) {
        case 1:
          div.textContent = bus.no;
          const span = document.createElement("span");
          span.textContent = bus.operator;
          div.appendChild(span);
          break;
        case 2:
          div.textContent = "Next bus arrives in...";
          break;
        case 3:
          div.textContent = "minute(s)";
          break;
        case 4:
          if (bus.duration_next < 0) {
            bus.duration_next = 0;
          } else if (bus.duration_next === null) {
            bus.duration_next = "-"
          }
          div.textContent = bus.duration_next;
          break;
        case 5:
          if (bus.duration_next2 < 0) {
            bus.duration_next2 = 0;
          } else if (bus.duration_next === null) {
            bus.duration_next2 = "-"
          }
          div.textContent = bus.duration_next2;
          break;
        case 6:
          if (bus.duration_next3 < 0) {
            bus.duration_next3 = 0;
          } else if (bus.duration_next3 === null) {
            bus.duration_next3 = "-"
          }
          div.textContent = bus.duration_next3;
          break;
      }
      busInfoWrap.appendChild(div);
    }
    busesContainer.appendChild(busInfoWrap);

  });

}
function renderFilterList() {
  ///clear list
  const busFilter = document.getElementById("busFilter");
  while (busFilter.children.length >= 2) {
        busFilter.removeChild(busFilter.children[1]);
  }
  // grab unique bus
  const uniqueUserIds = [...new Set(busArrivalData.map(item => item.no))];
  // create options for filter
  uniqueUserIds.forEach((id) => {
    const optionList = document.createElement("li");
    const optionLink = document.createElement("a");
    optionLink.href = `#${id}`
    optionLink.className = "dropdown-item";
    optionLink.textContent = id;
    optionList.appendChild(optionLink);
    busFilter.appendChild(optionList);
  })
}

async function search() {
  spinner.classList.remove("d-none");
  const busStopIdInput = document.getElementById("busStopIdInput").value;
  await fetchArrivalData(busStopIdInput);
  renderFilterList();
  renderBusInfo();

}

let busArrivalData;
const busFilterBtn = document.getElementById("busFilter");
const busesContainer = document.getElementById("busesContainer");
const spinner = document.getElementById("loading-spinner");
window.addEventListener("hashchange", renderBusInfo);
