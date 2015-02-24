## YUDU HTML template editor front end ##
#### Credit to Toby P ####

**Overview**

The editor page displays the selected template in an iframe, loaded directly from a directory on the server.

A metadata file defines which templates exist and where to find them (the location of this is hard-coded); each template then has a metadata file listing the files that comprise the template and the elements in the template that can be configured.

For each such element or param, the editor displays a selector control to change the value. Params may be of different types (text, image, color, etc.) and the appropriate selector control is shown.

On changing the value of the selector, the iframe preview is updated via JQuery. This is only a client-side change and doesn't affect the server-side template.

When you press Save, the editor builds a zip file. This is formed of the files as listed in the template's metadata file, plus a branding file. The branding file contains one JS variable for each param, with the value set for the param in the editor. The exception is params of type image, which are not included in the branding file; instead, the named image file is directly replaced in the zip with the file uploaded by the user.

Note that the mechanism that changes the preview in the editor is different to the mechanism that rebrands the welcome page in the final output. The template must be set up correctly for these to match up properly.

**Creating a new template**

 - Start with a completed welcome page and identify which elements you want to make rebrandable. 

 - Add a branding file (suggested name: 'Branding.js'). This should list one JS variable per rebrandable element (other than images), and assign each to its default value.

 - In the welcome page, include this file in the `<head>`. In the `<body>`, add a section of JS which dynamically updates the welcome page according to these values (using JQuery to do so is strongly recommended).

 - Double-check that these values are being applied correctly, and that you can now customise the welcome page by changing the branding file.

 - Create a metadata file for the template (see full details of the format below).

 - Add the following information to the metadata file:
  -	Directory path to the template.
  -	Name and location of the branding file, relative to the template's entry point file.
  -	A list of all the files that make up the welcome page, not including the branding file and the metadata file.
  -	A list of screen types which the welcome page is compatible with.
  -	A list of params, one for each rebrandable element.
  
- Upload the new template to a server.

- Open the editor, check the new template appears, select it, make sure you can modify all elements as expected, download the result, and check that the zipped version reflects the changes made in the editor.

**Branding file format**

This is a .js file not a .json file! (This is because welcome pages have difficulties loading JSON files from the local filesystem on some devices, due to cross domain security restrictions.)

The content will be overwritten programmatically by the editor, so you're only providing a default version for the template. The default values you enter here are ignored by the editor (it populates the selector default values from the template metadata file instead), though affect how the template preview appears.

Example:
```
buttonText = "MAIL PLUS";
backgroundColor = "#001373";
previewLink = "category:REPLICA";
content =
'  <h1>START YOUR <span>FREE</span> 30-DAY TRIAL NOW</h1>' +
'  <div class="button">SUBSCRIBE FOR FREE TRIAL</div>' +
'  <a id="latest_link" href="yudu:latest-edition"><div class="button">BUY TODAY\'S EDITION FOR &#163;0.69</div></a>';
```
###Template list metadata file format###

Simple JSON structure containing an array of objects, each consisting of an 'entry' property and a 'metadata' property.

The 'entry' property defines the entry point file for the template (the main HTML file). The 'metadata' property defines the location of the metadata file. Both are relative to the editor program's location. (Using an absolute URL ought to work, but hasn't been tested.)

Example:
```
[
    {
        "entry": "both_generic/welcomeView.html",
        "metadata": "both_generic/TemplateMetadata.json"
    },
    {
        "entry": "ios_kpmg/welcomeView.html",
        "metadata": "ios_kpmg/TemplateMetadata.json"
    }
]
```

**Template main metadata file format**

JSON structure consisting of one object with the following top-level properties:
 - baseLocation
 - configFilePath
 - files
 - screens
 - params
 
*baseLocation:* single string value giving the template's base directory, relative to the editor program's location.

