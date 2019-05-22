import { VantComponent } from '../common/component';
VantComponent({
    classes: ['title-class'],
    props: {
        title: String,
        fixed: Boolean,
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        border: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 1
        }
    },
    methods: {
        onClickLeft() {
            this.$emit('clickLeft');
        },
        onClickRight() {
            this.$emit('clickRight');
        }
    }
});
