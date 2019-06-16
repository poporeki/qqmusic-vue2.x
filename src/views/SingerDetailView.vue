<template>
	<div class="singer-desc-container" v-if="isInit" ref="page_container">
		<common-header-item
			bg-color="transparent"
			fsdngedbg-color="0,0,0,0"
			ref="common_header"
			defaultBackgroundColor="0,0,0,0"
			:has-bg-shadow="false"
			:title="title"
			:newTitle="newTitle"
		></common-header-item>
		<div class="header">
			<div
				:class="{cover:true,transition:setTransition}"
				ref="bg_cover"
				:style="{transform:styleCoverScale,filter:coverBlur}"
			>
				<div class="cover-inner">
					<img
						:src="singerPic"
						onerror="this.src='//y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000'"
						alt
					>
				</div>
			</div>
			<div class="singer-info">
				<div class="s-name">{{singerInfo.singer_info.name}}</div>
			</div>
		</div>
		<div
			:class="{'tab-container':true,transition:setTransition}"
			@touchstart="touchStart"
			@touchmove="touchMove"
			@touchend="touchEnd"
			@touchcancel="touchCancel"
			ref="tab"
		>
			<div class="tab-container-inner">
				<div class="tab-head" @click="backToTop">
					<div class="tab-head-item active">
						<span>歌曲</span>
					</div>
				</div>
				<div class="tab-body">
					<div class="tab-body-item">
						<!-- 歌曲列表 -->
						<song-list-item
							:song-list="songList"
							:isRequest="isRequest"
							@scrollEnd="onListScrollEnd"
							@scrollY="getListScrollY"
							@getMoreSongData="getMoreSongData"
							ref="song_list"
						></song-list-item>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BetterScrollItem from "@/components/common/BetterScroll";
	import SongListItem from "@/components/singer-desc/SongList";
	import CommonHeaderItem from "@/components/common/HeaderItem";

	export default {
		components: { CommonHeaderItem, SongListItem, BetterScrollItem },
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/getsingerinfo",
				singerInfo: {},
				songList: [],
				isInit: false,
				isRequest: false,
				isTouch: false,
				listScrollEndY: 0,
				title: "",
				val_tabTop: 0,
				val_tabHeight: 0,
				val_headerHei: 0,
				val_pageY: 0,
				val_diff: 0,
				val_coverBlur: 0,
				val_coverScale: 1,
				touchEvent: null,
				el_tab: null,
				el_header: null,
				el_songList: null,
				el_container: null,
				el_cover: null,
				newTitle: "",
				page: 1,
				limit: 10,
				listScrollY: 0,
				scrollY: 0,
				isTop: false,
				moveStartY: 0,
				setTransition: false
			};
		},
		methods: {
			/**列表切换到顶部 */
			backToTop() {
				this.isTop = !this.isTop;
				this.setTransition = true;
				this.$nextTick(function() {
					if (this.isTop) {
						this.$refs.song_list.$children[0].enable();

						this.el_tab.style.top = this.val_headerHei + "px";
					} else {
						this.el_tab.style.top = this.initTop + "px";
						this.el_cover.style.filter = "blur(0px)";
						this.$refs.song_list.$children[0].disable();
					}
				});
			},
			/**获取歌手信息 */
			getSingerInfo() {
				if (this.isRequest) return;
				this.isRequest = true;
				let args = arguments[0];
				let that = this;
				let page = (args && args.page) || this.page;
				let params = {
					//歌手mid
					singer_mid: (args && args.mid) || this.singerMid,
					//单页查询数量
					limit: this.limit,
					//跳过数量
					sin: page > 0 ? (page - 1) * this.limit : 0
				};
				this.$axios.get(this.requestUrl, { params }).then(({ data }) => {
					that.isInit = true;
					that.isRequest = false;
					that.page += 1;
					that.singerInfo = data.singer.data;
					that.songList = that.songList.concat(data.singer.data.songlist);
				});
			},
			touchStart(e) {
				let $tab = this.$refs.tab;
				let $header = this.$refs.common_header.$el;
				let $songList = this.$refs.song_list.$el;
				let $cover = this.$refs.bg_cover;

				this.el_tab = $tab;
				this.el_header = $header;
				this.el_songList = $songList;
				this.el_cover = $cover;
				this.setTransition = false;
				this.$refs.song_list.$children[0].disable();
				if (this.val_tabTop === this.val_headerHei) {
					this.$refs.song_list.$children[0].enable();
				} else {
					if (this.listScrollY > 0) {
						this.$refs.song_list.$children[0].disable();
					}
				}
				this.moveStartY = e.changedTouches[0].pageY;
				this.isTouch = true;
			},
			touchMove(e) {
				this.touchEvent = e;
				let $tab = this.$refs.tab;
				let $header = this.$refs.common_header.$el;
				let $songList = this.$refs.song_list.$el;
				let $cover = this.$refs.bg_cover;
				let pageY = e.changedTouches[0].pageY;
				let headerHeight = $header.clientHeight;
				let offsetTop = $tab.offsetTop;
				this.val_tabTop = $tab.offsetTop;
				this.val_tabHeight = $tab.clientHeight;
				this.val_headerHei = $header.clientHeight;
				this.val_pageY = pageY;
				this.val_diff = pageY - this.moveStartY;
			},
			touchEnd() {
				let val_diff = this.val_diff;
				let _hHei = this.val_headerHei;
				let tab_hei = this.val_tabHeight;
				let val_pageY = this.val_pageY;
				let val_tabTop = this.val_tabTop;
				let $tab = this.el_tab;
				let $cover = this.el_cover;
				let $songList = this.el_songList;

				if (val_tabTop >= this.initTop) {
					this.setTransition = true;
					$cover.style.filter = `blur(0px)`;
					$cover.style.transform = "scale(1)";
					// $songList.style.overflowY = "hidden";
					$tab.style.top = this.initTop + "px";
					// $tab.style.height = this.initclientHeight + "px";
				}
				this.isTouch = false;
			},
			touchCancel() {
				let $tab = this.el_tab;
				let $cover = this.el_cover;
				let $songList = this.el_songList;
				this.setTransition = true;

				$cover.style.filter = `blur(0px)`;
				$cover.style.transform = "scale(1)";
				// $songList.style.overflowY = "hidden";
				$tab.style.top = this.initTop + "px";
				// $tab.style.height = this.initclientHeight + "px";

				this.isTouch = false;
			},
			/**向上滚动 */
			onTouchMoveUp() {
				let _hHei = this.val_headerHei;
				let tab_hei = this.val_tabHeight;

				let val_diff = this.val_diff;
				let val_pageY = this.val_pageY;
				let val_tabTop = this.val_tabTop;
				let val_coverBlur = this.val_coverBlur;
				let val_coverScale = this.val_coverScale;

				let $tab = this.el_tab;
				let $songList = this.el_songList;
				let $cover = this.el_cover;
				if (val_tabTop <= _hHei) {
					$tab.style.top = _hHei + "px";
					if (this.title !== this.singerInfo.singer_info.name) {
						this.title = this.singerInfo.singer_info.name;
					}
					this.moveStartY = val_pageY;
					return;
				}
				$tab.style.top = val_tabTop + val_diff + "px";
				this.moveStartY = val_pageY;
			},
			/**向下滚动 */
			onTouchMoveDown() {
				if (this.val_tabTop === this.val_headerHei && this.listScrollEndY !== 0) {
					return;
				}
				if (this.val_tabTop < this.initTop) {
					this.$refs.song_list.$children[0].disable();
				}
				let _hHei = this.val_headerHei;
				let _tabHei = this.val_tabHeight;
				let val_diff = this.val_diff;
				let val_pageY = this.val_pageY;
				let val_tabTop = this.val_tabTop;
				let val_coverBlur = this.val_coverBlur;
				let val_coverScale = this.val_coverScale;

				let $tab = this.el_tab;
				let $songList = this.el_songList;
				let $cover = this.el_cover;
				val_tabTop >= this.initTop && (this.title = "");
				if (
					($songList.style.overflowY === "scroll" && $songList.scrollTop !== 0) ||
					val_tabTop >= this.initTop + 50 ||
					$songList.scrollTop >= $cover.clientHeight ||
					val_tabTop >= $cover.clientHeight
				) {
					this.moveStartY = val_pageY;

					return;
				}
				$tab.style.top = val_tabTop + val_diff + "px";
				this.moveStartY = val_pageY;
			},
			/**获取更多数据 */
			getMoreSongData(val) {
				if (this.isRequest) return;
				this.getSingerInfo({ page: val });
			},
			getStyle(obj, name) {
				if (obj.currentStyle) {
					return obj.currentStyle[name];
				} else {
					return getComputedStyle(obj, false)[name];
				}
			},
			/**获取滚动Y轴数值 */
			getListScrollY(val) {
				this.listScrollY = val;
				console.log(this.listScrollY);
			},
			/**滚动途中 */
			onScroll(pos) {
				this.scrollY = pos.y;
			},
			/**滚动结束 */
			onListScrollEnd(pos) {
				this.listScrollEndY = pos.y;
			}
		},
		watch: {
			/**监听触摸pageY值 */
			val_pageY(val) {
				this.val_diff = val - this.moveStartY;
			},
			/**监听触摸滚动值 */
			val_diff(val) {
				if (val > 0) {
					this.onTouchMoveDown();
				} else if (val < 0) {
					this.onTouchMoveUp();
				}
			},
			singerMid(val) {
				if (!val) return;
				this.getSingerInfo();
			},
			isInit(val) {
				if (val !== true) return;
				this.$nextTick(function() {
					this.initclientHeight = this.$refs.tab.clientHeight;
					this.initTop = this.$refs.tab.offsetTop;
					this.el_container = this.$refs.page_container;
					let $header = this.$refs.common_header.$el;
					this.val_headerHei = $header.clientHeight;
					this.el_container = this.$refs.page_container;
					this.$refs.tab.style.height =
						this.$refs.page_container.clientHeight -
						this.$refs.common_header.$el.clientHeight +
						"px";
				});
			}
		},
		mounted() {},
		created() {
			this.getSingerInfo({ mid: this.$route.params.mid });
		},
		computed: {
			/**背景图transform 属性值 */
			styleCoverScale() {
				return `scale(${this.valCoverScale || 1})`;
			},
			/**背景图scale值 */
			valCoverScale() {
				return (
					this.val_tabTop - this.initTop >= 0 &&
					1 + (this.val_tabTop - this.initTop) / 500
				);
			},
			coverBlur() {
				return `blur(${this.valCoverBlur}px)`;
			},
			/**背景图模糊值 */
			valCoverBlur() {
				return (
					this.val_tabTop - this.initTop <= 0 &&
					0 + Math.abs(this.val_tabTop - this.initTop) / 10
				);
			},
			/**当前播放歌曲的mid */
			playingSongMid() {
				return this.$store.state.playingSongMid;
			},
			/**歌手mid */
			singerMid() {
				return this.$route.params.mid;
			},
			/** 是否存在歌手信息*/
			hasSingerInfo() {
				return this.singerInfo && Object.keys(this.singerInfo).length !== 0;
			},
			/**歌手图片 */
			singerPic() {
				return this.hasSingerInfo
					? `//y.gtimg.cn/music/photo_new/T001R300x300M000${
							this.singerMid
					  }.jpg?max_age=2592000`
					: "";
			}
		}
	};
