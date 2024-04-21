async function fetchArrivalData() {
  try {
    const response = await fetch(`https://arrivelah2.busrouter.sg/?id=83139`)
    const data = await response.json();
    console.log(data);
    if (data.services) {
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
      console.log("No services data available.");
      alert("No services data available.");
    }
    console.log(busArrivalData);
  } catch (error) {
    console.warn(error);
    alert(error);
  }
}

async function render() {
  await fetchArrivalData();
  renderBusInfo();
}

function renderBusInfo() {
  const busesContainer = document.getElementById("busesContainer");

  busArrivalData.forEach((bus) => {
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
          div.textContent = "min(s)";
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
            bus.duration_next = 0;
          } else if (bus.duration_next3 === null) {
            bus.duration_next3 = "-"
          }
          div.textContent = bus.duration_next3;
          break;
      }
      busInfoWrap.appendChild(div);
      console.log(busInfoWrap);
    }
    busesContainer.appendChild(busInfoWrap);

  });

}

let busArrivalData;
render();