*configFilePath:* single string value giving the branding file location, relative to the baseLocation. (Using an absolute URL almost certainly won't work without a further enhancement to the editor.)

*files:* array of strings, listing the files that comprise the template (not including the branding file or the metadata file itself). Again, these should be relative to the baseLocation.

*screens:* array of strings. Currently permitted values are:
 - iPadLandscape
 - iPadPortrait
 - iPhone4Landscape
 - iPhone4Portrait

Happy to extend this on request, particularly if you also send through a suitable frame image for the device.

*params:* array of objects. Each param object must contain the following basic properties:
 - **name:** this must be unique and, for non-image params, must also match the name of the corresponding variable in the branding file.
 - **label:** this is the text shown in the editor for this param's selector control.
 - **type:** one of `text`, `richText`, `color`, `image`, `boolean`, `radio`. More types can be added on request.
 - **value:** default value, as a string; or the relative URL for the file, if this is an image param.
 
To define the effect of changing the param¹s value, the param may contain:

 - **targets:** array of strings. Each of these should be a JQuery selector that identifies the element or elements that should be updated when the selector changes value. This can be simple (`body`, `#MainDiv`, `.button`) or complex (`#menu ul a:nth-child(2) li`), and may select a single element or multiple elements.

Plus one of the following three properties:

 - **cssProperty:** name of a CSS property that should be updated, such as `background-image` or `color`.
 - **attribute:** name of an HTML attribute that should be updated, such as `src` or `href`.
 - **replaceContent:** should always be used with the value `true`. Use this when the supplied value should be inserted into the HTML structure of the welcome page within the selected elements. This is normally suitable for richText params, and sometimes for text ones.

The targets property defines which elements are updated; then **cssProperty / attribute / replaceContent define how those elements** should be updated with the new value. *More complex changes than this mechanism supports can be achieved using the callback property instead or in addition (see below).*

Finally, it may optionally contain the following properties:

 - **options:** radio button options, only used with radio type params. This should be an array of objects where each object has a label and a value property.
 
The values can be used in conjunction with targets and one of cssProperty, attribute, replaceContent; for example, the values could be different values for a particular CSS property. Alternatively, or additionally, they can be passed into a custom update function in the template using the callback property.

 - **screentypes:** array of screens to which this param applies. These should be values permitted for the top-level screens property. By default a param applies to all screen types; if this property is specified, only the previews for the matching screen types will be updated.

Bear in mind that limiting a param by screen type only affects the editor behaviour. It's up to the template itself to handle these correctly when rendering the content ¬ e.g. if a background image is only used in portrait orientation, it should be applied using a suitable media query or similar.

 - **callback:** JS method in the template to call when the param¹s value is updated. This may only be used with params of type color, boolean and radio! (This is because with other param types, the user has control over the value passed to the method and could potentially pass in values that break the JS.)

The callback method is passed a single parameter containing the new value for the param. The value is passed as a string ¬ this is particularly important with boolean params, since "false" evaluates as true in JS. You¹ll want to do something like
var myBooleanSetting = (newValue == ³true²);
rather than just
var myBooleanSetting = newValue;
This can be used as an alternative to the targets mechanism, where the change to be made is more complex than that supports (such as changing the number of columns or buttons displayed). It can also be used in addition to it, where the change can be applied with the targets mechanism but the template content must also be updated in some additional way ¬ for example, adjusting margin spacing based on the dimensions of an uploaded file.

For examples of metadata files, see those used by the templates currently used by the editor.

*If the results are poor*

You may find that after templatising a welcome page, any edited versions look less good than the original. This usually happens when the page's structure is designed in a way that's very specific to the original design. For instance, there might be a title on the page for which the spacing looks wrong unless it's precisely the length of the original title text; or a logo that only looks sensible if it's the exact dimensions of the original logo image.

Where this happens, some options are:

 - Adjust the underlying HTML to make it more responsive to variable content ¬ for example, change the padding/margin settings around the title text so that it's positioned centrally (or whatever) regardless of its length.
 - Specify in the param label what the expected range of input is, e.g. "Logo (360x180px)". There's no validation to ensure the user uploads an image that matches the guidelines, but at least it's clear what's expected.
 - Abandon the template! Some welcome pages are just too specific to make good templates. Or alternatively just make less of it changeable so that the level of variability the layout needs to handle is lower.

*Other notes*

It's not ideal that the welcome pages created via the editor apply their branding via JS ¬ for example, an unexpected JS error at the wrong point could cause the welcome page to degrade back to its default state. (This is one reason it's vital to remove client-specific content from templates!)

A possible alternative would be to add magic wildcard values in the template files (e.g. in a CSS file: `color: @@mainTextColor@@;`, and have the editor do a text replace as it constructs the zip. However, most implementations of that would mean the template couldn't render in a browser as-is, which would be a pain. Clever use of commenting could avoid that (so all wildcards are commented out until processed and given correct values by the editor), though that's less flexible than the current system and would be a bit fiddly to use. Another alternative would be to make the editor construct a styles file in addition to or instead of the branding one ¬ although again, that's less flexible, and only really works for the cssProperty case. For now I'm planning to stick with the current approach, unless/until it proves to be a problem or someone suggests a brilliant alternative system.

The rendering of the welcome page in the previews in the browser does not of course accurately reflect the display on device. Adjusting the preview frames to include the menu bar will help here, but there's fundamentally no truly accurate way to mimic how the on-device browser will render the content. Feedback on how accurate or otherwise it proves, and what types of element are most unreliable (text sizes?) would be appreciated.

Anyone using the editor to create welcome pages, and anyone creating new templates for the editor: please let me know how it goes, what works well and what turns out to be frustrating or difficult.





