<template>
    <Transition name="fade">
        <div
            v-show="showModal"
            class="c-confirmModalContainer"
            @click.self="emit('cancel')"
        >
            <div class="c-confirmModal">
                <div class="c-confirmModal_content">
                    <p class="c-confirmModal_message">{{ message }}</p>
                    <div class="c-confirmModal_buttons">
                        <button
                            class="c-confirmModal_cancelBtn"
                            @click="emit('cancel')"
                        >
                            {{ cancelText }}
                        </button>
                        <button
                            class="c-confirmModal_acceptBtn"
                            @click="emit('accept')"
                        >
                            {{ acceptText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref, Ref, watchEffect } from 'vue';

const emit = defineEmits(['accept', 'cancel'])

/**
 * acceptText - Accept button text
 * cancelText - Cancel button text
 * message - Message on modal
 * show - Handle show/hidden state of modal from prop passed from parent component
 */
const props = defineProps({
    acceptText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' },
    message: { type: String, default: 'Are you sur?' },
    show: { type: Boolean, default: false }
});

const showModal: Ref<boolean> = ref(props.show);

watchEffect(() => {
    showModal.value = props.show;
    if (props.show) {
        document.body.style.overflow = 'hidden';
	} else {
        document.body.style.overflow = 'auto';
	}
});
</script>

<style scoped lang="scss">
@import '@/styles/main.scss';
@include vue-fade(0.2);

.c-confirmModalContainer {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.c-confirmModal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &_content {
        width: fit-content;
        background-color: $background-color-base;
        padding: 1.5rem;
        border-radius: 5px;
        box-shadow: $standard-box-shadow;
    }

    &_message {
        margin: 0 0 $standard-spacing;
    }

    &_buttons {
        display: flex;
        justify-content: center;
    }

    button {
        min-width: 70px;
        padding: 8px;
        border-radius: 5px;

        &:hover {
            cursor: pointer;
            opacity: 0.7;
        }
    }

    &_cancelBtn {
        color: $color-dark-grey;
        background-color: $background-color-base;
        border: 1px solid $color-light-grey;
    }

    &_acceptBtn {
        margin-left: $standard-spacing;
        background-color: $color-red-alert;
        border: 1px solid $color-red-alert;
        font-weight: bold;
    }
}
</style>