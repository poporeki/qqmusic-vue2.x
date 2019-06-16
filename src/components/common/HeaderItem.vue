<template>
	<div
		class="header-container"
		:style="{'background-color':backgroundColor,position: pos,color:'rgba('+tColor+')','box-shadow':bgShadow}"
	>
		<div class="btn-back" @click="goBack">
			<i class="iconfont icon-arrowsleftline"></i>
		</div>
		<div class="title">
			<span style="opacity:0">{{pageTitle}}</span>

			<div class="title-text">
				<transition enter-active-class="ani fade-in-right" leave-active-class="ani fade-out-right">
					<div v-if="pageTitle!==''">{{pageTitle}}</div>
				</transition>
			</div>

			<div class="title-text">
				<transition enter-active-class="ani fade-in-right" leave-active-class="ani fade-out-right">
					<div v-if="oldPageTitle!==''">{{oldPageTitle}}</div>
				</transition>
			</div>
		</div>
		<div class="other"></div>
	</div>
</template>

<script>
	import "@/utils/mouseWheel";
	export default {
		props: {
			/**
			 * 标题 默认route.meta.title
			 */
			title: {
				type: String,
				default() {
					return this.$route.meta.title;
				}
			},
			/**
			 * 滚动改变背景色
			 */
			scrollChangeBg: {
				type: Boolean,
				default: false
			},
			/**当前滚动y值 */
			scrollY: {
				type: Number,
				default: 0
			},
			/**滚动高度 */
			scrollHeight: {
				type: Number,
				default: 200
			},
			/**改变后的背景色 */
			changedBackgroundColor: {
				type: String,
				default: "255,255,255,1"
			},
			/**是否存在阴影 */
			hasBgShadow: {
				type: Boolean,
				default: true
			},
			/**默认背景色 */
			defaultBackgroundColor: {
				type: String,
				default: "255,255,255,1"
			},
			hasBoxShadow: {
				type: Boolean,
				default: true
			},
			titleColor: {
				type: String,
				default: "255,255,255,1"
			},
			changeTitleColor: {
				type: Boolean,
				default: false
			},
			changedTitleColor: {
				type: String,
				default: "0,0,0,1"
			},
			shadowAlpha: {
				type: [String, Number],
				default: 0.2
			},
			pos: {
				type: String,
				default: "fixed",
				validator: function(value) {
					// 这个值必须匹配下列字符串中的一个
					return (
						["absolute", "fixed", "relative", "static", "sticky"].indexOf(
							value
						) !== -1
					);
				}
			}
		},
		data() {
			return {
				pageTitle: "",
				oldPageTitle: "",
				r: 0,
				g: 0,
				b: 0,
				backgroundColorObj: {
					r: 255,
					g: 255,
					b: 255,
					a: 1
				},
				changedBackgrondColor: {
					r: 255,
					g: 255,
					b: 255,
					a: 1
				},
				textColor: {
					r: 0,
					g: 0,
					b: 0,
					a: 1
				},
				tColor: ""
			};
		},
		methods: {
			init() {
				if (this.scrollChangeBg) {
					let bgColorRGBA = this.getColorRGBA(
						this.colorRgba(this.changedBackgroundColor)
					);
					Object.keys(this.backgroundColorObj).map((val, key) => {
						this.backgroundColorObj[val] = bgColorRGBA[val];
					});
					this.backgroundColorObj.a = 0;
				} else {
					let bgColorRGBA = this.getColorRGBA(
						this.colorRgba(this.defaultBackgroundColor)
					);
					Object.keys(this.backgroundColorObj).map((val, key) => {
						this.backgroundColorObj[val] = bgColorRGBA[val];
					});
				}
			},
			getColorRGBA(color) {
				let split = color.split(",");
				if (split.length === 0) return null;
				if (split.length == 3) {
					return {
						r: split[0],
						g: split[1],
						b: split[2],
						a: 1
					};
				}
				if (split.length == 4) {
					return {
						r: split[0],
						g: split[1],
						b: split[2],
						a: split[3]
					};
				}
			},
			goBack() {
				this.$router.go(-1);
			},
			colorRgba(sHex, alpha = 1) {
				// 十六进制颜色值的正则表达式
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				/* 16进制颜色转为RGB格式 */
				let sColor = sHex.toLowerCase();
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = "#";
						for (let i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
						}
						sColor = sColorNew;
					}
					//  处理六位的颜色值
					var sColorChange = [];
					for (let i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
					}
					// return sColorChange.join(',')
					// 或
					return sColorChange.join(",") + "," + alpha;
				} else {
					return sColor;
				}
			}
		},
		mounted() {
			this.pageTitle = this.$route.meta.title;
			this.tColor = this.colorRgba(this.titleColor);
		},
		created() {
			this.init();
		},
		watch: {
			/**监听滚动值 */
			scrollY(val) {
				if (this.scrollChangeBg) {
					if (val > 0) return;
					this.tColor = this.titleColor;
					if (this.changeTitleColor && this.backgroundColorObj.a === 1) {
						this.tColor = this.changedTitleColor;
					}
					let incNum = -(val / this.scrollHeight).toFixed(3);
					this.backgroundColorObj.a = 0 + incNum > 1 ? 1 : 0 + incNum;
				}
			},
			/**标题 */
			title(val, oldVal) {
				if (val === "") {
					this.pageTitle = val;
					this.oldPageTitle = this.$route.meta.title;
				} else {
					this.pageTitle = val;
					this.oldPageTitle = oldVal;
				}
			},
			/**标题色 */
			titleColor(val) {
				if (val.indexOf("#") !== -1) {
					this.tColor = colorRgba(val);
					return;
				}
				this.tColor = val;
			}
		},
		computed: {
			/**背景色 */
			backgroundColor() {
				return `rgba(${this.backgroundColorObj.r},${this.backgroundColorObj.g},${
					this.backgroundColorObj.b
				},${this.backgroundColorObj.a > 1 ? 1 : this.backgroundColorObj.a})`;
			},
			/**背景阴影 */
			bgShadow() {
				return this.hasBoxShadow && `0 0 10px rgba(0,0,0,${this.bgShadowAlpha})`;
			},
			bgShadowAlpha() {
				return this.hasBgShadow
					? this.scrollChangeBg
						? this.backgroundColorObj.a < 0.3 && this.backgroundColorObj.a
						: this.shadowAlpha
					: 0;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.header-container {
		display: flex;
		width: 100%;
		top: 0;
		left: 0;
		padding: 0.8rem 1rem;
		font-size: 1.1rem;
		flex-direction: row;
		align-content: stretch;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		transition: color 0.3s ease;
		z-index: 101;
		.btn-back {
			display: flex;
			align-items: center;
			.iconfont {
				font-size: 1em;
			}
		}
		.title {
			display: flex;
			align-items: center;
			position: relative;
			min-width: 100px;
			height: 1rem;
			.title-text {
				position: absolute;
				width: 100%;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				text-align: center;
			}
		}
	}
</style>


