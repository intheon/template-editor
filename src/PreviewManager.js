var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Class : PreviewManager
// 
// Create and manage preview windows (all with the same src)
//
// Constructor params:
//   previewDataSource: src for the preview iFrames
//   screens: data for the preview screen dimensions, as loaded from the 
//       metadata file
//
// Public interface:
//   createToolbar(container) - initialise the toolbar controls
//   changeMainPreview() - callback for the preview select dropdown
//   updatePreviewForParam(param, newValue) - apply the specified param value
//       change to all previews
//=============================================================================
Yudu.TemplateEditor.PreviewManager = function(templateData, previewDataSource, screens)
{
	var manager = this;
	manager.templateData = templateData;
	var zoomDefaults = new ZoomDefaults(screens);
	var previews = [];
	var currentMainPreviewIndex = 0;

	function initialise()
	{
		createPreviewWindows();
		positionThumbnails();
		createToolbar();
	}

	function createToolbar()
	{
		var frame = $('<div></div>').attr('id', 'ToolbarFrame');
		var dropdown = $('<select></select>')
			.attr('id', 'MainPreviewSelect');

		for (ii = 0; ii < screens.length; ++ii)
		{
			var screen = getScreenByCode(screens[ii]);
			dropdown
				.append($('<option/>')
					.attr('value', ii)
					.html(screen.name))
				.change(function() { manager.changeMainPreview();});
		}
		
		frame.append(dropdown);
		frame.append(makeToolbarButton('ZoomInButton', function()
		{
			zoomDefaults.increaseZoom();
			previews[currentMainPreviewIndex].resizeAsMain();
			updateZoomButtons();
		}));
		frame.append(makeToolbarButton('ZoomOutButton', function()
		{
			zoomDefaults.reduceZoom();
			previews[currentMainPreviewIndex].resizeAsMain();
			updateZoomButtons();
		}));
		
		frame.append(makeToolbarButton('ToggleThumbnailsButton', function() { $('.miniPreviewDiv').toggle(); }));
		frame.append($('<input/>')
			.attr('type', 'button')
			.attr('value', '  Save and download  ')
			.click(function () { Yudu.TemplateEditor.DownloadManager.createAndDownloadZip(manager.templateData) }));
		$('body').append(frame);
	};
	
	function makeToolbarButton(id, callback)
	{
		return $('<input/>')
			.attr('type', 'button')
			.attr('class', 'toolbarButton')
			.attr('id', id)
			.click(callback);
	}
	
	function updateZoomButtons()
	{
		if (!zoomDefaults) return;
		
		if (zoomDefaults.mainScalingFactor > zoomDefaults.maxZoom)
		{
			$('#ZoomInButton').attr('disabled', 'true');
		}
		else
		{
			$('#ZoomInButton').removeAttr('disabled');
		}
		
		if (zoomDefaults.mainScalingFactor < zoomDefaults.minZoom)
		{
			$('#ZoomOutButton').attr('disabled', 'true');
		}
		else
		{
			$('#ZoomOutButton').removeAttr('disabled');
		}
	}
	
	function toggleThumbnails()
	{
		$('.miniPreviewDiv').toggle();
	}
	
	function changeMainPreview()
	{
		var dropdown = $('#MainPreviewSelect');
		
		if (!dropdown) return;
		
		var selectedIndex = dropdown.val();
		
		if (selectedIndex == currentMainPreviewIndex)
		{
			return;
		}
		
		previews[currentMainPreviewIndex].resizeAsThumbnail();
		previews[selectedIndex].resizeAsMain();
		currentMainPreviewIndex = selectedIndex;
		positionThumbnails();
	};
	
	function ZoomDefaults(screens)
	{
		var maxPreviewWidth = 0;
		var maxPreviewHeight = 0;
		
		for (index = 0; index < screens.length; ++index)
		{
			var screenCode = screens[index];
			var screenData = getScreenByCode(screenCode);
			maxPreviewWidth = Math.max(maxPreviewWidth, screenData.framewidth);
			maxPreviewHeight = Math.max(maxPreviewHeight, screenData.frameheight);
		}
		
		var availableDisplayWidth = $(document).width() - 360; //Offset of preview window
		var availableDisplayHeight = $(document).height() - 40; //Offset of preview window
		
		var needed = 0;
		var available = 0;
		
		if (availableDisplayWidth / maxPreviewWidth < availableDisplayHeight / maxPreviewHeight)
		{
			needed = maxPreviewWidth;
			available = availableDisplayWidth;
		}
		else
		{
			needed = maxPreviewHeight;
			available = availableDisplayHeight;
		}
		
		var scalingFactor = 1;
		
		while ((scalingFactor * 1.25) * needed < available)
		{
			scalingFactor *= 1.25;
		}
		
		while (scalingFactor * needed > available)
		{
			scalingFactor /= 1.25;
		}

		this.mainScalingFactor = scalingFactor;
		this.thumbnailScalingFactor = 0.25;
		this.maxZoom = scalingFactor * 2;
		this.minZoom = this.thumbnailScalingFactor;
		
		this.increaseZoom = function()
		{
			this.mainScalingFactor *= 1.25;
		};
		
		this.reduceZoom = function()
		{
			this.mainScalingFactor /= 1.25;
		};
	}

	function createPreviewWindows()
	{
		Yudu.TemplateEditor.Debug.write('Creating ' + screens.length + ' preview windows');
		for (ii = 0; ii < screens.length; ++ii)
		{
			var screen = getScreenByCode(screens[ii]);
			var preview = new Yudu.TemplateEditor.Preview(
				'Preview' + ii,
				screen, 
				previewDataSource,
				zoomDefaults);

			if (ii == 0)
			{
				preview.resizeAsMain();
			}
			else
			{
				preview.resizeAsThumbnail();
			}
			
			previews.push(preview);
			$('#PreviewFrame').append(preview.container);
		}
	}
	
	function positionThumbnails()
	{
		var thumbnailOffset = 0;
		
		for (ii = 0; ii < screens.length; ++ii)
		{
			if (ii == currentMainPreviewIndex)
			{
				previews[ii].setPosition({right: '0'});
				continue;
			}
			
			var screen = getScreenByCode(screens[ii]);
			previews[ii].setPosition({right: thumbnailOffset + 'px'});
			thumbnailOffset += (screen.framewidth * zoomDefaults.thumbnailScalingFactor);			
		}
	}
	
	function getScreenByCode(code)
	{
		for (index = 0; index < Yudu.TemplateEditor.Constants.SCREENTYPES.length; ++index)
		{
			if (Yudu.TemplateEditor.Constants.SCREENTYPES[index].code == code)
			{
				return Yudu.TemplateEditor.Constants.SCREENTYPES[index];
			}
		}
		
		Yudu.TemplateEditor.Error.throwFatalError("Template metadata is invalid - '" + code + "' is not a valid code for a screen type");
		return null;
	}

	function updatePreviewForParam(param, newValue)
	{
		var targetClass = '.preview';
	
		if (param.screentypes)
		{
			targetClass = "";
		
			for (screenIndex = 0; screenIndex < param.screentypes.length; ++screenIndex)
			{
				if (screenIndex > 0)
				{
					targetClass += ", ";
				}
			
				targetClass += "." + param.screentypes[screenIndex];
			}
		}
	
		var previewContents = $(targetClass).contents();

		if (param.targets)
		{
			for (targetIndex = 0; targetIndex < param.targets.length; ++targetIndex)
			{
				var target = param.targets[targetIndex];
				if (param.cssProperty)
				{
					// Unpleasant work-around for the fact that setting image data 
					// directly requires 'url()' around it for CSS properties and
					// not for the src attribute.
					if (param.type == 'image')
					{
						newValue = 'url(' + newValue + ')';
					}
			
					previewContents.find(target).css(param.cssProperty, newValue);
				}
				else if (param.attribute)
				{
					previewContents.find(target).attr(param.attribute, newValue);
				}
				else if (param.replaceContent)
				{
					previewContents.find(target).html(newValue);
				}
			}
		}
	
		if (param.callback)
		{
			// Lots of safety checking before triggering the callback, because we're
			// calling a function specified by the template designer with a value 
			// provided by the user.
			//
			// Ensure that the param is one of the approved types (the ones where 
			// the range of input values is decently constrained), and that the
			// callback is alphanumeric, and that the new value contains only 
			// alphanumeric characters plus hash.
			// 
			// None of these errors are expected so handle them as fatal.
			if (param.type != "color" &&
				param.type != "boolean" &&
				param.type != "radio")
			{
				Yudu.TemplateEditor.Error.throwFatalError(
					"Param '" + param.name + "' uses a callback but is of type " + param.type + ", which doesn't support callbacks.");
			}

			// Call the callback method for the param. Check first that it
			// doesn't contain any characters it shouldn't.
			if (!param.callback.match(/^\w+$/))
			{
				Yudu.TemplateEditor.Error.throwFatalError(
					"Template metadata file is invalid - callback property for param '" + param.name + "' must be alphanumberic");
			}
			
			var newValueAsString = newValue.toString();
			
			if (!newValueAsString.match(/^[\w#]+$/))
			{
				Yudu.TemplateEditor.Error.throwFatalError(
					"Value passed to a callback contained an unexpected character. This probably means you've used a radio button param and given one of the radio buttons a value that's not alphanumeric. Param is '" + param.name + "', value was " + newValue);
			}

			// Now execute the callback.
			for (var ii = 0; ii < $(targetClass).length; ++ii)
			{
				var iFrame = $(targetClass).get(ii);
				var innerWindow = iFrame.contentWindow;
				
				if (innerWindow[param.callback])
				{
					innerWindow[param.callback](newValue);
				}
			}
		}
	}
	
	return (
	{
		initialise: initialise,
		createToolbar: createToolbar,
		changeMainPreview: changeMainPreview,
		updatePreviewForParam: updatePreviewForParam
	});
}
