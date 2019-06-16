<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from "better-scroll";

	export default {
		props: {
			/**
			 * 1 滚动的时候会派发scroll事件，会截流。
			 * 2 滚动的时候实时派发scroll事件，不会截流。
			 * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
			 */
			probeType: {
				type: Number,
				default: 1
			},
			bounce: {
				type: Boolean,
				default: true
			},
			/**
			 * 点击列表是否派发click事件
			 */
			click: {
				type: Boolean,
				default: true
			},
			startY: {
				type: Number,
				default: 0
			},
			/**
			 * 回弹时间
			 */
			bounceTime: {
				type: [Number, String],
				default: 300
			},
			/**
			 * 是否开启横向滚动
			 */
			scrollX: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否派发滚动事件
			 */
			listenScroll: {
				type: Boolean,
				default: false
			},
			/**
			 * 列表的数据
			 */
			data: {
				type: Array,
				default: null
			},
			/**
			 * 是否派发滚动結束的事件
			 */
			scrollEnd: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否派发手指抬起的事件
			 */
			touchEnd: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否派发滚动到底部的事件，用于上拉加载
			 */
			pullup: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否派发顶部下拉的事件，用于下拉刷新
			 */
			pulldown: {
				type: Boolean,
				default: false
			},
			stopPropagation: {
				type: Boolean,
				default: false
			},
			/**
			 * 是否派发列表滚动开始的事件
			 */
			beforeScroll: {
				type: Boolean,
				default: false
			},
			/**
			 * 当数据更新后，刷新scroll的延时。
			 */
			refreshDelay: {
				type: Number,
				default: 20
			}
		},
		mounted() {
			// 保证在DOM渲染完毕后初始化better-scroll
			setTimeout(() => {
				this._initScroll();
			}, 20);
		},
		methods: {
			_initScroll() {
				if (!this.$refs.wrapper) {
					return;
				}
				// better-scroll的初始化
				this.scroll = new BScroll(this.$refs.wrapper, {
					eventPassthrough: "horizontal",
					probeType: this.probeType,
					click: this.click,
					bounce: this.bounce,
					scrollX: this.scrollX,
					startY: this.startY,
					bounceTime: this.bounceTime,
					stopPropagation: this.stopPropagation
				});

				// 是否派发滚动事件
				if (this.listenScroll) {
					this.scroll.on("scroll", pos => {
						this.$emit("scroll", pos);
					});
				}
				// 是否派发手指抬起事件
				if (this.touchEnd) {
					this.scroll.on("touchEnd", pos => {
						this.$emit("touchEnd", pos);
					});
				}
				// 是否派发滚动结束事件
				if (this.scrollEnd) {
					this.scroll.on("scrollEnd", pos => {
						this.$emit("scrollEnd", pos);
					});
				}
				// 是否派发滚动到底部事件，用于上拉加载
				if (this.pullup) {
					this.scroll.on("scrollEnd", () => {
						// 滚动到底部
						if (this.scroll.y <= this.scroll.maxScrollY + 50) {
							this.$emit("scrollToEnd");
						}
					});
				}

				// 是否派发顶部下拉事件，用于下拉刷新
				if (this.pulldown) {
					this.scroll.on("touchend", pos => {
						// 下拉动作
						if (pos.y > 50) {
							this.$emit("pulldown");
						}
					});
				}

				// 是否派发列表滚动开始的事件
				if (this.beforeScroll) {
					this.scroll.on("beforeScrollStart", () => {
						console.log("before");
						this.$emit("beforeScroll");
					});
				}
			},
			stop() {
				this.scroll && this.scroll.stop();
			},
			destroy() {
				this.scroll && this.scroll.destroy();
			},
			disable() {
				// 代理better-scroll的disable方法
				this.scroll && this.scroll.disable();
			},
			enable() {
				// 代理better-scroll的enable方法
				this.scroll && this.scroll.enable();
			},
			refresh() {
				// 代理better-scroll的refresh方法
				this.scroll && this.scroll.refresh();
			},

			scrollTo() {
				// 代理better-scroll的scrollTo方法
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
			},
			scrollToElement() {
				// 代理better-scroll的scrollToElement方法
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
			}
		},
		computed: {
			y() {
				this.scroll && this.scroll.y;
			},
			directionY() {
				return this.scroll && this.scroll.directionY;
			},
			movingDirectionY() {
				return this.scroll && this.scroll.movingDirectionY;
			},
			isInTransition() {
				return this.scroll && this.scroll.isInTransition;
			}
		},
		watch: {
			// 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
			data() {
				setTimeout(() => {
					this.refresh();
				}, this.refreshDelay);
			}
		}
	};
</script>