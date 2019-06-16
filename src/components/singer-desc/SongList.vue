<template>
	<better-scroll-item
		class="song-list"
		:listenScroll="true"
		@scroll="onScroll"
		:scrollEnd="true"
		@scrollEnd="onListScrollEnd"
		:pullup="true"
		@scrollToEnd="scrollToEnd"
		v-if="songList&&songList.length!==0"
		ref="song_list"
	>
		<!-- 歌曲列表 -->
		<div class="song-list-inner">
			<div
				:class="{'list-item':true, 'disabled':s.pay.pay_play!==0||s.mid==='','playing':s.mid!==''&&s.mid===playingSongMid}"
				v-for="(s,sidx) in songList"
				:key="sidx"
				@click="playThis(s)"
			>
				<div class="lt">
					<div class="s-name">
						{{s.title}}
						<span @click.stop="updateMVInfo(s)" class="icon-mv" v-show="s.mv&&s.mv.vid!==''">
							<span>MV</span>
						</span>
					</div>
					<div class="s-desc">
						<template v-for="singer in s.singer">{{ singer.name }}</template>
						-
						{{s.album.name}}
					</div>
				</div>
				<div class="rt">
					<div @click.stop>
						<i class="iconfont icon-download"></i>
					</div>
				</div>
			</div>
			<request-loading-item v-show="isRequest"></request-loading-item>
		</div>
	</better-scroll-item>
</template>



<script>
	import RequestLoadingItem from "@/components/common/RequestLoading_List";
	import MyScrollItem from "@/components/common/MyScrollItem";
	import BetterScrollItem from "@/components/common/BetterScroll";
	export default {
		components: { RequestLoadingItem, MyScrollItem, BetterScrollItem },
		props: {
			/**
			 * 歌曲列表
			 */
			songList: {
				type: Array
			},
			/**
			 * 请求状态
			 */
			isRequest: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				nowScrollY: 0
			};
		},
		methods: {
			onScroll(pos) {
				console.log(pos);
				this.$emit("scrollY", pos.y);
				console.log(this.$refs.song_list.y);
			},
			/**跳转MV界面 */
			updateMVInfo(mvobj) {
				this.$store.commit("updateMVInfo", mvobj);
				this.$router.push({ path: "/mv/" + mvobj.mv.vid });
			},
			/**播放 */
			playThis(info) {
				if (info.pay && info.pay.pay_play !== 0) return;
				let obj = {
					songName: info.name,
					songMid: info.mid,
					albumName: info.album.name,
					albumMid: info.album.mid,
					singerArr: info.singer,
					albumId: info.album.id,

					albumPic: `//y.gtimg.cn/music/photo_new/T002R300x300M000${
						info.album.mid ? info.album.mid : info.mid
					}.jpg?max_age=2592000`
				};
				this.$store.commit("updatePlayingSongInfo", info);
				this.$store.commit("formatPlayingSongInfo", obj);
			},
			onListScrollEnd(pos) {
				this.$emit("scrollEnd", pos);
			},
			scrollToEnd() {
				this.$emit("getMoreSongData");
			}
		},
		computed: {
			playingSongMid() {
				return this.$store.state.playingSongmid;
			}
		},
		mounted() {}
	};
</script>


<style lang="scss" scoped>
	.song-list {
		position: relative;
		height: 100%;
		.song-list-inner {
			position: relative;
			padding-bottom: 6rem;
		}
		.list-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding: 1rem;

			&.playing {
				color: $music-color;
				border-left: 1px solid $music-color;
			}
			&.disabled {
				color: gray;
				background-color: $disabled-color;
				border-left: 1px solid rgb(168, 168, 168);
			}
			&:hover {
				background-color: rgba(0, 0, 0, 0.041);
			}
			.lt {
				flex-grow: 1;
			}
			.rt {
				display: flex;
				align-items: center;
				.iconfont {
					font-size: 1rem;
				}
			}
			.s-name {
				font-size: 1rem;
				display: flex;
				align-items: center;
			}
			.s-desc {
				font-size: 0.9rem;
				color: gray;
			}
		}
	}
</style>
