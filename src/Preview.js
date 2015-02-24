var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Class : Preview
// 
// Manage a single instance of a preview window
//
// Constructor params:
//   id: ID value to use for the HTML iFrame
//   screenData: info about screen dimensions
//   dataSourceUrl: src for the iFrame
//   zoomDefaults: environmental parameters for use when resizing the preview
//
// Public interface:
//   setPosition(params): use the params data to set the preview position
//   resizeAsMain(): change the preview size to make it the main preview
//   resizeAsThumbnail(): change the preview size to make it a thumbnail
//
//   control: DOM element for the preview (the iFrame)
//   container: DOM element containing the preview (the div)
//=============================================================================
Yudu.TemplateEditor.Preview = function(id, screenData, dataSourceUrl, zoomDefaults)
{
	var preview = this;
	createPreview();

	function setPosition(params)
	{
		if (params.top) preview.container.css('top', params.top);
		if (params.right) preview.container.css('right', params.right);
		if (params.bottom) preview.container.css('bottom', params.bottom);
		if (params.left) preview.container.css('left', params.left);
	}

	function resizeAsMain()
	{
		resize('previewDiv', zoomDefaults.mainScalingFactor);
	}

	function resizeAsThumbnail()
	{
		resize('miniPreviewDiv', zoomDefaults.thumbnailScalingFactor);
	}

	function createPreview()
	{
		preview.control = $('<iframe></iframe>')
			.attr('id', id)
			.attr('class', 'preview')
			.attr('src', dataSourceUrl)
			.addClass(screenData.code);
		preview.container = $('<div></div>').append(preview.control);
	}
	
	function resize(containerClass, scalingFactor)
	{
		preview.container
			.attr('class', containerClass)
			.css('width', screenData.framewidth * scalingFactor)
			.css('height', screenData.frameheight * scalingFactor)
			.css('background-image', 'url(' + screenData.frameimage + ')')
			.css('background-size', (screenData.framewidth * scalingFactor) + "px " + screenData.frameheight * scalingFactor + "px");
		preview.control
			.css('width', screenData.screenwidth)
			.css('height', screenData.screenheight)
			.css('left', (screenData.offset.x * scalingFactor) + "px")
			.css('top', (screenData.offset.y * scalingFactor) + "px")
			.css('transform-origin', '0 0')
			.css('transform', 'scale(' + scalingFactor + ', ' + scalingFactor + ')');
	}
	
	return (
	{
		control: preview.control,
		container: preview.container,
		setPosition: setPosition,
		resizeAsMain: resizeAsMain,
		resizeAsThumbnail: resizeAsThumbnail
	});
}
