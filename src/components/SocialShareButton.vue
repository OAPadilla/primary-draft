<template>
	<div class="c-socialShareButton">
        <a
            class="c-socialShareButton_link"
            :href="url"
            :style="{ 'background-color': backgroundColor }"
            target="_blank" 
        >
            <span class="c-socialShareButton_icon">
                <slot />
            </span>
            {{ label }}
        </a>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({ 
    backgroundColor: { type: String, default: 'black' },
    label: { type: String, default: '' },
    url: { type: String, default: '' }
});
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-socialShareButton {
	&_link {
		border-radius: 8px;
		color: $color-white;
		padding: 6px;
		display: flex;
		align-items: center;

		&:hover {
			text-decoration: none;
			opacity: 0.8;
		}
	}

	&_icon {
		width: $font-size-m;
		height: $font-size-m;
		fill: $color-white;
		padding-right: 4px;

		svg {
			fill: white;
		}
	}
}
</style>