const inp1 = document.querySelector(".input1");
const inp2 = document.querySelector(".input2");
const inp3 = document.querySelector(".input3");
const inp4 = document.querySelector(".input4");
const out = document.querySelector(".output");

const defaultNotes = [2000, 500, 100, 50, 20, 10, 5, 1];
document.getElementById("input2").style.display = "none";
document.getElementById("check_btn").style.display = "none";
document.getElementById("input3").style.display = "none";
document.getElementById("input4").style.display = "none";

function nextbtn_onclick() {
  let val1 = Number(inp1.value);
  if (val1 == 0) {
    alert("Enter The Bill Amount Bruh");
  } else {
    document.getElementById("input2").style.display = "block";
    document.getElementById("next_btn").style.display = "none";
    document.getElementById("check_btn").style.display = "block";
    document.getElementById("input3").style.display = "block";
    document.getElementById("input4").style.display = "block";
  }
}

function getSelectedNotes() {
  let selectedNotes = [];
  let inputNotes = inp4.value;
  if (inputNotes) {
    selectedNotes = inputNotes.split(",").map((note) => Number(note.trim()));
  } else {
    selectedNotes = [...defaultNotes];
  }

  selectedNotes.sort((a, b) => b - a);
  return selectedNotes;
}

function btn_onclick() {
  let val1 = Number(inp1.value);
  let val2 = Number(inp2.value);
  let numOfPeople = Number(inp3.value) || 1;
  let outputStr = "";

  let selectedNotes = getSelectedNotes();
  if (val1 == 0 || val2 == 0) {
    alert("Please fill all the required fields.");
    return;
  }

  let returnAmount = val2 - val1;

  if (val1 > val2) {
    outputStr = `The cash paid is less than the bill. You still need to pay ${
      val1 - val2
    } Rs.`;
  } else {
    // Show the total return amount and split the return among people
    let splitReturnAmount = returnAmount / numOfPeople;
    outputStr = `The total return amount is: ${returnAmount} Rs.<br>
    Each person will receive: ${splitReturnAmount.toFixed(2)} Rs.<br><br>`;
    // Calculate the number of notes required for the return amount and split them
    outputStr +=
      "<table border='1'><tr><th>Note</th><th>Quantity per person</th><th>Total Quantity</th></tr>";
    let remainingAmount = returnAmount;
    // Track the total notes for all people
    let totalNotes = {};
    // Step 1: Try to use the preferred notes first
    for (let note of selectedNotes) {
      let count = Math.floor(remainingAmount / note);
      if (count > 0) {
        let notesPerPerson = Math.floor(count / numOfPeople); // Dividing notes among people
        totalNotes[note] = notesPerPerson * numOfPeople; // Storing the total quantity for all people
        outputStr += `<tr><td>${note} Rs</td><td>${notesPerPerson}</td><td>${totalNotes[note]}</td></tr>`;
        remainingAmount -= notesPerPerson * numOfPeople * note; // Subtract total notes
      }
    }
    // Step 2: If there's remaining amount, use the smaller notes
    if (remainingAmount > 0) {
      let remainingNotes = defaultNotes.filter(
        (note) => !selectedNotes.includes(note)
      ); // Notes that were not selected by the user
      // Use the smaller denominations to complete the remaining amount
      for (let note of remainingNotes) {
        let count = Math.floor(remainingAmount / note);
        if (count > 0) {
          let notesPerPerson = Math.floor(count / numOfPeople);
          totalNotes[note] = notesPerPerson * numOfPeople;
          outputStr += `<tr><td>${note} Rs</td><td>${notesPerPerson}</td><td>${totalNotes[note]}</td></tr>`;
          remainingAmount -= notesPerPerson * numOfPeople * note;
        }
      }
      // If any remaining amount is not returned, show an error message
      if (remainingAmount > 0) {
        outputStr +=
          "<br>Note: Remaining amount can't be returned with the selected denominations.";
      }
    }
    outputStr += "</table>";
  }
  out.innerHTML = outputStr;
}