</script>


<style lang="scss">
	.singer-desc-container {
		position: relative;
		color: #000;
		height: 100vh;
		width: 100%;
		background-color: $base-bg-color;
		overflow: hidden;
		.header {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			.singer-info {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #fff;
				.s-name {
					font-size: 1.5em;
				}
			}
			.cover {
				position: relative;
				.cover-inner {
					position: relative;
					overflow: hidden;
					transform: scale(1.2);
					> img {
						display: block;
						width: 100%;
						object-fit: cover;
					}
				}
				&.transition {
					transition: transform 0.3s ease;
				}
			}
		}
		.tab-container {
			position: absolute;
			display: flex;
			top: 40%;
			height: 60%;
			width: 100%;
			flex-direction: column;
			&.transition {
				transition: transform 0.3s, height 0.3s, top 0.3s;
			}
			.tab-container-inner {
				position: relative;
				display: flex;
				flex-direction: column;
				flex-grow: 1;
				height: 100%;
			}
			.tab-head {
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.048);
				padding: 1rem;
				background-color: $bg-color;
				z-index: 2;
				.tab-head-item {
					&.active {
						color: $music-color;
						font-weight: bold;
					}
				}
			}
			.tab-body {
				flex-grow: 1;
				position: relative;
				background-color: $base-bg-color;
				overflow: hidden;
				height: 100%;
				z-index: 1;
				.tab-body-item {
					height: 100%;
					position: relative;
				}
			}
		}
	}
</style>


