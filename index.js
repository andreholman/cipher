function csprng() {
  // A cryptographically-strong version
  var array = new Int8Array(1);
  window.crypto.getRandomValues(array); // This will replace the array
  var value = parseInt(array.join(""));
  value = (value + 128) / 255;
  return value;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(csprng() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
}

function getIndex(num, total) {
  if (num < total) {
    return num;
  } else {
    return num % total;
  }
}

function generateKey(length) {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var output = [];
  var i;
  for (i = 1; i < length + 1; i++) {
    if (getRandomInt(1, 6) == 5) {
      // Numbers generated 1 in 6 chance
      output.push(parseInt(getRandomInt(0, 9)));
    } else {
      output.push(alphabet[getRandomInt(0, 25)]);
    }
  }
  key = output.join("");
  return key;
}

function caesarShift(str, amount) {
  // Wrap the amount
  if (amount < 0) {
    return caesarShift(str, amount + 26);
  }

  var output = "";

  // Go through each character
  for (var i = 0; i < str.length; i++) {
    // Get the character to append
    var c = str[i];

    // If it's a letter...
    if (c.match(/[a-z]/i)) {
      // Get its code
      var code = str.charCodeAt(i);

      // Uppercase letters
      if (code >= 65 && code <= 90) {
        c = String.fromCharCode((code - 65 + amount) % 26 + 65);
      } else if (code >= 97 && code <= 122) {
        // Lowercase letters
        c = String.fromCharCode((code - 97 + amount) % 26 + 97);
      }
    }
    // Append
    output += c;
  }
  return output;
}

function calculatePositions(text) {
  console.log("Calculate positions - input: " + text)
  text.split(" ").join("");
  var chari = "";
  var arr = [];
  var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  var numbers = "1234567890".split("");
  for (var i = 0; i < text.length; i++) {
    chari = text.charAt(i).toLowerCase();
    if (alphabet.indexOf(chari) > -1) {
      arr.push(alphabet.indexOf(chari) + 1);
    } else if (numbers.includes(chari)) {
      arr.push(parseInt(chari));
    } else {
      arr.push(0); // Invalid character
    }
  }
  return arr;
}

window.onload = function() {
  var comfyText = (function() {
    var tag = document.querySelectorAll("textarea");
    for (var i = 0; i < tag.length; i++) {
      tag[i].addEventListener("paste", autoExpand);
      tag[i].addEventListener("input", autoExpand);
    }
    function autoExpand(e, element) {
      var el = el || e.target;
      el.style.height = "inherit";
      el.style.height = el.scrollHeight + "px";
    }
    window.addEventListener("load", expandAll);
    window.addEventListener("resize", expandAll);
    function expandAll() {
      var tag = document.querySelectorAll("textarea");
      for (var i = 0; i < tag.length; i++) {
        autoExpand(e, tag[i]);
      }
    }
  })();

  var action = (function() {
    var inputBox = document.querySelectorAll("textarea")[0];
    inputBox.addEventListener("paste", process);
    inputBox.addEventListener("input", process);

    var checkboxes = document.querySelectorAll("input");

    var switchButton = $(".switch");
    switchButton.addEventListener("click", process);

    function process() {
      var key = $("#key").val();
      if (checkboxes[0].checked) {
        console.log("cipher with key: " + key);
        cipher(key);
      } else if (checkboxes[1].checked) {
        console.log("decode");
        decode(key);
      }
    }
  })();

  function separate(str) {
    var o = str;

    o = o.split("");
    return o;
  }

  function cipher(key) {
    console.log("key input: " + key)
    var input = $("#input").val();
    var chars = separate(input);
    var i = 0;
    console.log("key positions: " + calculatePositions(key))
    for (i in chars) {
      chars[i] = caesarShift(chars[i], calculatePositions(key)[getIndex(i, 32)]);
      i++;
    }

    $("#output").val(chars.join(""));
  }

  function decode(key) {
    console.log("key input: " + key)
    var input = $("#input").val();
    var chars = separate(input);
    var i = 0;

    for (i in chars) {
      chars[i] = caesarShift(chars[i], 0 - calculatePositions(key)[getIndex(i, 32)]);
      i++;
    }

    $("#output").val(chars.join(""));
  }
};

$("i#copybutton").click(function() {
  console.log("copy");
  $("#output").select(); // Select
  document.execCommand("copy"); // Copy

  $("#result").css("opacity", "1"); // Show the result
  setTimeout(function() {
    $("#result").css("opacity", "0"); // Hide the result
  }, 1200); // After a bit
});

$("i#generatebutton").click(function() {
  console.log("generate: " + generateKey(32));
  $("#key").val(generateKey(32));
});