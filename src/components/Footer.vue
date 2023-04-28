<template>
	<footer>
		<div class="c-footer">
			<!-- Contact -->
			<div class="c-footer_top">
				<div class="c-footer_contact">
					<div class="c-footer_contactTitle">Contact</div>
					<div class="c-footer_contactEmail">info@PrimaryDraft.com</div>
				</div>

				<!-- Social Share -->
				<!-- <div class="c-footer_share">Share</div> -->
			</div>
			
			<!-- Copyright -->
			<div class="c-footer_copyright">
				<div>© 2023 Oscar Padilla</div>
			</div>
		</div>
	</footer>
</template>

<style scoped lang="scss">
footer {
	background-color: var(--base-background-color);
	padding: 0 2rem;
}

.c-footer {
	display: flex;
	padding: 20px 0 30px;
	flex-direction: column;
	max-width: 950px;
	margin: auto;
	border-top: var(--standard-border);
	font-size: 12px;

	h4 {
		font-size: 12px;
		font-weight: normal;
		margin: 0;
	}

	&_top {
		display: flex;
		margin-bottom: var(--standard-spacing);
	}

	&_share {
		margin-left: auto;
	}

	&_contactTitle {
		padding-bottom: 5px;
		font-weight: bold;
	}

	&_contactEmail {
		color: grey;
	}

	&_copyright {
		margin: auto;
	}
}
</style>
