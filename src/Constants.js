var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : Constants
// 
// SCREENTYPES: hard-coded data on the types of screen supported for editor 
//   previews.
//=============================================================================
(function(Constants, undefined)
{
	Constants.SCREENTYPES =
	[
		{
			'name': 'iPad landscape',
			'code': 'iPadLandscape',
			'screenwidth': 1024,
			'screenheight': 768,
			'frameimage': 'PreviewFrames/ipad_landscape.png',
			'framewidth': 1332,
			'frameheight': 1058,
			'offset': { 'x': 148, 'y': 144 }
		},
		{
			'name': 'iPad portrait',
			'code': 'iPadPortrait',
			'screenwidth': 768,
			'screenheight': 1024,
			'frameimage': 'PreviewFrames/ipad_portrait.png',
			'framewidth': 1062,
			'frameheight': 1335,
			'offset': { 'x': 144, 'y': 153 }
		},
		{
			'name': 'iPhone 4 landscape',
			'code': 'iPhone4Landscape',
			'screenwidth': 480,
			'screenheight': 320,
			'frameimage': 'PreviewFrames/iphone_landscape.png',
			'framewidth': 744,
			'frameheight': 380,
			'offset': { 'x': 133, 'y': 29 }
		},
		{
			'name': 'iPhone 4 portrait',
			'code': 'iPhone4Portrait',
			'screenwidth': 320,
			'screenheight': 480,
			'frameimage': 'PreviewFrames/iphone_portrait.png',
			'framewidth': 392,
			'frameheight': 757,
			'offset': { 'x': 38, 'y': 137 }
		}
	];
}(Yudu.TemplateEditor.Constants = Yudu.TemplateEditor.Constants || {} ));
