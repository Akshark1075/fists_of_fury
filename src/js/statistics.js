import Stats from "../../libs/stats.js";

/*********Function for showing the performance of the webpage*********/
function showStatistics(container) {
  const stats = Stats();
  stats.showPanel(0); // 0 = fps, 1 = ms, 2 = mb, 3 = custom
  container.appendChild(stats.dom);
  return stats;
}
export default showStatistics;
