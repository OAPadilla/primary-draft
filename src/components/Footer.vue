<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
	<footer>
		<div class="c-footer">
			<!-- Contact -->
			<div class="c-footer_top">
				<div class="c-footer_contact">
					<h4 class="c-footer_contactTitle">Contact</h4>
					<h4>info@PrimaryDraft.com</h4>
				</div>

				<!-- Social Share -->
				<div class="c-footer_share"><h4>Share</h4></div>
			</div>
			
			<!-- Copyright -->
			<div class="c-footer_copyright">
				<h4>© 2019-2023 Oscar Padilla</h4>
			</div>
		</div>
	</footer>
</template>

<style scoped>
footer {
	background-color: #000000;
}

.c-footer {
	display: flex;
	color: #FFFFFF;
	padding: 20px 2rem 30px;
	flex-direction: column;
	width: 950px;
	margin: auto;
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

.c-footer_copyright {
	margin: auto;
}

h4 {
	font-size: 12px;
	font-weight: normal;
	margin: 0;
}
</style>
