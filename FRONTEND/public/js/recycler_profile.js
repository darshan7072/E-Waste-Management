const token = localStorage.getItem("token");
    const profileDetails = document.getElementById("profileDetails");
    const editForm = document.getElementById("editForm");
    const editBtn = document.getElementById("editBtn");
    const cancelEdit = document.getElementById("cancelEdit");

    const fields = ["fullName", "email", "phoneNumber", "organization", "serviceArea", "address", "joinedDate", "bio"];

    function fillProfile(data) {
      fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.textContent = data[field] || "-";
        if (editForm[field]) editForm[field].value = data[field] || "";
      });
    }

    async function loadProfile() {
      const res = await fetch("http://localhost:5500/api/recycler/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      fillProfile(data);
    }

    editBtn.onclick = () => {
      profileDetails.style.display = "none";
      editForm.style.display = "block";
    };

    cancelEdit.onclick = () => {
      editForm.style.display = "none";
      profileDetails.style.display = "block";
    };

    editForm.onsubmit = async (e) => {
      e.preventDefault();
      const updates = {};
      fields.forEach(field => {
        if (editForm[field]) updates[field] = editForm[field].value;
      });
      const res = await fetch("http://localhost:5500/api/recycler/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        alert("Profile updated successfully!");
        editForm.style.display = "none";
        profileDetails.style.display = "block";
        loadProfile();
      } else {
        alert("Error updating profile");
      }
    };

    loadProfile();