// Modal Invoke Functuon
(function() {

  // constructor 
  this.Modal = function() {

    // Create global element references
    this.closeButton = null;
    this.modal = null;
    this.overlay = null;

    // Determine proper prefix
    this.transitionEnd = transitionSelect();

    // Define option defaults 
    var defaults = {
      autoOpen: false,
      className: 'fade-and-drop',
      closeButton: true,
      content: "",
      maxWidth: 600,
      minWidth: 280,
      overlay: true
    }

    // Create options by extending defaults with the passed in arugments
    if (arguments[0] && typeof arguments[0] === "object") {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    if(this.options.autoOpen === true) this.open();

  }

  // Public Methods

  Modal.prototype.close = function() {
    var _ = this;
    this.modal.className = this.modal.className.replace(" scotch-open", "");
    this.overlay.className = this.overlay.className.replace(" scotch-open",
      "");
    this.modal.addEventListener(this.transitionEnd, function() {
      _.modal.parentNode.removeChild(_.modal);
    });
    this.overlay.addEventListener(this.transitionEnd, function() {
      if(_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
    });
  }

  Modal.prototype.open = function() {
    buildOut.call(this);
    initializeEvents.call(this);
    window.getComputedStyle(this.modal).height;
    this.modal.className = this.modal.className +
      (this.modal.offsetHeight > window.innerHeight ?
        " scotch-open scotch-anchored" : " scotch-open");
    this.overlay.className = this.overlay.className + " scotch-open";
  }

  // Private Methods

  function buildOut() {

    var content, contentHolder, docFrag;

    /*
     * If content is an HTML string, append the HTML string.
     * If content is a domNode, append its content.
     */

    if (typeof this.options.content === "string") {
      content = this.options.content;
    } else {
      content = this.options.content.innerHTML;
    }

    // Create a DocumentFragment to build with
    docFrag = document.createDocumentFragment();

    // Create modal element
    this.modal = document.createElement("div");
    this.modal.className = "scotch-modal " + this.options.className;
    this.modal.style.minWidth = this.options.minWidth + "px";
    this.modal.style.maxWidth = this.options.maxWidth + "px";

    // If closeButton option is true, add a close button
    if (this.options.closeButton === true) {
      this.closeButton = document.createElement("button");
      this.closeButton.className = "scotch-close close-button";
      this.closeButton.innerHTML = "&times;";
      this.modal.appendChild(this.closeButton);
    }

    // If overlay is true, add one
    if (this.options.overlay === true) {
      this.overlay = document.createElement("div");
      this.overlay.className = "scotch-overlay " + this.options.className;
      docFrag.appendChild(this.overlay);
    }

    // Create content area and append to modal
    contentHolder = document.createElement("div");
    contentHolder.className = "scotch-content";
    contentHolder.innerHTML = content;
    this.modal.appendChild(contentHolder);

    // Append modal to DocumentFragment
    docFrag.appendChild(this.modal);

    // Append DocumentFragment to body
    document.body.appendChild(docFrag);

  }

  function extendDefaults(source, properties) {
    var property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  function initializeEvents() {

    if (this.closeButton) {
      this.closeButton.addEventListener('click', this.close.bind(this));
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', this.close.bind(this));
    }

  }

  function transitionSelect() {
    var el = document.createElement("div");
    if (el.style.WebkitTransition) return "webkitTransitionEnd";
    if (el.style.OTransition) return "oTransitionEnd";
    return 'transitionend';
  }

}());


//
var myModal = new Modal({ content: '<div id="FileUplodDiv" class="jFiler-input-dragDrop" onclick="document.getElementById(\'inputFileToLoad\').click();"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="entypo-upload-cloud"></i></div><div class="jFiler-input-text"><h3>Drag&amp;Drop files here</h3> <span style="display:inline-block; margin: 15px 0">or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div><div id="ErrMsg"></div></div><div id="imageID"></div>' });

var triggerButton = document.getElementById('trigger');

triggerButton.addEventListener('click', function() {
	myModal.open();
	var ErrMsg = document.getElementById('ErrMsg');
	var holder = document.getElementById('FileUplodDiv'),
	tests = {
		filereader: typeof FileReader != 'undefined',
		dnd: 'draggable' in document.createElement('span'),
		formdata: !! window.FormData,
		//progress: "upload" in new XMLHttpRequest
	},
	support = {
		filereader: document.getElementById('filereader'),
		formdata: document.getElementById('formdata'),
		//progress: document.getElementById('progress')
	},
	acceptedTypes = {
		'image/png': true,
		'image/jpeg': true,
		'image/gif': true
	},
	//progress = document.getElementById('uploadprogress'),
	fileupload = document.getElementById('inputFileToLoad');
	// Function to preview image if its valid
	function previewfile(file) {
		if (tests.filereader === true && acceptedTypes[file.type] === true) {
			//var myContent = document.getElementById('content');
			var Imagecontent = document.getElementById('imageID');
			
			var reader = new FileReader();
			reader.onload = function (event) {
				var image = new Image();
				image.src = event.target.result;
				image.width = 250; // a fake resize
				image.style.padding = "10px";
				//holder.appendChild(image);
				Imagecontent.appendChild(image);
			};
			reader.readAsDataURL(file);
			ErrMsg.innerHTML = '';
		} else {
			ErrMsg.innerHTML = '<p>Please upload Image File Formate i.e. jpeg, png.</p>';
			console.log(file);
		}
	}

	function readfiles(files) {
		//debugger;
		var formData = tests.formdata ? new FormData() : null;
		
		for (var i = 0; i < files.length; i++) {
			if (tests.formdata) formData.append('file', files[i]);
			//console.log(i);
			previewfile(files[i]);
		}
		/*if (tests.formdata) {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/devnull.php');
			xhr.onload = function () {
				progress.value = progress.innerHTML = 100;
			};
			if (tests.progress) {
				xhr.upload.onprogress = function (event) {
					if (event.lengthComputable) {
						var complete = (event.loaded / event.total * 100 | 0);
						progress.value = progress.innerHTML = complete;
					}
				}
			}
			xhr.send(formData);
		}*/
	}
	// Bind Drag Over Function
	holder.ondragover = function () {
		//this.className = 'hover';
		this.classList.remove("dragged");
		this.className = this.className + " dragged";
		//console.log(this.className);
		return false;
	};
	// Bind Drag Leave Function
	holder.ondragleave = function () {
		//this.className = '';
		this.classList.remove("dragged");
		//console.log(this.classList);
		return false;
	};
	// Bind Drag Drop Function
	holder.ondrop = function (e) {
		/*this.className = '';
		var d = document.getElementById("FileUplodDiv");
		this.className = this.className + " otherclass";*/
		this.classList.remove("dragged");
		//console.log(this.classList);
		e.preventDefault();
		readfiles(e.dataTransfer.files);
	}

	function simulateDrop() {
		var fileInput = document.getElementById('fileInput'),
			file = fileInput.files[0];
		holder.ondrop({ 
			dataTransfer: { files: [ file ] }, 
			preventDefault: function () {} 
		});
	}
	function handleFileSelect(evt) {

		var files = evt.target.files; // FileList object

		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {

		  // Only process image files.
		  if (!f.type.match('image.*')) {
			ErrMsg.innerHTML = '<p>Please upload Image File Formate i.e. jpeg, png.</p>';
			return false;
		  }
			else
			{
				ErrMsg.innerHTML = '';
			}
		  var reader = new FileReader();

		  // Closure to capture the file information.
		  reader.onload = (function(theFile) {
			return function(e) {
			  // Render thumbnail.
			  var span = document.createElement('span');
			  span.innerHTML = ['<img style="padding:10px;width:250px;" class="thumb" src="', e.target.result,
								'" title="', escape(theFile.name), '"/>'].join('');
			  document.getElementById('imageID').insertBefore(span, null);
			};
		  })(f);

		  // Read in the image file as a data URL.
		  reader.readAsDataURL(f);
		}
	}
	document.getElementById('inputFileToLoad').addEventListener('change', handleFileSelect, false);
});
// To create type file dynamicaly
function main()
{
	var inputFileToLoad = document.createElement("input");
	inputFileToLoad.type = "file";
	inputFileToLoad.id = "inputFileToLoad";
	inputFileToLoad.multiple = "multiple";
	inputFileToLoad.name = "arr[]";
	document.body.appendChild(inputFileToLoad);

	var buttonLoadFile = document.createElement("button");
	buttonLoadFile.onclick = loadImageFileAsURL;
	buttonLoadFile.textContent = "Load Selected File";
	//document.body.appendChild(buttonLoadFile);
}
function loadImageFileAsURL()
{
	var filesSelected = document.getElementById("inputFileToLoad").files;
	if (filesSelected.length > 0)
	{
		var fileToLoad = filesSelected[0];

		if (fileToLoad.type.match("image.*"))
		{
			var fileReader = new FileReader();
			fileReader.onload = function(fileLoadedEvent) 
			{
				var imageLoaded = document.createElement("img");
				imageLoaded.src = fileLoadedEvent.target.result;
				document.body.appendChild(imageLoaded);
			};
			fileReader.readAsDataURL(fileToLoad);
		}
	}
}
main();
