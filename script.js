// ---------- 1. SAMPLE DATA ----------
// This is our "database": a list of food listings (all sample data)
let listings = [
  {
    id: 1,
    name: "Veg Biryani (sample)",
    qty: 20,
    location: "Main Cafeteria",
    deadline: "21:30",
    notes: "Cooked today, keep covered",
    status: "Available",
    code: ""
  },
  {
    id: 2,
    name: "Bread and Fruit Boxes (sample)",
    qty: 15,
    location: "Event Hall",
    deadline: "20:00",
    notes: "Packed, keep in a cool place",
    status: "Available",
    code: ""
  }
];

let nextId = 3;              // the id for the next new listing
let currentRole = "donor";   // who is using the page now: "donor" or "recipient"


// ---------- 2. ROLE ----------
// Called when the role drop-down at the top is changed
function changeRole() {
  currentRole = document.getElementById("roleSelect").value;
  clearMessages();
  renderAll();
}

// Called by the two buttons on the Home page
function chooseRole(role) {
  document.getElementById("roleSelect").value = role;
  currentRole = role;
  showSection(role);   // opens the Donor page or the Recipient page
}

// Empty the message lines
function clearMessages() {
  document.getElementById("donorMessage").innerText = "";
  document.getElementById("recipientMessage").innerText = "";
  document.getElementById("statusMessage").innerText = "";
}


// ---------- 3. SHOW ONE SECTION, HIDE THE REST ----------
function showSection(name) {
  let allSections = ["home", "donor", "recipient", "summary"];

  for (let i = 0; i < allSections.length; i++) {
    document.getElementById(allSections[i]).style.display = "none";
  }

  document.getElementById(name).style.display = "block";
  clearMessages();
  renderAll(); // refresh the cards and table every time
}


// ---------- 4. DONOR: ADD A NEW LISTING ----------
function addListing() {
  if (currentRole !== "donor") {
    document.getElementById("donorMessage").innerText =
      "Only a donor can add a listing. Change the role at the top.";
    return;
  }

  let name = document.getElementById("foodName").value;
  let qty = document.getElementById("foodQty").value;
  let location = document.getElementById("foodLocation").value;
  let deadline = document.getElementById("foodDeadline").value;
  let notes = document.getElementById("foodNotes").value;

  // Check that important boxes are not empty
  if (name === "" || qty === "" || location === "" || deadline === "") {
    document.getElementById("donorMessage").innerText =
      "Please fill in food item, quantity, location and deadline.";
    return;
  }

  let newListing = {
    id: nextId,
    name: name,
    qty: Number(qty),
    location: location,
    deadline: deadline,
    notes: notes,
    status: "Available",
    code: ""
  };

  listings.push(newListing);
  nextId = nextId + 1;

  // Clear the form boxes
  document.getElementById("foodName").value = "";
  document.getElementById("foodQty").value = "";
  document.getElementById("foodLocation").value = "";
  document.getElementById("foodDeadline").value = "";
  document.getElementById("foodNotes").value = "";

  document.getElementById("donorMessage").innerText =
    "Listing added! Recipients can now see it.";
  renderAll();
}


// ---------- 5. RECIPIENT: ACCEPT A LISTING (creates the pickup code) ----------
function acceptListing(id) {
  if (currentRole !== "recipient") {
    document.getElementById("recipientMessage").innerText =
      "Only a recipient can accept food. Change the role at the top.";
    return;
  }

  let newCode = "";
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      // make a random 4-digit code between 1000 and 9999
      newCode = String(Math.floor(1000 + Math.random() * 9000));
      listings[i].status = "Accepted";
      listings[i].code = newCode;
    }
  }

  renderAll();
  document.getElementById("recipientMessage").innerText =
    "Accepted! Your pickup code is " + newCode + ". You can see it again on the Status & Summary page.";
}


