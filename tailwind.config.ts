import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
	darkMode: [
		'variant',
		[
			'@media (prefers-color-scheme: dark) { &:not([data-weblah-color-scheme="light"] *) }',
			'&:is([data-weblah-color-scheme="dark"] *)'
		]
	],

	content: [
		'./src/**/*.{html,js,svelte,ts}',
	],
	
	theme: {
		extend: {
			colors: {
				accent: colors.blue,
				// Semantic Background
				sb: {
					overlay: 'var(--weblah-color-sb-overlay)',
					primary: 'var(--weblah-color-sb-primary)',
					secondary: 'var(--weblah-color-sb-secondary)',
					tertiary: 'var(--weblah-color-sb-tertiary)'
				},
				// Semantic Foreground
				sf: {
					primary: 'var(--weblah-color-sf-primary)',
					secondary: 'var(--weblah-color-sf-secondary)',
					tertiary: 'var(--weblah-color-sf-tertiary)'
				},
				// Semantic Stroke
				ss: {
					primary: 'var(--weblah-color-ss-primary)',
					secondary: 'var(--weblah-color-ss-secondary)'
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} as Config;
