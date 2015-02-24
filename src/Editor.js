var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Class : Editor
// 
// Main class for the Editor widget.
// Code and styles both assume that the editor should display in the full page.
//
// Due to security restrictions, the editor can't retrieve the proper JSON data
// for the templates when running locally. It uses hard-coded data from 
// LocalTestData.js instead to allow it to run for dev purposes.
//
// Optional params:
//   useTemplateSelectScreenWhenLocal: set to true to make the selection screen
//   appear when running the editor locally.
//
// Public interface:
//   initialise(): create an instance of the Editor.
//=============================================================================
Yudu.TemplateEditor.Editor = function(params)
{
	var editor = this;
	var templateListLocation = "TemplateList.json";
	var useTemplateSelectScreenWhenLocal = false;
	
	if (params)
	{
		useTemplateSelectScreenWhenLocal = params.useTemplateSelectScreenWhenLocal;
	}

	function initialise()
	{
		var successCallback = function(data)
		{
			new TemplateSelectionScreen(retrieveTemplateData)
				.promptForTemplate(data);
		};
		var failureCallback = function()
		{
			if (useTemplateSelectScreenWhenLocal)
			{
				new TemplateSelectionScreen(retrieveTemplateDataSimulated)
					.promptForTemplate(Yudu.TemplateEditor.LocalTestData.templateList);
			}
			else
			{
				editor.dataSource = Yudu.TemplateEditor.LocalTestData.templateList[0];
				initialiseEditorUi(Yudu.TemplateEditor.LocalTestData.templateData);
			}
		};
		
		getTemplateList(
			templateListLocation,
			successCallback,
			failureCallback);
	}

	function getTemplateList(templateListLocation, successCallback, failureCallback)
	{
		$.getJSON(templateListLocation, successCallback)
			.fail(function(jqxhr, textStatus, error)
			{
				if (textStatus == 'error' && error == '')
				{
					failureCallback();
				}
			});
	}

	function TemplateSelectionScreen(selectCallback)
	{
		this.promptForTemplate = function(data)
		{
			var frame = addDivAtTopLevel('TemplateList');
			frame.append($('<h1>Select template to use:</h1>'));
	
			for (index = 0; index < data.length; ++index)
			{
				var container = $('<div></div>')
					.attr('class', 'templateThumbnailContainer');
				var iframe = $('<iframe></iframe>')
					.attr('class', 'templateThumbnail')
					.attr('src', data[index].entry);
				var glassCover = $('<div></div>')
					.attr('class', 'glassCover')
					.click(makeTemplateSelectHandler(data[index]));
				container.append(iframe);
				container.append(glassCover);
				frame.append(container);
			}
		
			$('body').append(frame);
		}
		
		function makeTemplateSelectHandler(dataSource)
		{
			return function()
			{
				$('#TemplateList').remove();
				selectCallback(dataSource);
			}
		}
	}

	function retrieveTemplateData(dataSource)
	{
		editor.dataSource = dataSource;
		$.getJSON(dataSource.metadata, initialiseEditorUi)
			.fail(jsonLoadError);
	}

	function retrieveTemplateDataSimulated(dataSource)
	{
		editor.dataSource = Yudu.TemplateEditor.LocalTestData.templateList[0];
		initialiseEditorUi(Yudu.TemplateEditor.LocalTestData.templateData);
	}

	function jsonLoadError(jqxhr, textStatus, error)
	{
		alert('fail: ' + textStatus + ', ' + error);
	}

	function initialiseEditorUi(data)
	{
		var selectorFrame = addDivAtTopLevel('SelectorFrame');
		var previewFrame = addDivAtTopLevel('PreviewFrame');

		var previewManager = new Yudu.TemplateEditor.PreviewManager(
			data,
			editor.dataSource.entry, 
			data.screens);
		previewManager.initialise();
	
		for (ii = 0; ii < data.params.length; ++ii)
		{
			var param = data.params[ii];
			var selector = new Yudu.TemplateEditor.Selector(
				data.baseLocation, 
				param, 
				previewManager.updatePreviewForParam);
			selector.createControl(selectorFrame);
		}
	}

	function addDivAtTopLevel(id)
	{
		var ret = $('<div></div>').attr('id', id);
		$('body').append(ret);
		return ret;
	}
	
	return (
	{
		editor: editor,
	//	dataSource: dataSource,
		initialise: initialise
	});
}
