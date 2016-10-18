(function() {
  var pathTemplate = "./assets/sound-fx/smb_%s.wav";
  var soundFxMappings = {
    'Q': "1-up",
    'W': "bowserfall",
    'E': "bowserfire",
    'R': "breakblock",
    'T': "bump",
    'Y': "coin",
    'U': "fireball",
    'I': "fireworks",
    'O': "flagpole",
    'P': "gameover",
    'A': "jump-super",
    'S': "jumpsmall",
    'D': "kick",
    'F': "mariodie",
    'G': "pause",
    'H': "pipe",
    'J': "powerup_appears",
    'K': "powerup",
    'L': "stage_clear",
    'Z': "stomp",
    'X': "vine",
    'C': "warning",
    'V': "world_clear"
  };

  createjs.Sound.alternateExtensions = ["wav"];

  registerSounds(soundFxMappings, pathTemplate);

  drawKeyboard(soundFxMappings);

  registerKeyPress(soundFxMappings);

  renderLegends(soundFxMappings);
})();

function registerSounds(soundFxMappings, pathTemplate) {
  for (var key in soundFxMappings) {
    var id = soundFxMappings[key];

    createjs.Sound.registerSound(
      pathTemplate.replace("%s", id),
      id,
      1,
      "",
      {interrupt: createjs.Sound.INTERRUPT_ANY});
  }
}

function registerKeyPress(soundFxMappings) {
  document.onkeypress = function(event) {
    if (event.constructor.name.localeCompare("KeyboardEvent") === 0) {
      var char = event.key;

      if (!char) return;

      activateButton(char.toUpperCase(), soundFxMappings[char.toUpperCase()]);
    }
  };
}

function renderLegends(soundFxMappings){
  var table = document.getElementById('legends');

  var index = 1;
  for (var key in soundFxMappings) {
    var keyCellContent =
      "<div id=\"legend" +
      key +
      "\" onclick=\"activateButton('legend" +
      key + "', '" +
      soundFxMappings[key]+
      "')\" class='keycap-shadow'><div class='keycap'>" +
      key +
      "</div></div>";

    var row = table.insertRow(index++);
    row.insertCell(0).innerHTML = keyCellContent;
    row.insertCell(1).innerHTML = soundFxMappings[key];
  }
}

function playSound(soundID) {
  createjs.Sound.play(soundID);
}

function activateButton(keycapID, soundID) {
  var keycap = document.getElementById(keycapID);

  keycap.className += " pseudo-active";
  keycap.children[0].className += " pseudo-active";

  playSound(soundID);
}

function drawKeyboard(soundFxMappings) {
  var keyboardMeta = {
    1: [
      { id: "`", status: "enabled" },
      { id: "1", status: "enabled" },
      { id: "2", status: "enabled" },
      { id: "3", status: "enabled" },
      { id: "4", status: "enabled" },
      { id: "5", status: "enabled" },
      { id: "6", status: "enabled" },
      { id: "7", status: "enabled" },
      { id: "8", status: "enabled" },
      { id: "9", status: "enabled" },
      { id: "0", status: "enabled" },
      { id: "-", status: "enabled" },
      { id: "=", status: "enabled" },
      { id: "bksp", status: "disabled", "class": "bksp"}
    ],
    2: [
      { id: "tab", status: "disabled", "class": "tab"},
      { id: "Q", status: "enabled" },
      { id: "W", status: "enabled" },
      { id: "E", status: "enabled" },
      { id: "R", status: "enabled" },
      { id: "T", status: "enabled" },
      { id: "Y", status: "enabled" },
      { id: "U", status: "enabled" },
      { id: "I", status: "enabled" },
      { id: "O", status: "enabled" },
      { id: "P", status: "enabled" },
      { id: "[", status: "enabled" },
      { id: "]", status: "enabled" },
      { id: "\\", status: "enabled" }
    ],
    3: [
      { id: "capslock", status: "disabled", "class": "capslock" },
      { id: "A", status: "enabled" },
      { id: "S", status: "enabled" },
      { id: "D", status: "enabled" },
      { id: "F", status: "enabled" },
      { id: "G", status: "enabled" },
      { id: "H", status: "enabled" },
      { id: "J", status: "enabled" },
      { id: "K", status: "enabled" },
      { id: "L", status: "enabled" },
      { id: ";", status: "enabled" },
      { id: "'", status: "enabled" },
      { id: "enter", status: "disabled", "class": "enter"}
    ],
    4: [
      { id: "shift", status: "enabled", "class": "shift" },
      { id: "Z", status: "enabled" },
      { id: "X", status: "enabled" },
      { id: "C", status: "enabled" },
      { id: "V", status: "enabled" },
      { id: "B", status: "enabled" },
      { id: "N", status: "enabled" },
      { id: "M", status: "enabled" },
      { id: ",", status: "enabled" },
      { id: ".", status: "enabled" },
      { id: "/", status: "enabled" },
      { id: "shift", status: "enabled", "class": "shift"}
    ],
    5: [
      { "id": "ctrl", "status": "enabled" },
      { "id": "fn", "status": "enabled" },
      { "id": "win", "status": "enabled" },
      { "id": "alt", "status": "enabled", "class": "alt" },
      { "id": "space", "status": "enabled", "class": "spacebar" },
      { "id": "alt", "status": "enabled", "class": "alt" },
      { "id": "win", "status": "enabled" },
      { "id": "fn", "status": "enabled" },
      { "id": "ctrl", "status": "enabled" }
    ]
  };

  var keyboardContainer = document.getElementById("keyboard");

  for (var row in keyboardMeta) {
    var htmlString = "<div class=\"keyboard-row\">";
    for (var keycap in keyboardMeta[row]) {
      htmlString +=
        "<div id=\"" +
        keyboardMeta[row][keycap].id +
        "\" onclick=\"activateButton('" +
        keyboardMeta[row][keycap].id + "', '" +
        soundFxMappings[keyboardMeta[row][keycap].id] +
        "')\" class=\"keycap-shadow\"><div class=\"keycap " +
        ((keyboardMeta[row][keycap]["class"]) ? keyboardMeta[row][keycap]["class"] : "") +
        "\">" +
        keyboardMeta[row][keycap].id +
        "</div></div>";
    }
    htmlString += "</div>";
    keyboardContainer.innerHTML += htmlString;
  }
}
