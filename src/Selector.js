var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Class : Selector
// 
// Wrapper for the HTML control(s) for one of the template params
//
// Constructor params:
//   baseLocation: template data base location (only relevant for image type
//       selectors)
//   param: param data object as loaded from the template metadata
//   changeHandler: function to call when the selector value changes
//
// Public interface:
//   createControl(parentDiv): instantiate the selector in the specified div
//   param: param for which the selector was built
//   control: inner HTML control which contains the selector value (which may or
//       may not be the same as the control that's visible to the user)
//=============================================================================
Yudu.TemplateEditor.Selector = function(baseLocation, param, changeHandler)
{
	var selector = this;
	var control = null;
	var revertHandler = null;
	var rootElement = null;
	
	var valueChanged = function(newValue)
	{
		// Force comparison as a string here, otherwise the Boolean case
		// doesn't work (since param.value is a string, but newValue is 
		// a Boolean, and false != "false").
		if ((newValue + "") == param.value)
		{
			rootElement.find('.undoButton').hide();
		}
		else
		{
			rootElement.find('.undoButton').show();
		}
		
		changeHandler(param, newValue);
	};
	
	var createControl = function (parentDiv)
	{
		buildHtmlForControl(parentDiv);
	};
	
	function buildHtmlForControl(parentDiv)
	{
		var controlDiv;
		var undoButton = $('<img src="UndoIcon.png" class="undoButton"/>')
			.click(revert);
		
		if (param.type == 'richText')
		{
			var label = $('<span class="selectorLabelFullWidth"></span>')
				.append(param.label)
				.append(undoButton);
			var selectorDiv = $('<div class="selector"></div>')
				.append(label)
				.append('<br/>');
			controlDiv = $('<span class="selectorControlFullWidth"></span>');
		}
		else
		{
			var selectorDiv = $('<div class="selector"></div>')
				.append($('<span class="selectorLabel"></span>')
				.append(param.label));
			controlDiv = $('<span class="selectorControl"></span>')
				.append(undoButton);
		}

		selectorDiv.append(controlDiv);
		parentDiv.append(selectorDiv);
		rootElement = selectorDiv;
		buildSelectorControl(controlDiv);
	}
	
	function buildSelectorControl(parentDiv)
	{
		switch (param.type)
		{
			case 'color':
				buildColorPicker(parentDiv);
				break;
			case 'image':
				buildImagePicker(parentDiv);
				break;
			case 'text':
				buildTextInput(parentDiv);
				break;
			case 'richText':
				buildRichTextInput(parentDiv);
				break;
			case 'boolean':
				buildBooleanInput(parentDiv);
				break;
			case 'radio':
				buildRadioInput(parentDiv);
				break;
			default:
				Yudu.TemplateEditor.Error.throwFatalError(
				'Unknown param type in the template file! Param name was ' + param.name + ', param type was ' + param.type);
				return;
		}
		
		selector.control.data({param: param});
	}
	
	// parentDiv must be instantiated on the page, or the Spectrum library 
	// defaults the control to be display:none!
	function buildColorPicker(parentDiv)
	{
		selector.control = $('<input type="text"/>').attr('id', param.name);
		parentDiv.append(selector.control);
		selector.control.spectrum(
		{
			color: "#ff00", 
			showAlpha: true, 
			showInput: true, 
			preferredFormat: "none",
			showPalette: true, 
			palette: [['black', 'white']],
			change: function(color)
			{
				selector.control.val(color.toRgbString());
				valueChanged(color);
			}
		});
		selector.control.spectrum('set', param.value);
		// Also set the value on the underlying input field, so that we don't need to
		// special-case it when retriving the values set.
		selector.control.val(param.value);
		selector.revertHandler = function()
		{
			selector.control.spectrum('set', param.value);
		};
	}
	
	function buildImagePicker(parentDiv)
	{
		selector.control = $('<input type="text" style="display: none"/>').attr('id', param.name);
		var thumbnail = $('<div/>')
			.attr('class', 'imageThumbnail');
		var target = $('<div id="DropTarget" class="dropTarget">Drag image here to upload</div>');
		var label = $('<div/>')
			.attr('class', 'imageLabel')
			.html(param.value);
		thumbnail.css('background-image', 'url(' + getImageDefaultValue() + ')');
		thumbnail.append(label);
		parentDiv.append(selector.control);
		parentDiv.append(thumbnail);
		parentDiv.append(target);
		
		Yudu.TemplateEditor.DropTarget.bind(target.get(0), function(file, imageData)
		{
			selector.control.val(imageData);
			setImageThumbnail(imageData, "Uploaded: " + file.name);
			valueChanged(imageData);
		});

		selector.revertHandler = function()
		{
			selector.control.val(param.value);
			setImageThumbnail(getImageDefaultValue(), param.value);
		};
	}
	
	function setImageThumbnail(image, fileLabel)
	{
		rootElement.find('.imageThumbnail')
			.css('background-image', 'url(' + image + ')');
		rootElement.find('.imageLabel').html(fileLabel);
	}
	
	function getImageDefaultValue()
	{
		return baseLocation + '/' + param.value;
	}

	function buildTextInput(parentDiv)
	{
		selector.control = $('<input type="text"/>')
			.attr('id', param.name)
			.attr('class', 'textInput')
			.val(param.value);
		parentDiv.append(selector.control);
		selector.control.keyup(function()
		{
			valueChanged(selector.control.val());
		});
	}
	
	// As with the color picker, parentDiv must be instantiated on the page, 
	// or the CKEDITOR library dies horribly.
	function buildRichTextInput(parentDiv)
	{
		selector.control = $('<textarea></textarea>')
			.attr('id', param.name)
			.val(param.value);
		parentDiv.append(selector.control);
		CKEDITOR.replace(param.name);
		CKEDITOR.instances[param.name].on('change', function()
		{
			if (selector.isMidChange) return;
			
			var value = CKEDITOR.instances[param.name].getData();
			selector.control.val(value);
			valueChanged(value);	
		});
		
		selector.revertHandler = function()
		{
			selector.isMidChange = true;
			CKEDITOR.instances[param.name].setData(
				param.value,
				function() { selector.isMidChange = false; });
		}
	}
	
	function buildBooleanInput(parentDiv)
	{
		selector.control = $('<input type="checkbox"/>')
			.attr('id', param.name)
			.attr('class', 'textInput')
			.val(param.value);
			
		if (param.value == "true")
		{
			selector.control.prop('checked', true);
		}
		else
		{
			selector.control.prop('checked', false);
		}
		
		parentDiv.append(selector.control);
		selector.control.change(function()
		{
			valueChanged(selector.control.prop('checked').toString());
		});
		
		selector.revertHandler = function()
		{
			if (param.value == "true")
			{
				selector.control.prop('checked', true);
			}
			else
			{
				selector.control.prop('checked', false);
			}
		}
	}
	
	function buildRadioInput(parentDiv)
	{
		if (!param.options) Yudu.TemplateEditor.Error.throwFatalError(
			'Param ' + param.name + ' is type radio but has no options data');

		selector.control = $('<input type="text" style="display: none"/>').attr('id', param.name);
		parentDiv.append(selector.control);

		for (index = 0; index < param.options.length; ++index)
		{
			var option = param.options[index];
			
			if (!option.hasOwnProperty('label') || !option.hasOwnProperty('value'))
			{
				Yudu.TemplateEditor.Error.throwFatalError('Option #' + index + ' on param ' + param.name + ' is missing data - each option must have a label and a value.');
			}
			
			var radioButton = $('<input></input>')
				.attr('type', 'radio')
				.attr('name', param.name)
				.attr('value', option.value)
				.change(makeRadioChangeHandler(option.value));
				
			if (option.value == param.value)
			{
				radioButton.prop('checked', true);
			}
			
			parentDiv.append(radioButton);
			parentDiv.append(option.label);
			parentDiv.append($('<br/>'));
		}
		
		selector.revertHandler = function()
		{
			// Set the radio button with the default value to be selected.
			$('[name=' + param.name + '][value=' + param.value + ']').prop('checked', true);
		}
	}
	
	function makeRadioChangeHandler(newValue)
	{
		return function()
		{
			selector.control.val(newValue);
			valueChanged(newValue);
		}
	}
	
	function revert()
	{
		if (!selector.control) return;
		
		changeHandler(param, param.value);
		selector.control.val(param.value);
		
		if (selector.revertHandler) selector.revertHandler();
		
		valueChanged(param.value);
		
	}
	
	return (
	{
		param: param,
		control: control,
		createControl: createControl
	});

}
