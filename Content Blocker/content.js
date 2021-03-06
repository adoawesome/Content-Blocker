var badsites = [["Site","Score"]];
var triggers = ["Nazi","Hitler","Holocaust"];

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

// Adds all user-added words to list of words

function getCustomWords() {

	chrome.storage.sync.get("data", function(items) {
			if (!chrome.runtime.error) {
				var storedTrigs = items["data"];
				if(storedTrigs !== undefined) {
					for(var i = triggers.length; i < storedTrigs.length; i++) {
						triggers.push(storedTrigs[i]);
					}
				}
		 	}
		});
}

function findtrigs() {

	var found = 0;
	var message = "Warning: this page may contain words such as";
	var elements = document.getElementsByTagName('*');

	for(var i = 0; i < elements.length; i++) {
		var element = elements[i];
		for(var j = 0; j < element.childNodes.length; j++) {
			var node = element.childNodes[j];
			if(node.nodeType === 3) {
				var string = node.nodeValue;
				string = string.toLowerCase();
				for(var k = 0; k < triggers.length; k++) {
					//find trigger word in string
					var index = string.search(triggers[k]);
					if(index !== -1) {
						var end = index + triggers[k].length;//end of trigger word in string
						//if the next thing is a letter, then it is not a trigger word
						// i.e. "Method" will not find a match with "Meth"
						if(string[end] === undefined || !isLetter(string[index + triggers[k].length])) {
							// avoid duplicates
							if(message.search(triggers[k]) === -1) {
								found++;
								message += (" " + triggers[k] + ",");
								triggers.splice(k,1); // Prevent from warning user about same word twice

							}
						}
					}
				}
			}
		}
	}
	if(found > 0) {
		// Remove comma if only one word is found
		if(found === 1) {
			message = message.slice(0, -1);
		}
		badsites.push([window.location.href,found]);
		message += " and other triggering words." + "with " + found + " Instances on this site " + window.location.href + badsites;
		alert(message);
		arrayToCSV(badsites)	
	}
}

// This waits for any changes in the html such as scrolling on 
// Facebook which loads more content and finds any trigger words
// that have not been mentioned yet, if any
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
    findtrigs();
});

observer.observe(document, {
  attributes: true,
  subtree: true,
});

// Load all trigger warnings into dropdown
window.onload = function () {
	getCustomWords();
    var select = document.getElementById("dropdown");
    for(var i = triggers.length - 1; i > 0; i--) {
        var option = document.createElement('option');
        option.text = option.value = triggers[i];
        select.add(option, 0);
    }
    document.getElementById("dropdown").value = "";
};

function arrayToCSV (twoDiArray) {
    //  Modified from: http://stackoverflow.com/questions/17836273/
    //  export-javascript-data-to-csv-file-without-server-interaction
    var csvRows = [];
    for (var i = 0; i < twoDiArray.length; ++i) {
        for (var j = 0; j < twoDiArray[i].length; ++j) {
            twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';  // Handle elements that contain commas
        }
        csvRows.push(twoDiArray[i].join(','));
    }

    var csvString = csvRows.join('\r\n');
    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' + csvString;
    a.target      = '_blank';
    a.download    = 'myFile.csv';

    document.body.appendChild(a);
    a.click();
    // Optional: Remove <a> from <body> after done
}
document.addEventListener('DOMContentLoaded', function() {
	findtrigs();
	function addWord() {
	    var newWord = document.getElementById("myText").value;
	    // Remove any non-letter character and lower case new Word
	    newWord = newWord.replace(/[^a-zA-Z-]/g, '').toLowerCase();
	    if(triggers.indexOf(newWord) === -1 && newWord !== "") {
	    	triggers.push(newWord);
	    	// Add word to sync storage for later use
	    	chrome.storage.sync.set({ "data" : triggers }, function() {
	    		findtrigs(); // see if it occurs on that page
	    		if (chrome.runtime.error) {
	      			console.log("Runtime error.");
	    		}
  			});
	    }
	    document.getElementById("myText").value = " "; // clear dropdown
  		getCustomWords();
	}
	document.getElementById('add-Word').onclick = addWord;
});