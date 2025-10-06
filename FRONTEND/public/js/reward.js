document.addEventListener("DOMContentLoaded", function () {
    let totalPoints = 10;
    const pointsDisplay = document.querySelector(".reward-box .points");
    const redeemButtons = document.querySelectorAll(".redeem");

    redeemButtons.forEach(button => {
        button.addEventListener("click", function () {
            const cost = parseInt(this.getAttribute("data-cost"));
            if (totalPoints >= cost) {
                totalPoints -= cost;
                pointsDisplay.textContent = totalPoints;
                alert("Redemption successful!");
            } else {
                alert("Not enough points to redeem this item.");
            }
        });
    });
});
