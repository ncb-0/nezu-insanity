<script>
import { run } from "svelte/legacy";

let {
	fontSize = $bindable(24),
	fontStyles,
	fontStyle = $bindable(),
	fontTracking = $bindable(0),
	fontLeading = $bindable(1),
	fontFamily = "sans-serif",
	placeholderText = `${fontFamily}: AaGgRr/0123456789`,
} = $props();

let textArea = $state();

$effect(() => {
	textArea;
	textArea.style.setProperty("font-size", `${fontSize}px`);
});
$effect(() => {
	textArea;
	textArea.style.setProperty("font-weight", fontStyle.weight);
});
$effect(() => {
	textArea;
	textArea.style.setProperty("font-style", fontStyle.style);
});
$effect(() => {
	textArea;
	textArea.style.setProperty(
		"letter-spacing",
		`calc(${fontTracking} * 0.01em)`
	);
});
$effect(() => {
	textArea;
	textArea.style.setProperty("line-height", fontLeading);
});
$effect(() => {
	textArea;
	textArea.style.setProperty("font-family", fontFamily);
});
</script>

<div class="type-tester">
	<div class="font-options">
		{#if fontStyles}
			<div class="font-option">
				<label for="font-style">style</label>
				<select id="font-style" bind:value={fontStyle}>
					{#each fontStyles as style}
						{#if style.weight === 400 && style.style === "normal"}
							<option value={style} selected>{style.name}</option>
						{:else}
							<option value={style}>{style.name}</option>
						{/if}
					{/each}
				</select>
			</div>
		{/if}

		<div class="font-option">
			<label for="font-size">size</label>
			<input
				class="slider"
				type="range"
				id="font-size"
				bind:value={fontSize}
				min="6"
				max="144"
			/>
			<input
				type="number"
				bind:value={fontSize}
				min="6"
				max="144"
				style="width: 4ch; text-align: right;"
			/>
		</div>

		<div class="font-option">
			<label for="font-tracking">tracking</label>
			<input
				class="slider"
				type="range"
				id="font-tracking"
				bind:value={fontTracking}
				min="-20"
				max="20"
			/>
			<input
				type="number"
				bind:value={fontTracking}
				min="-20"
				max="20"
				style="width: 4ch; text-align: right;"
			/>
		</div>

		<div class="font-option">
			<label for="font-leading">leading</label>
			<input
				class="slider"
				type="range"
				id="font-leading"
				bind:value={fontLeading}
				min="0.5"
				max="3"
				step="0.1"
			/>
			<input
				type="number"
				bind:value={fontLeading}
				min="0.5"
				max="3"
				step="0.1"
				style="width: 4ch; text-align: right;"
			/>
		</div>
	</div>

	<!-- <textarea resize="none" bind:this={textArea}>{placeholderText}</textarea> -->
	<div class="textarea">
		<h1
			contenteditable="true"
			spellcheck="false"
			resize="none"
			bind:this={textArea}
		>
			{placeholderText}
		</h1>
	</div>
</div>

<style>
.type-tester {
	/* margin-bottom: 1em; */
	width: 100%;
	/* margin: 0; */
}
.font-options {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 0.5rem 2ch;
	align-items: baseline;
}
@media (max-width: 800px) {
	.font-options {
		grid-template-columns: 1fr 1fr;
	}
}
@media (max-width: 600px) {
	.font-options {
		grid-template-columns: 1fr;
	}
}
.font-option {
	/* display: grid; */
	display: flex;
	/* grid-auto-flow: column; */
	align-items: baseline;
	/* vertical-align: middle; */
	gap: 1ch;
	width: 100%;
}
label {
	font-weight: 700;
}
textarea,
.textarea {
	margin-top: 1ex;
	width: 100%;
	display: block;
	/* border: none; */
	padding: 0.5rem;
	border: 1px solid rgba(var(--text-color), 0.3);
	background: rgb(var(--bg-color));
	color: rgb(var(--text-color));
	hyphens: auto;
	word-break: normal;
	overflow-y: hidden;
	overflow-x: hidden;
}
[contenteditable],
textarea {
	outline: 0px solid transparent;
	/* line-height: 2ex; */
	/* letter-spacing: normal; */
}
select,
input {
	font-family: var(--font-mono) !important;
	background: rgb(var(--bg-color));
	border: 1px solid rgb(var(--text-color), 0.3);
	/* border: none; */
	padding: 0 !important;
	margin: 0 !important;
	line-height: 2ex;
	/* outline: none; */
	color: rgb(var(--text-color));
	border-radius: 0;
	/* display: block; */
	width: 100%;
	font-size: 1rem !important;
}
.slider {
	/* transform: translateY(0px); */
	/* border-radius: 2px; */
	-webkit-appearance: none;
	width: 100%;
	appearance: none;
	border: none;
	height: 1px;
	background: rgb(var(--text-color), 0.3);
	/* vertical-align: -4px; */
	/* transform: translateY(1px); */
	/* margin-bottom: 12px; */
}
.slider::-moz-range-thumb {
	-webkit-appearance: none !important;
	appearance: none !important;
	border-radius: 0;
	width: 7px;
	height: 7px;
	background: rgb(var(--text-color));
	cursor: pointer;
	border: none;
	outline: none;
	box-shadow: none;
}
.slider::-webkit-slider-thumb {
	-webkit-appearance: none !important;
	appearance: none !important;
	border-radius: 0;
	width: 7px;
	height: 7px;
	background: rgb(var(--text-color));
	cursor: pointer;
	border: none;
	outline: none;
	box-shadow: none;
}
.slider:hover::-webkit-slider-thumb {
	cursor: pointer;
	border: none;
	outline: none;
	width: 9px;
	height: 9px;
}
.slider:hover::-moz-range-thumb {
	cursor: pointer;
	border: none;
	outline: none;
	width: 9px;
	height: 9px;
}
input[type="number"] {
	-webkit-appearance: textfield;
	-moz-appearance: textfield;
	appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
	-webkit-appearance: none;
}
</style>
