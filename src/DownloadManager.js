var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : DownloadManager
// 
// createAndDownloadZip(templateData) - creates a zip of the modified template 
//     and opens a save file dialog for it.
//=============================================================================
(function (DownloadManager, undefined)
{
	//=============================================================================
	// Turn the updated template into a zip of assets for the user to download.
	//=============================================================================
	DownloadManager.createAndDownloadZip = function(templateData)
	{
		Yudu.TemplateEditor.ProgressIndicator.show('Generating zip file...');
		var zip = new JSZip();
		var processedImages = new Array();
	
		//=========================================================================
		// Add the data file for the config values
		//=========================================================================
		zip.file(templateData.configFilePath, makeConfigJs(templateData));

		//=========================================================================
		// Save any uploaded images
		//=========================================================================
		for (index = 0; index < templateData.params.length; ++index)
		{
			var param = templateData.params[index];
		
			if (param.type == 'image')
			{
				var selector = getSelector(param.name);
			
				if (selector.val() && selector.val() != "")
				{
					Yudu.TemplateEditor.ProgressIndicator.update("Adding file '" + param.value + "'");
					zip.file(param.value, convertBase64ImageToArray(selector.val()), {binary: true});
					processedImages.push(param.value);
				}
			}
		}
	
		var completedFiles = 0;
		var files = templateData.files;

		var countOfSuccess = 0;
		var countOfComplete = 0;

		for (var ii = 0; ii < files.length; ++ii)
		{
			var filepath = files[ii];
		
			//=====================================================================
			// Don't bother with any images for which the user has uploaded 
			// replacements, or with the config file
			//=====================================================================
			if ($.inArray(filepath, processedImages) >= 0 || filepath == templateData.configFilePath)
			{
				++countOfSuccess;
				++countOfComplete;
				continue;
			}
		
			Yudu.TemplateEditor.ProgressIndicator.update("Adding file '" + files[ii] + "'");
			var retriever = new fileRetriever(templateData.baseLocation, filepath);
			retriever.onLoad = function(e)
			{
				this.addToZip(zip);
				++countOfSuccess;
			}
			retriever.onComplete = function(e)
			{
				if (++countOfComplete == files.length)
				{
					if (countOfSuccess != countOfComplete)
					{
						Yudu.TemplateEditor.Error.throwNonFatalError(
							"Failed to create zip file. Expected to add " + countOfComplete + ", but only added " + countOfSuccess);
						return;
					}
				
					saveAs(zip.generate({type: 'blob'}), 'template.zip');
				}
			}
			retriever.get();
		}
		Yudu.TemplateEditor.ProgressIndicator.close();
	}

	function convertBase64ImageToArray(imageData)
	{
		var truncatedImageData = imageData.replace(/[^,]+,/, "");
		var raw = window.atob(truncatedImageData);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));

		for (i = 0; i < rawLength; i++)
		{
			array[i] = raw.charCodeAt(i);
		}
	
		return array;
	}

	function getSelector(name)
	{
		return $('#' + name);
	}

	// Yes, this should be JSON. But retrieving a JSON file from the local disk can
	// run into cross-scripting restrictions, whereas a JS include file is safe.
	function makeConfigJs(templateData)
	{
		var ret = "";
		var params = [];
	
		for (ii = 0; ii < templateData.params.length; ++ii)
		{
			var param = templateData.params[ii];
			var selector = getSelector(param.name);

			if (param.type == 'image') continue;
		
			var value = (selector ? selector.val() : param.value);
		
			if (param.type == 'richText')
			{
				value = CKEDITOR.instances[param.name].getData();
			}
		
			ret += param.name + "=" + JSON.stringify(value) + ";";
		}
	
		return ret;
	}

	function fileRetriever(baseLocation, filepath)
	{
		this.baseLocation = baseLocation;
		this.filepath = filepath;
		this.complete = false;
		this.onLoad = null;
		this.onComplete = null;
		this.data = null;

		this.get = function()
		{
			var xhr = new XMLHttpRequest();
			xhr.parent = this;
			xhr.addEventListener('load', function(e)
			{
				this.parent.data = xhr.response;
				if (this.parent.onLoad) this.parent.onLoad(e);
			});
			xhr.addEventListener('loadend', function(e)
			{
				this.parent.complete = true;
				if (this.parent.onComplete) this.parent.onComplete(e);
			});
			xhr.open('GET', baseLocation + '/' + filepath, true);
			xhr.responseType = 'arraybuffer';
			xhr.send();
		};
	
		this.addToZip = function(zip)
		{
			zip.file(this.filepath, this.data, {binary: true});
		}
	}
}(Yudu.TemplateEditor.DownloadManager = Yudu.TemplateEditor.DownloadManager || {}));
