<template>
	<div class="page-container" ref="page_container">
		<common-header
			:has-bg-shadow="false"
			defaultBackgroundColor="0,0,0,0"
			ref="common_header"
			:title="title"
			:newTitle="newTitle"
		></common-header>

		<div class="header">
			<div
				:class="{cover:true,transition:setTransition}"
				ref="bg_cover"
				:style="{transform:styleCoverScale,filter:coverBlur}"
			>
				<div class="inner">
					<img
						:src="coverImage"
						onerror="this.src='//y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000'"
						alt
					>
				</div>
			</div>
			<div class="singer-info">
				<!-- <div class="s-name">{{singerInfo.singer_info.name}}</div> -->
			</div>
		</div>
		<div
			:class="{'tab-container':true,transition:setTransition}"
			ref="tab"
			@touchstart.stop="touchStart"
			@touchmove.stop="touchMove"
			@touchend.stop="touchEnd"
			@touchcancel="touchCancel"
		>
			<div class="tab-head" @click="backToTop">
				<div class="tab-head-item active">
					<span>歌曲</span>
				</div>
			</div>
			<div class="tab-body">
				<div class="tab-body-item">
					<!-- 歌曲列表 -->
					<song-list-item :song-list="songList" :is-request="isRequest" ref="song_list"></song-list-item>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	var coverAni, tabAni;
	import Vue from "vue";
	import songListItem from "@/components/toplist/ToplistSongList";
	import commonHeader from "@/components/common/HeaderItem";
	import _debounce from "@/utils/_debounce";

	export default {
		components: { commonHeader, songListItem },
		props: {
			isRequest: {
				type: Boolean,
				default: false
			},
			/**数据列表 */
			dataList: {
				type: Object,
				default() {
					return {};
				}
			},
			songList: {
				type: Array,
				default() {
					return [];
				}
			},
			noMore: {
				type: Boolean,
				default: false
			},
			/**背景图片 */
			coverImage: {
				type: String,
				default: ""
			}
		},
		data() {
			return {
				itemInfo: {},
				isInit: false,
				isTouch: false,
				title: "",
				newTitle: "",
				page: 1,
				limit: 10,
				val_tabTop: 0,
				val_tabHeight: 0,
				val_headerHei: 0,
				val_pageY: 0,
				val_diff: 0,
				val_coverBlur: 0,
				val_coverScale: 1,
				moveStartY: 0,
				moveLastY: 0,
				moveEndY: 0,
				touchEvent: null,
				el_container: null,
				el_tab: null,
				el_header: null,
				el_songList: null,
				el_cover: null,
				setTransition: false,
				eleAniArr: [],
				eleAniObj: {}
			};
		},
		methods: {
			backToTop() {
				this.isTop = !this.isTop;
				this.setTransition = true;
				this.$nextTick(function() {
					if (this.isTop) {
						this.el_tab.style.top = this.val_headerHei + "px";
						this.el_tab.style.height =
							this.el_container.clientHeight - this.val_headerHei + "px";
					} else {
						this.el_tab.style.top = this.initTop + "px";
						this.el_tab.style.height = this.initclientHeight + "px";
						this.el_cover.style.filter = blur("0px");
					}
				});
			},
			/**触摸开始 */
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
				// this.setTransition(false);

				this.moveStartY = e.changedTouches[0].pageY;
				this.isTouch = true;
			},
			/**触摸移动 */
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
				if (
					this.val_tabTop >= this.val_headerHei &&
					$songList.style.overflowY !== "scroll"
				) {
					this.touchEvent.preventDefault();
				}
			},
			/**触摸结束 */
			touchEnd() {
				let val_diff = this.val_diff;
				let _hHei = this.val_headerHei;
				let tab_hei = this.val_tabHeight;
				let val_pageY = this.val_pageY;
				let val_tabTop = this.val_tabTop;
				let $tab = this.el_tab;
				let $cover = this.el_cover;
				let $songList = this.el_songList;
				if (this.val_diff >= 0 && val_tabTop >= this.initTop) {
					this.setTransition = true;

					// this.setTransition(true);
					$cover.style.filter = `blur(0px)`;
					$cover.style.transform = "scale(1)";
					$songList.style.overflowY = "hidden";
					$tab.style.top = this.initTop + "px";
					$tab.style.height = this.initclientHeight + "px";
				}
				this.isTouch = false;
			},
			touchCancel() {
				let $tab = this.el_tab;
				let $cover = this.el_cover;
				let $songList = this.el_songList;
				this.setTransition = true;

				// this.setTransition(true);

				$cover.style.filter = `blur(0px)`;
				$cover.style.transform = "scale(1)";
				$songList.style.overflowY = "hidden";
				$tab.style.top = this.initTop + "px";
				$tab.style.height = this.initclientHeight + "px";

				this.isTouch = false;
			},
			getMoreListData() {},
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
				// this.moveStartY = val_pageY;
				if (val_tabTop <= _hHei) {
					if ($songList.style.overflowY !== "scroll") {
						$songList.style.overflowY = "scroll";
					}
					$tab.style.top = _hHei + "px";
					if (this.title !== this.dataList.titleShare) {
						this.title = this.dataList.titleShare;
					}
					this.moveStartY = val_pageY;
					return;
				}
				$songList.style.overflowY = "hidden";

				$tab.style.top = val_tabTop + val_diff + "px";

				$tab.style.height = tab_hei + -val_diff + "px";
				this.moveStartY = val_pageY;
			},
			onTouchMoveDown() {
				console.log("down");

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

				$songList.style.overflowY = "hidden";
				$tab.style.height = _tabHei + -val_diff + "px";
				$tab.style.top = val_tabTop + val_diff + "px";
				this.moveStartY = val_pageY;
			}
		},
		watch: {
			val_pageY(val) {
				this.val_diff = val - this.moveStartY;
			},
			val_diff(val) {
				if (val > 0) {
					this.onTouchMoveDown();
				} else if (val < 0) {
					this.onTouchMoveUp();
				}
			}
		},
		computed: {
			styleCoverScale() {
				return `scale(${this.valCoverScale || 1})`;
			},

			valCoverScale() {
				return (
					this.val_tabTop - this.initTop >= 0 &&
					1 + (this.val_tabTop - this.initTop) / 500
				);
			},
			coverBlur() {
				return `blur(${this.valCoverBlur}px)`;
			},
			valCoverBlur() {
				return (
					this.val_tabTop - this.initTop <= 0 &&
					0 + Math.abs(this.val_tabTop - this.initTop) / 10
				);
			}
		},
		created() {
			this.$nextTick(function() {
				let tab = this.$refs.tab;
				this.initclientHeight = tab.clientHeight;
				this.initTop = tab.offsetTop;
				let $header = this.$refs.common_header.$el;
				this.val_headerHei = $header.clientHeight;
				this.el_container = this.$refs.page_container;
			});
		}
	};
</script>



<style lang="scss">
	.page-container {
		position: fixed;
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
				&.transition {
					transition: transform 0.3s ease;
				}
				> .inner {
					position: relative;
					width: 100%;
					transform: scale(1.2) translateY(-10%);
					> img {
						display: block;
						width: 100%;
						object-fit: cover;
					}
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
			background-color: inherit;
			&.transition {
				transition: transform 0.3s, height 0.3s, top 0.3s;
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
				z-index: 1;
				.tab-body-item {
					height: 100%;
					position: relative;
				}
			}
		}
	}
</style>