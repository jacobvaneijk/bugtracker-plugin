<template>
    <div>
        <div class="bt-popover-wrapper" @click="$emit('close')" />

        <div
            class="bt-popover"

            :class="{ 'bt-is-loading': settings.isLoading, 'bt-has-heading': $slots.heading }"
            :style="style"
        >
            <div class="bt-popover-heading" v-if="$slots.heading">
                <slot name="heading" />
            </div>

            <slot />

            <div class="bt-popover-actions" v-if="$slots.actions">
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        style: function () {
            return {
                top: `${this.settings.position.top}px`,
                left: `${this.settings.position.left}px`,
            }
        },
    },
    props: {
        settings: Object,
    },
}
</script>

<style lang="sass" scoped>
$font-family: "Roboto", sans-serif;

* {
    box-sizing: border-box;
}

.bt-popover-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5000;
    width: 100%;
    height: 100%;
}

.bt-popover {
    position: absolute;
    z-index: 5100;
    width: 408px;
    font-family: $font-family;
    background-color: #fff;
    box-shadow: 0 4px 15px rgba(#000, .15);
    border-radius: 3px;

    &::after {
        position: absolute;
        top: -5.2px;
        left: 50%;
        z-index: 5200;
        width: 12px;
        height: 6px;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 12 7' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m11.5 6.3334h-11.5c0.31476 0 0.61115-0.14819 0.8-0.4l4.15-5.5333c0.33137-0.44183 0.95817-0.53137 1.4-0.2 0.075806 0.056854 0.14315 0.12419 0.2 0.2l4.15 5.5333c0.18885 0.25181 0.48524 0.4 0.8 0.4z' fill='%23fff'/%3E%3C/svg%3E%0A");
        content: "";
        transform: translateX(-50%);
    }

    &.bt-has-heading {
        &::after {
            background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg version='1.1' viewBox='0 0 12 7' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m11.5 6.3334h-11.5c0.31476 0 0.61115-0.14819 0.8-0.4l4.15-5.5333c0.33137-0.44183 0.95817-0.53137 1.4-0.2 0.075806 0.056854 0.14315 0.12419 0.2 0.2l4.15 5.5333c0.18885 0.25181 0.48524 0.4 0.8 0.4z' fill='%23f7f7f7'/%3E%3C/svg%3E%0A");
        }
    }

    .bt-popover-heading {
        position: relative;
        padding: 16px;
        background-color: #f7f7f7;
        border-bottom: 1px solid #dedede;
        border-top-right-radius: 3px;
        border-top-left-radius: 3px;

        .bt-popover-title {
            margin: 0 0 8px;
            font-family: $font-family;
            font-weight: 400;
            font-size: 16px;
            color: #444;
            line-height: (16px * 1.0 * 1.2);
        }

        .bt-popover-intro {
            margin: 0;
            font-family: $font-family;
            font-weight: 400;
            font-size: 12px;
            color: #777;
            line-height: (12px * 1.1 * 1.2);
        }
    }

    .bt-popover-actions {
        display: flex;
        padding: 12px 16px;
        background-color: #f7f7f7;
        border-top: 1px solid #dedede;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
        justify-content: flex-end;

        .bt-popover-button-secondary {
            position: relative;
            display: inline-block;
            margin: 0;
            padding: 8px 0;
            font-family: $font-family;
            font-weight: 500;
            font-size: 12px;
            color: #999;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: .5px;
            line-height: (12px * 1.0 * 1.2);
            background-color: transparent;
            border: 0;
            cursor: pointer;
            transition: color ease-in-out .1s, opacity ease-in-out .1s;

            & + .bt-popover-button-secondary {
                margin-left: 16px;
            }

            &::after {
                position: absolute;
                bottom: 6px;
                left: 0;
                width: 0;
                height: 1px;
                background-color: #777;
                content: "";
                transition: width ease-in-out .2s;
            }

            &:hover {
                color: #777;

                &::after {
                    width: 100%;
                }
            }

            &[disabled] {
                opacity: .5;
                cursor: not-allowed;

                &:hover {
                    color: #999;

                    &::after {
                        width: 0;
                    }
                }
            }
        }

        .bt-popover-button-primary {
            display: inline-block;
            margin: 0;
            padding: 8px 16px;
            font-family: $font-family;
            font-weight: 500;
            font-size: 12px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: .5px;
            line-height: (12px * 1.0 * 1.2);
            background-color: #ff4c43;
            border-radius: 3px;
            border: 0;
            cursor: pointer;
            transition: background-color ease-in-out .1s, box-shadow ease-in-out .1s, opacity ease-in-out .1s;

            &:hover {
                background-color: #e5443c;
                box-shadow: 0 2px 5px rgba(#000, .15);
            }

            &[disabled] {
                opacity: .5;
                cursor: not-allowed;

                &:hover {
                    background-color: #ff4c43;
                    box-shadow: none;
                }
            }
        }

        button + button {
            margin-left: 16px !important;
        }
    }
}
</style>
