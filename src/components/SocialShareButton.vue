<template>
	<div class="c-socialShareButton">
        <a
            class="c-socialShareButton_link"
            :href="url"
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
    label: { type: String, default: '' },
    url: { type: String, default: '' }
});
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';

.c-socialShareButton {
	&:hover {
		opacity: 0.7;
	}

	&_link {
		border: $border-standard;
		border-radius: 8px;
		padding: 6px;
		display: flex;
		align-items: center;

		&:hover {
			text-decoration: none;
		}
	}

	&_icon {
		width: $font-size-m;
		height: $font-size-m;
		padding-right: 4px;

		svg {
			fill: $color-black;
		}
	}
}
</style>