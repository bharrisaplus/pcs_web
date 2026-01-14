export default {
	extends: [
		'stylelint-stylus/standard'
	],
	"ignoreFiles": ['**/README.md'],
	plugins: [
		'stylelint-stylus',
		'stylelint-no-unsupported-browser-features'
	],
	rules: {
		"stylus/declaration-colon": 'always',
		"stylus/indentation": 4,
		"stylus/selector-list-comma": 'always',
		"stylus/color-hex-case": null,
		"plugin/no-unsupported-browser-features": [ true,
			{
				"ignore": ["css-nesting"],
				"severity": 'warning'
			}
		]
	}
};
