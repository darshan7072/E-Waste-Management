 
 document.addEventListener("DOMContentLoaded", fetchOrders);

async function fetchOrders() {
  const tableBody = document.getElementById("orderTableBody");
  const total = document.getElementById("totalCount");
  const pending = document.getElementById("pendingCount");
  const fulfilled = document.getElementById("fulfilledCount");

  const spinner = document.querySelector(".spinner");
  ////
const token = localStorage.getItem("token"); // ⬅️ get token stored after login

spinner.style.display = "block"; // Show spinner
  try {
    const res = await fetch("http://localhost:5500/api/orders/myorders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ Auth header
      },
    });

    spinner.style.display = "none"; // Hide loading spinner
   if (!res.ok) throw new Error("API Error");

    const orders = await res.json();
    console.log("✅ Orders fetched:", orders);

    // Clear loading row
    tableBody.innerHTML = "";

    if (orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6">No orders found.</td></tr>`;
      return;
    }

    let pendingCount = 0;
    let fulfilledCount = 0;

    orders.forEach((order, i) => {
      if (order.status === "fulfilled") fulfilledCount++;
      else pendingCount++;

      const row = document.createElement("tr");
      row.innerHTML = `
  <td>${i + 1}</td>
  <td>${order.ewasteType || "N/A"}</td>
  <td>${order.description || "N/A"}</td>
  <td>${order.collectionAddress || "N/A"}</td>
  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
  <td><span class="status ${order.status === "fulfilled" ? "fulfilled" : "pending"}">
    ${order.status || "Pending"}
  </span></td>
`;

      tableBody.appendChild(row);
    });

    total.textContent = orders.length;
    pending.textContent = pendingCount;
    fulfilled.textContent = fulfilledCount;

  } catch (error) {
    console.error("❌ Error:", error);
    tableBody.innerHTML = `<tr><td colspan="6">❌ Could not load orders.</td></tr>`;
  }
}

// Support both static load and dynamic load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchOrders);
} else {
  fetchOrders();
}











// async function fetchOrders() {
//   const token = localStorage.getItem("token");
//   const tableBody = document.getElementById("orderTableBody");
//   const total = document.getElementById("totalCount");
//   const pending = document.getElementById("pendingCount");
//   const fulfilled = document.getElementById("fulfilledCount");

//   try {
//     const res = await fetch("http://localhost:5500/api/orders/myorders", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) throw new Error("API Error");

//     const orders = await res.json();
//     console.log("✅ Orders fetched:", orders);

//     tableBody.innerHTML = "";

//     if (orders.length === 0) {
//       tableBody.innerHTML = `<tr><td colspan="6">No orders found.</td></tr>`;
//       return;
//     }

//     let pendingCount = 0;
//     let fulfilledCount = 0;

//     orders.forEach((order, i) => {
//       if (order.status === "fulfilled") fulfilledCount++;
//       else pendingCount++;

//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${i + 1}</td>
//         <td>${order.userId?.fullName || "Unknown"}</td>
//         <td>${order.userId?.email || "-"}</td>
//         <td>${order.items?.map(item => item.itemName).join(", ") || "N/A"}</td>
//         <td>${new Date(order.createdAt).toLocaleDateString()}</td>
//         <td><span class="status ${order.status === "fulfilled" ? "fulfilled" : "pending"}">
//           ${order.status || "Pending"}
//         </span></td>
//       `;
//       tableBody.appendChild(row);
//     });

//     total.textContent = orders.length;
//     pending.textContent = pendingCount;
//     fulfilled.textContent = fulfilledCount;

//   } catch (error) {
//     console.error("❌ Error fetching orders:", error);
//     tableBody.innerHTML = `<tr><td colspan="6">❌ Could not load orders.</td></tr>`;
//   }
// }
