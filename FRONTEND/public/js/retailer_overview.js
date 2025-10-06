// E-Waste Contributions Chart
const wasteChart = new Chart(document.getElementById("wasteChart"), {
  type: "pie",
  data: {
      labels: ["Electronics", "Batteries", "Appliances", "Other"],
      datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: ["#0066ff", "#28a745", "#f39c12", "#e74c3c"],
      }]
  },
  options: {
      responsive: true
  }
});

// Monthly Contributions Chart
const monthlyChart = new Chart(document.getElementById("monthlyChart"), {
  type: "bar",
  data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
          label: "Amount",
          data: [70, 95, 80, 60, 75, 90],
          backgroundColor: "#2d6b2f"
      }]
  },
  options: {
      responsive: true,
      plugins: {
          tooltip: {
              callbacks: {
                  label: function (tooltipItem) {
                      return `Amount: ${tooltipItem.raw}`;
                  }
              }
          }
      }
  }
});