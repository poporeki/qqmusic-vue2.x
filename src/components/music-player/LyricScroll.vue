<template>
	<!-- 歌词页 -->
	<div class="lyric-scroll-container">
		<!-- 歌词不存在 -->
		<div class="no-lyric-text" v-if="!lyricData">当前歌曲没有歌词</div>
		<!-- 不存在格式化歌词 -->
		<div
			class="no-lyric-text"
			style="textAlign:center;"
			v-if="Object.keys(currentLyric).length!==0&&currentLyric.lines.length===0"
		>{{currentLyric.lrc}}</div>
		<!-- 格式化歌词 -->
		<better-scroll-item
			class="lyric-scroll"
			:click="false"
			:data="currentLyric.lines"
			:listenScroll="true"
			:bounce="false"
			@scroll="onScroll"
			:probeType="1"
			ref="lyric_scroll"
			v-if="Object.keys(currentLyric).length!==0&&currentLyric.lines.length!==0"
		>
			<div
				class="lyric-scroll-inner"
				ref="scroll_list"
				@mousedown="setLyricFocus(true)"
				@mouseup="setLyricFocus(false)"
				@touchstart="setLyricFocus(true)"
				@touchend="setLyricFocus(false)"
			>
				<p
					:class="{current:lineCurrent(lidx)}"
					v-for="(line,lidx) in currentLyric.lines"
					:key="lidx"
				>{{line.txt}}</p>
			</div>
		</better-scroll-item>
	</div>
</template>


<script>
	import { Base64 } from "js-base64";
	import Lyric from "lyric-parser";
	import BetterScrollItem from "@/components/common/BetterScroll";
	export default {
		components: { BetterScrollItem },
		props: {
			songmid: {
				type: String,
				default: null
			},
			isShow: {
				type: Boolean,
				default: false
			},
			playTime: {
				type: Number,
				default: NaN
			},
			play: {
				type: Boolean,
				default: false
			},
			stop: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				scrollY: 0,
				scrollHeight: 0,
				initscrollWrapHeight: 0,
				scrollDiv: {},
				lyric: "",
				lyricData: "",
				currentLyric: {},
				hasAutoScroll: false,
				lyricIsInit: false,
				isLyricOnFocus: false,
				tagP: {},
				timer: null,
				lyricNowLine: undefined,
				lyricRequestUrl: "/api/v1/qqmusic/getsonglyric"
			};
		},
		methods: {
			/**重置 */
			reset() {
				this.lyric = "";
				this.lyricData = "";
				this.$store.commit("updatePlayingSongNowLyricLine", "...");
				Object.keys(this.currentLyric).length !== 0 && this.currentLyric.stop();
				this.deleteObj(this.currentLyric);
				this.deleteObj(this.tagP);
				this.lyricNowLine = 0;
			},
			/**删除对象 */
			deleteObj(obj) {
				if (Object.keys(obj).length !== 0) {
					for (var key in obj) {
						delete obj[key];
					}
				}
			},
			/**获取歌词 */
			getSongLyric() {
				let that = this;
				let params = {
					song_mid: this.songmid
				};
				this.$axios.get(this.lyricRequestUrl, { params }).then(({ data }) => {
					if (data.code !== 0) {
						that.lyricData = null;
						return;
					}
					that.lyricData = data.lyric;
					that.lyric = Base64.decode(data.lyric);

					that.currentLyric = new Lyric(that.lyric, that.handlerLyric);
					if (that.currentLyric.lines.length !== 0) {
						that.hasAutoScroll = true;
					} else {
						that.hasAutoScroll = false;
					}
					that.$nextTick(function() {
						if (this.currentLyric.lines.length === 0) return;
						that.scrollDiv = that.$refs.lyric_scroll;
						let scrollInner = document.querySelector(".lyric-scroll-inner");
						that.tagP = scrollInner.querySelectorAll("p");
						this.scrollHeight = this.$refs.scroll_list.clientHeight;
						this.initscrollWrapHeight = this.$refs.lyric_scroll.$el.clientHeight;
					});
					that.lyricIsInit = true;
				});
			},
			/**获取内联样式 */
			getStyle(obj, attr) {
				if (obj.currentStyle) {
					return obj.currentStyle[attr];
				} else {
					return document.defaultView.getComputedStyle(obj, null)[attr];
				}
			},
			/**自动滚动 */
			autoScroll() {
				if (this.isLyricOnFocus || this.hasAutoScroll !== true || !this.lyricData)
					return;
				let scrollHei = this.$refs.lyric_scroll.$el.clientHeight;
				let idx = this.lyricNowLine.lineNum || 0;
				let p = this.tagP[idx];
				let pOffsetTop = this.tagP[idx].offsetTop;
				let isInTransition = this.scrollDiv.isInTransition;
				if (pOffsetTop >= scrollHei / 2 && !isInTransition) {
					this.scrollDiv.scrollToElement(p, 100, 0, -scrollHei / 2);
				}
			},
			/**Lyric回调 */
			handlerLyric(e) {
				if (!this.songIsPlaying) {
					this.currentLyric.stop();
					return;
				}
				this.lyricNowLine = e;
				if (this.isShow) {
					this.autoScroll();
				}
				if (this.currentLyric) {
				}
			},
			lineCurrent(idx) {
				return this.lyricNowLine && idx === this.lyricNowLine.lineNum;
			},
			/**歌词滚动时 */
			onScroll(pos) {
				this.scrollY = pos.y;
			},
			/**触摸歌词时 禁用自动滚动 */
			setLyricFocus(val) {
				if (val) {
					this.isLyricOnFocus = true;
					clearTimeout(this.timer);
					this.timer = null;
					return;
				}
				this.timer = setTimeout(() => {
					this.isLyricOnFocus = false;
				}, 1000);
			}
		},
		watch: {
			/**监听歌曲mid是否变动 */
			playingSongMid(val) {
				this.reset();
				this.getSongLyric(val);
			},
			/**当前歌词 */
			lyricNowLine(val, oldVal) {
				if (val === 0 || val.txt === oldVal.txt) return;
				this.$store.commit("updatePlayingSongNowLyricLine", val);
			},
			/**是否显示 */
			isShow(val) {
				if (!val) return;
				this.$nextTick(function() {
					this.autoScroll();
				});
			},
			playTime(val) {
				this.currentLyric instanceof Object &&
					Object.keys(this.currentLyric).length !== 0 &&
					this.currentLyric.seek(this.playTime * 1000 || 0);
			}
		},
		computed: {
			/**当前播放歌曲的mid */
			playingSongMid() {
				return this.$store.state.playingSongmid;
			},
			/**歌曲播放状态 */
			songIsPlaying() {
				return this.$store.state.songPlayed;
			}
		}
	};
</script>

<style lang="scss">
	.lyric-scroll-container {
		position: relative;
		overflow: hidden;
		.no-lyric-text {
			position: absolute;
			width: 100%;
			padding: 1rem;
			left: 50%;
			top: 50%;
			text-align: center;
			transform: translate(-50%, -50%);
		}
	}
	.lyric-scroll {
		position: relative;
		height: 100%;
		transition: all 0.3s ease;
	}
	.lyric-scroll-inner {
		position: relative;
		padding: 0 1rem;
		padding-bottom: 50vh;
		p {
			margin: 0;
			padding: 0;
		}
	}
</style>