// ---------- 6. DONOR: CONFIRM PICKUP WITH THE CODE ----------
function confirmCollected(id) {
  if (currentRole !== "donor") {
    document.getElementById("statusMessage").innerText =
      "Only a donor can confirm pickup. Change the role at the top.";
    return;
  }

  let typedCode = document.getElementById("code-" + id).value;

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      if (typedCode === listings[i].code) {
        listings[i].status = "Collected";
        renderAll();
        document.getElementById("statusMessage").innerText =
          "Pickup confirmed. The code was correct.";
      } else {
        document.getElementById("statusMessage").innerText =
          "Wrong code. Ask the recipient for the correct 4-digit pickup code.";
      }
    }
  }
}


// ---------- 7. RECIPIENT: CONFIRM THAT THE FOOD WAS RECEIVED ----------
function confirmReceived(id) {
  if (currentRole !== "recipient") {
    document.getElementById("statusMessage").innerText =
      "Only a recipient can confirm receipt. Change the role at the top.";
    return;
  }

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      listings[i].status = "Completed";
    }
  }
  renderAll();
  document.getElementById("statusMessage").innerText =
    "Receipt confirmed. This listing is now Completed.";
}


// ---------- 8. DRAW THE RECIPIENT CARDS ----------
function renderRecipient() {
  let container = document.getElementById("listingContainer");
  container.innerHTML = "";
  let count = 0;

  for (let i = 0; i < listings.length; i++) {
    let item = listings[i];

    if (item.status === "Available") {
      count = count + 1;
      container.innerHTML += `
        <div class="card">
          <h3>${item.name}</h3>
          <p>Quantity: ${item.qty} meals</p>
          <p>Location: ${item.location}</p>
          <p>Collect before: ${item.deadline}</p>
          <p>Handling notes: ${item.notes}</p>
          <button onclick="acceptListing(${item.id})">Accept</button>
        </div>
      `;
    }
  }

  if (count === 0) {
    container.innerHTML = "<p>No food is available right now.</p>";
  }
}


// ---------- 9. DRAW THE STATUS TABLE AND NUMBERS ----------
function renderSummary() {
  let table = document.getElementById("statusTable");
  table.innerHTML = "";

  let accepted = 0;
  let completed = 0;
  let totalQty = 0;

  for (let i = 0; i < listings.length; i++) {
    let item = listings[i];
    let action = "";

    if (item.status === "Available") {
      action = "Waiting for a recipient";

    } else if (item.status === "Accepted") {
      accepted = accepted + 1;
      if (currentRole === "donor") {
        // the donor must type the code (the code is NOT shown to the donor)
        action = `<input type="text" id="code-${item.id}" maxlength="4" placeholder="Pickup code">
                  <button onclick="confirmCollected(${item.id})">Confirm Collected</button>`;
      } else {
        // the recipient sees the code and gives it to the donor at pickup
        action = `Your pickup code: <strong>${item.code}</strong><br>Give this code to the donor at pickup.`;
      }

    } else if (item.status === "Collected") {
      accepted = accepted + 1;
      if (currentRole === "recipient") {
        action = `<button onclick="confirmReceived(${item.id})">Confirm Received</button>`;
      } else {
        action = "Waiting for the recipient to confirm receipt";
      }

    } else if (item.status === "Completed") {
      accepted = accepted + 1;
      completed = completed + 1;
      totalQty = totalQty + item.qty;
      action = "Done";
    }

    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.location}</td>
        <td><span class="status ${item.status}">${item.status}</span></td>
        <td>${action}</td>
      </tr>
    `;
  }

  document.getElementById("totalListings").innerText = listings.length;
  document.getElementById("totalAccepted").innerText = accepted;
  document.getElementById("totalCompleted").innerText = completed;
  document.getElementById("totalQty").innerText = totalQty;
}


// ---------- 10. REFRESH EVERYTHING ----------
function renderAll() {
  renderRecipient();
  renderSummary();
}


// ---------- 11. START THE PAGE ----------
showSection("home"); // show only the Home section when the page opens
