async function fetchArrivalData() {
  try {
    const response = await fetch(`https://arrivelah2.busrouter.sg/?id=83139`)
    const data = await response.json();
    console.log(data);
    if (data.services) {
      busArrivalData = data.services.map(service => {
        const { no, operator, next, next2, next3 } = service || {};
        const duration_ms_next = next ? next.duration_ms : null;
        const duration_ms_next2 = next2 ? next2.duration_ms : null;
        const duration_ms_next3 = next3 ? next3.duration_ms : null;

        return {
          no,
          operator,
          duration_ms_next,
          duration_ms_next2,
          duration_ms_next3
        };
      });
    }
    console.log(busArrivalData);
  } catch (error) {
    console.warn(error);
    alert(error);
  }
}

let busArrivalData;
fetchArrivalData();