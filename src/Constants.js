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
			'frameheight': 1056,
			'offset': { 'x': 151, 'y': 142 }
		},
		{
			'name': 'iPad portrait',
			'code': 'iPadPortrait',
			'screenwidth': 768,
			'screenheight': 1024,
			'frameimage': 'PreviewFrames/ipad_portrait.png',
			'framewidth': 1062,
			'frameheight': 1335,
			'offset': { 'x': 144, 'y': 152 }
		},
		{
			'name': 'iPhone 4 landscape',
			'code': 'iPhone4Landscape',
			'screenwidth': 480,
			'screenheight': 320,
			'frameimage': 'PreviewFrames/iphone4_landscape.png',
			'framewidth': 744,
			'frameheight': 379,
			'offset': { 'x': 133, 'y': 28 }
		},
		{
			'name': 'iPhone 4 portrait',
			'code': 'iPhone4Portrait',
			'screenwidth': 320,
			'screenheight': 480,
			'frameimage': 'PreviewFrames/iphone4_portrait.png',
			'framewidth': 392,
			'frameheight': 757,
			'offset': { 'x': 38, 'y': 137 }
		},
		{
			'name': 'iPhone 5 Landscape',
			'code': 'iPhone5Landscape',
			'screenwidth': 568,
			'screenheight': 320,
			'frameimage': 'PreviewFrames/iphone5_landscape.png',
			'framewidth': 840,
			'frameheight': 450,
			'offset': { 'x': 134, 'y': 62 }
		},
		{
			'name': 'iPhone 5 Portrait',
			'code': 'iPhone5Portrait',
			'screenwidth': 320,
			'screenheight': 568,
			'frameimage': 'PreviewFrames/iphone5_portrait.png',
			'framewidth': 450,
			'frameheight': 840,
			'offset': { 'x': 64, 'y': 135 }
		},
		{
			'name': 'iPhone 6 landscape',
			'code': 'iPhone6Landscape',
			'screenwidth': 647,
			'screenheight': 364,
			'frameimage': 'PreviewFrames/iphone6_landscape.png',
			'framewidth': 900,
			'frameheight': 444,
			'offset': { 'x': 131, 'y': 44 }
		},
		{
			'name': 'iPhone 6 portrait',
			'code': 'iPhone6Portrait',
			'screenwidth': 363,
			'screenheight': 647,
			'frameimage': 'PreviewFrames/iphone6_portrait.png',
			'framewidth': 444,
			'frameheight': 900,
			'offset': { 'x': 42, 'y': 123 }
		},
		{
			'name': 'iPhone 6+ landscape',
			'code': 'iPhone6PlusLandscape',
			'screenwidth': 736,
			'screenheight': 414,
			'frameimage': 'PreviewFrames/iphone6plus_landscape.png',
			'framewidth': 1024,
			'frameheight': 500,
			'offset': { 'x': 135, 'y': 32 }
		},
		{
			'name': 'iPhone 6+ portrait',
			'code': 'iPhone6PlusPortrait',
			'screenwidth': 414,
			'screenheight': 736,
			'frameimage': 'PreviewFrames/iphone6plus_portrait.png',
			'framewidth': 500,
			'frameheight': 1024,
			'offset': { 'x': 45, 'y': 145 }
		},
		{
			'name': 'Nexus 7 Landscape',
			'code': 'nexus7Landscape',
			'screenwidth': 910,
			'screenheight': 601,
			'frameimage': 'PreviewFrames/nexus7_landscape.png',
			'framewidth': 1300,
			'frameheight': 800,
			'offset': { 'x': 221, 'y': 94 }
		},
		{
			'name': 'Nexus 7 Portrait',
			'code': 'nexus7Portrait',
			'screenwidth': 601,
			'screenheight': 910,
			'frameimage': 'PreviewFrames/nexus7_portrait.png',
			'framewidth': 800,
			'frameheight': 1300,
			'offset': { 'x': 95, 'y': 164 }
		}
	];
}(Yudu.TemplateEditor.Constants = Yudu.TemplateEditor.Constants || {} ));
