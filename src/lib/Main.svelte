<script>
	export let textTop = "";
	export let textBottom = "";
	export let fgColor = "var(--grayish)"; //"rgb(255,255,255)";
	export let bgColor = "var(--grayish)"; //"rgb(255,255,255)";
	export let bgImg = "url('/img/bg.svg')";
	export let download = "/";
	export let date = "N/A";
	export let turbowarp = false;
	export let classes = "";

	var changeTheme = function () {
		localStorage.setItem(
			"theme",
			localStorage.getItem("theme") == "dark" ? "" : "dark"
		);
		window.location.href = "";
	};
</script>

<body style="--bg-bg: {bgColor}; --bg-fg: {fgColor}" class={classes}>
	<div class="banner-wrapper">
		<div class="banner" style="background-image: {bgImg}">
			<div class="banner-text">
				<p>
					{textTop}
					<a
						class="download"
						download={textTop.split("/").pop()}
						href={download}>(Download)</a
					> <a href="././" class="download">(../)</a>
					<a href="/" class="download">(/)</a>
					{#if turbowarp}
						<a
							class="download"
							href="https://turbowarp.org/editor?project_url={download}"
							>(TurboWarp)</a
						>
					{/if}
				</p>
			</div>
			<slot />
			<div class="banner-text">
				{textBottom}
				<a href="https://tdgmdev.net/" class="download">(Home)</a>
				<a href="#" class="download" on:click={changeTheme}
					>(Change theme)</a
				>
			</div>
		</div>
	</div>
</body>

<style lang="css">
	body {
		--blue: #4689e8;
		--blue-again: #5687d9;
		--white: rgb(255, 255, 255);
		--grayish: rgb(240, 240, 240);
		--gray: rgb(210, 210, 210);
		--black: rgb(0, 0, 0);

		color: var(--black);
	}
	.dark {
		--white: rgb(32, 32, 32);
		--grayish: rgb(47, 47, 47);
		--gray: rgb(70, 70, 70);
		--black: rgb(255, 255, 255);
		--blue: rgb(128, 128, 128);
		--blue-again: rgb(190, 190, 190);
	}

	.banner {
		width: 100%;
		height: 100vh;
		background-size: auto 75%;
		background-position: center;
		background-repeat: no-repeat;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		font-size: 24px;
	}

	body {
		background: radial-gradient(
			circle at 5px 5px,
			var(--bg-fg) 1px,
			var(--bg-bg) 0px,
			var(--bg-bg) 8px
		);
		background-size: 10px 10px;
		background-repeat: repeat;
		/*background: url('/bg.png');
			background-size: cover;
			*/
	}

	.banner-part {
		height: 500px;
	}

	.banner-text {
		/*color: white;*/
		margin: 30px;
		/*filter: drop-shadow( 0px 0px 10px rgba(0, 0, 0, 1));*/
		text-align: center;
	}

	.banner-mid {
		width: calc(100% - 50px);
		font-size: 12px;
		max-height: 100%;
		display: flex;
		justify-content: space-around;
		height: 100%;
		overflow: auto;
		font-weight: normal;
	}

	.download {
		font-size: 50%;
	}

	p {
		margin-block-start: 0;
		margin-block-end: 0;
	}

	.banner-mid {
		border: solid var(--gray) 1px;
		border-radius: 10px;
	}

	a {
		text-decoration: none;
		color: var(--blue-again);
	}

	.dark {
	}
</style>
