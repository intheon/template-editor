var Yudu = window.Yudu || {};
Yudu.TemplateEditor = Yudu.TemplateEditor || {};

//=============================================================================
// Static class : LocalTestData
// 
// Hard-coded data used when the editor is running locally and can't access
// the proper data files.
//
// templateList
// templateData
//=============================================================================
(function(LocalTestData, undefined)
{
	LocalTestData.templateList =
	[
		{
			'entry': "Template1/welcomeView.html",
			'metadata': "Template1/TemplateMetadata.json"
		}
	];

	LocalTestData.templateData =
{
	"baseLocation": "Template1",
	"configFilePath": "Branding/Branding.js",
	"files":
	[
		"bg.jpg",
		"Branding/bg_Landscape.jpg",
		"Branding/bg_PhoneLandscape.jpg",
		"Branding/bg_Portrait.jpg",
		"Branding/logo.png",
		"js/jquery-1.9.0.min.js",
		"js/welcomeView.js",
		"powered_by_logo_black.png",
		"powered_by_logo.png",
		"welcomeView.css",
		"welcomeView.html"
	],
	"screens":
	[
		"iPadLandscape",
		"iPadPortrait",
		"iPhone4Portrait",
		"iPhone4Landscape"
	],
	"params":
	[
		{
			"name": "useLogoForTitle",
			"label": "Use a logo image for the main title?",
			"type": "boolean",
			"callback": "updateUseLogoForTitle",
			"value": "true"
		},
		{
			"name": "useDropShadows",
			"label": "Use drop shadows?",
			"type": "boolean",
			"callback": "updateUseDropShadows",
			"value": "false"
		},
		{
			"name": "useRoundedButtons",
			"label": "Use rounded corners on buttons?",
			"type": "boolean",
			"callback": "updateUseRoundedButtons",
			"value": "false"
		},
		{
			"name": "numberOfButtons",
			"label": "Number of buttons to display",
			"type": "radio",
			"updateMethod": "updateNumberOfButtons",
			"options":
			[
				{"label": "Zero", "value": 0},
				{"label": "One", "value": 1},
				{"label": "Two", "value": 2},
				{"label": "Three", "value": 3}
			],
			"callback": "setVisibleButtons",
			"value": 3
		},
		{
			"name": "titleContent",
			"label": "Main title",
			"type": "text",
			"targets": ["#TitleContent"],
			"replaceContent": true,
			"value": "YUDU"
		},
		{
			"name": "textColor",
			"label": "Main text colour",
			"type": "color",
			"targets": ["#InsetContent", ".button"],
			"cssProperty": "color",
			"value": "#ffffff"
		},
		{
			"name": "insetBgColor",
			"label": "Text background colour",
			"type": "color",
			"targets": ["#InsetContent", ".button"],
			"cssProperty": "background-color",
			"value": "#3ba5dc"
		},
		{
			"name": "titleColor",
			"label": "Title text colour",
			"type": "color",
			"targets": ["#Title"],
			"cssProperty": "color",
			"value": "#000000",
			"callback": "setTitleTextColour"
		},
		{
			"name": "bg_Landscape",
			"label": "Background (landscape)",
			"type": "image",
			"screentypes": ["iPadLandscape"],
			"targets": ["body"],
			"cssProperty": "background-image",
			"value": "Branding/bg_Landscape.jpg"
		},
		{
			"name": "bg_Portrait",
			"label": "Background (portrait)",
			"type": "image",
			"screentypes": ["iPadPortrait"],
			"targets": ["body"],
			"cssProperty": "background-image",
			"value": "Branding/bg_Portrait.jpg"
		},
		{
			"name": "bg_PhoneLandscape",
			"label": "Background (landscape, phone)",
			"type": "image",
			"screentypes": ["iPhone4Landscape"],
			"targets": ["body"],
			"cssProperty": "background-image",
			"value": "Branding/bg_PhoneLandscape.jpg"
		},
		{
			"name": "bg_PhonePortrait",
			"label": "Background (portrait, phone)",
			"type": "image",
			"screentypes": ["iPhone4Portrait"],
			"targets": ["body"],
			"cssProperty": "background-image",
			"value": "Branding/bg_PhonePortrait.jpg"
		},
		{
			"name": "logo",
			"label": "Logo",
			"type": "image",
			"targets": ["#TopLogo img", "#Logo img"],
			"attribute": "src",
			"value": "Branding/logo.png"
		},
		{
			"name": "titleLogo",
			"label": "Title logo",
			"type": "image",
			"targets": ["#TitleLogo img"],
			"attribute": "src",
			"value": "Branding/TitleLogo.png"
		},
		{
			"name": "insetContent",
			"label": "Content for inset box",
			"type": "richText",
			"targets": ["#InsetContent"],
			"replaceContent": true,
			"value": "<h2>Welcome header</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur elit elit, consequat ac consectetur eget, tempus quis nisi. Sed volutpat congue nunc consequat aliquam. Nunc aliquet, quam non facilisis congue, nunc sapien pellentesque nisl, at volutpat metus tellus in lacus. Integer ac eros quis ante sagittis fermentum eget eu leo. Nunc eget volutpat tortor. Vivamus nec ipsum sed nibh posuere feugiat.</p><p>Etiam quis lacus et massa varius placerat eget ut mauris. Nullam ullamcorper varius libero consequat tempus. Vivamus auctor consectetur lorem sit amet tristique. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed est tellus, condimen tum et congue quis, aliquet nec erat. Nam id justo turpis.  Aliquam ut fringilla ligula. Praesent pellentesque vulputate urient montes, nascetur ridiculus mus. Donec aliquet erat nec nulla sagittis eleifend ac vel ant.</p>"
		}
    ]
};
}(Yudu.TemplateEditor.LocalTestData = Yudu.TemplateEditor.LocalTestData || {}));
