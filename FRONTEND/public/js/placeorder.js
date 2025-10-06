document.getElementById("orderForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("You must be logged in to place an order.");
    return;
  }

  const ewasteType = document.getElementById("ewaste-type").value;
  const description = document.getElementById("description").value;
  const collectionDate = document.getElementById("collection-date").value;
  const timeSlot = document.getElementById("time-slot").value;
  const address = document.getElementById("address").value;

  const orderData = {
    userId,
    items: [
      {
        ewasteType,
        description,
        collectionDate,
        timeSlot,
        address,
      }
    ]
  };

  try {
    const response = await fetch("http://localhost:5500/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Order placed successfully!");
      document.getElementById("orderForm").reset();
    } else {
      alert("❌ Failed: " + result.message);
    }

  } catch (err) {
    console.error("Error placing order:", err);
    alert("Something went wrong. Please try again.");
  }
});

