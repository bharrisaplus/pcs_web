# Icons/Favicons

## Overview
Different sized assets are needed to get an icon/badge/logo in the browser tab when the page is open or when the web app has been installed to the desktop. Since the icon/favicon won't change much the steps aren't automated.

## Meta
### Vectorize and Organize
If the logo/icon is not already a vector image then first starting with a monochrome raster image, _$INPUT_, using image magick to get a bitmap of the image:

```
magick $INPUT -background [white|black] -flatten -threshold 50% -depth 1 image_bitmap.pbm
```
Next trace the bitmap and create a vector using potrace:
```
potrace -s -o image_vector.svg image_bitmap.pbm
```
Now the image can be resized/scaled to fit the necessary specs for the various icon formats and various parts of the image and/or background can have color added using an image/svg editor (Affinity, Figma, Photoshop, etc). Below are the minimum amount of icons needed for browser tabs and PWA/offline-install.

* Android(png)
	* Chrome (See webmanifest.source.json)
		*  `{ "icons": ["src": ] }` => 192x192
		*  `{ "icons": ["src": ] }` => 512x512

* iOS
	* Safari (see `<head>` in demo.pug)
		* `<link rel="apple-touch-icon" type="image/png" />` => 180x180

* MacOS
	* Safari (see `<head>` in demo.pug)
		* `<link rel="mask-icon" type="image/svg+xml" />` => any

* Windows(png)
	* Edge (See browserconfig.source.xml)
		* `<square70x70logo />` => 70x70
		* `<square144x144logo />` => 144x144
		* `<square150x150logo />` => 150x150
		* `<square310x310logo />` => 310x150
		* `<square310x150logo />` => 310x310

* Webetc
	* Browsers (See `<head>` in demo.pug)
		* `<link rel="icon" type="image/png" />`
			* 16x16
			* 32x32
		* `<link rel="shortcut icon" type="type="image/vnd.microsoft.icon" />` (ico) => 32x32
		* `<link rel="icon" type="image/svg+xml" />` => any

### Adapt
Alternate-color logo can be used, with the `media` attribute, to better contrast with the the browser tab color when toggled between light/dark mode.

```
<link rel="icon" media="(prefers-color-scheme: light)" href=$DARK_ICON_URL />
<link rel=" icon" media="(prefers-color-scheme: dark)" href=$LIGHT_ICON_URL />
```

## On page
### Usage: Inline vs Image:src
When showing an svg image as part of the DOM keep in mind the size of the image file and how much control of it is needed.

* Inline
	* Need to manipulate/access elements within the svg/xml via css/{js,mjs}
		* Things like animating, changing color or size (if changing the aspect ratio)
	* The svg file itself is smaller (storage wise) than the html file or won't significantly increase the html file size. For example the html file is 1MB and the svg files is 500bytes then it's probably fine.

* Image `src` attribute
	* The svg file is too large to include in the html without impacting page load
		* Images are cached separate from the html
	* The image might change frequently
		* Images can have a different cache expiry than the html or other assets
	* Only scaling the image or changing the background color

## Privacy
If the image is preferred to not be easily downloadable then look at the Encrypted Media Extensions API within the Web APIs
