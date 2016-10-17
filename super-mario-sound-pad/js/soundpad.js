(function() {
  var pathTemplate = "../assets/sound-fx/smb_%s.wav";
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

  for (var key in soundFxMappings) {
    var id = soundFxMappings[key];
    createjs.Sound.registerSound(pathTemplate.replace("%s", id), id, 1, "", {interrupt: createjs.Sound.INTERRUPT_ANY});
  }

  document.onkeypress = function(event) {
    if (event.constructor.name.localeCompare("KeyboardEvent") === 0) {
      var char = event.key;

      if (!char) return;

      playSound(soundFxMappings[char.toUpperCase()]);
    }
  };
})();

function playSound(soundID) {
  createjs.Sound.play(soundID);
}
