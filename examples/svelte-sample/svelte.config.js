import adapter from '@sveltejs/adapter-static';

/**
 * Svelte's compile-time a11y checks don't recognise custom elements (e.g.
 * `<kb-button>`) as interactive, so attaching `onclick` triggers false
 * positives for `a11y_click_events_have_key_events` and
 * `a11y_no_static_element_interactions`. The filter below silences these
 * two warnings when the element name starts with `kb-`.
 */
const KB_A11Y_FALSE_POSITIVES = new Set([
	'a11y_click_events_have_key_events',
	'a11y_no_static_element_interactions',
]);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	onwarn(warning, handler) {
		if (
			KB_A11Y_FALSE_POSITIVES.has(warning.code) &&
			(warning.message?.includes('<kb-') || warning.frame?.includes('<kb-'))
		) {
			return;
		}
		handler(warning);
	},
	kit: {
		adapter: adapter({
			fallback: 'index.html',
		}),
	},
};

export default config;
