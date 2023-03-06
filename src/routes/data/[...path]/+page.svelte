<script>
	import Main from "$lib/Main.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { browser } from "$app/environment";

	/** @type {import('./$types').PageData} */  
	export let data;

	let {path, contents, raw, currPath, extension, width, height, date} = data;

	var isDark = browser
		? localStorage.getItem("theme") == "dark"
			? "dark"
			: ""
		: "";
</script>

<Main
	classes={isDark}
	textTop={path}
	download="/{currPath}"
	textBottom="File viewer by tdgmdev.net"
	turbowarp={extension == "sjson" || extension == "sb3"}
>
	<div class="banner-mid" style="--width: {width}">
		{#if !raw}
			<table style="--width: 100%">
				<tr>
					<td>Name</td>
					<td>Modified on</td>
					<td>Download</td>
					<td>Special actions</td>
				</tr>
				{#each contents as content}
					<tr>
						<td
							><a href="{$page.url.pathname}/{content.link}"
								>{content.name}</a
							></td
						>
						<td><span>{content.mtime}</td>
						<td
							><a
								href="/api/file/{content.dir}"
								download={!content.extension ? `${currPath.split('/').pop()}.zip` : content.name}>Download</a
							></td
						>
						{#if content.extension == "sjson" || content.extension == "sb3"}
							<td
								><a
									href="https://turbowarp.org/editor?project_url=https://files.tdgmdev.net/api/file/{content.dir}"
									download={content.name}>TurboWarp</a
								></td
							>
						{/if}
					</tr>
				{/each}
			</table>
		{/if}

		{#if raw}
			<table style="--width: {width}">
				<tr>
					<td>File Viewer</td>
				</tr>
				{#if extension == "sb3" || extension == "sjson"}
					<iframe
						src="https://turbowarp.org/embed?project_url=https://files.tdgmdev.net{currPath}"
						class="turbowarp"
						width="800px"
						height="600px"
						style="background-color:white; --width: {width}; --height: {height}"
					/>
				{/if}
				{#if extension != "sb3" && extension != "sjson"}
					<iframe
						src={currPath}
						class="file-{extension}"
						width="800px"
						height="800px"
						style="background-color:white; --width: {width}; --height: {height}"
					/>
				{/if}
			</table>
		{/if}
	</div>
</Main>

<style>
	iframe {
		width: 100%;
		height: 98%;
	}

	table .file-jpg,
	table .file-png {
		height: var(--height);
	}

	.file-sb3 {
		display: none;
	}

	table .turbowarp {
		height: 75vmin;
	}

	.banner-entry {
		display: table-row;
	}

	table {
		overflow-y: auto;
		overflow-x: auto;
		width: var(--width);
		max-width: 100vw;
		display: block;
	}

	td {
		width: 200px;
	}

	iframe {
		border: none;
	}

	tr:not(:last-child) {
		border-bottom: solid var(--gray) 1px;
	}

	tr:first-child {
		background-color: var(--blue);
		color: white;
		position: sticky;
		top: 0;
	}

	tr {
		display: block;
		padding: 7px;
	}

	a {
		text-decoration: none;
		color: var(--blue-again);
	}

	.banner-mid {
		border: solid var(--gray) 1px;
		border-radius: 10px;
	}

	.banner-mid {
		width: var(--width);
		font-size: 12px;
		max-height: 100%;
		display: flex;
		justify-content: space-around;
		height: 100%;
		overflow: auto;
		font-weight: normal;
		background: var(--white);
	}
</style>
