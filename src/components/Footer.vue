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

<style scoped>
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
}

.c-footer_top {
	display: flex;
	margin-bottom: 20px;
}

.c-footer_share {
	margin-left: auto;
}

.c-footer_contactTitle {
	padding-bottom: 5px;
	font-weight: bold;
}

.c-footer_contactEmail {
	color: grey;
}

.c-footer_copyright {
	margin: auto;
}

h4 {
	font-size: 12px;
	font-weight: normal;
	margin: 0;
}
</style>
