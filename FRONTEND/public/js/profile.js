const token = localStorage.getItem("token"); // Ensure you store the JWT after login

const profileDetails = document.getElementById("profileDetails");
const editForm = document.getElementById("editForm");
const editBtn = document.getElementById("editBtn");
const cancelEdit = document.getElementById("cancelEdit");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phoneNumber = document.getElementById("phoneNumber");
const address = document.getElementById("address");
const profession = document.getElementById("profession");
const joinedDate = document.getElementById("joinedDate");
const bio = document.getElementById("bio");

// Fetch profile
async function loadProfile() {
  const res = await fetch("http://localhost:5500/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();

  fullName.textContent = data.fullName || "-";
  email.textContent = data.email;
  phoneNumber.textContent = data.phoneNumber || "-";
  address.textContent = data.address || "-";
  profession.textContent = data.profession || "-";
  joinedDate.textContent = new Date(data.joinedDate).toDateString();
  bio.textContent = data.bio || "-";

  // Fill form
  editForm.fullName.value = data.fullName;
  editForm.phoneNumber.value = data.phoneNumber || "";
  editForm.address.value = data.address || "";
  editForm.profession.value = data.profession || "";
  editForm.bio.value = data.bio || "";
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
  const updates = {
    fullName: editForm.fullName.value,
    phoneNumber: editForm.phoneNumber.value,
    address: editForm.address.value,
    profession: editForm.profession.value,
    bio: editForm.bio.value
  };

  const res = await fetch("http://localhost:5500/api/profile", {
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
