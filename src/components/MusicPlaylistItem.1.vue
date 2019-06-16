<template>
	<transition enter-active-class="ani fade-in" leave-active-class="ani fade-out">
		<div class="play-song-list-container" v-show="isShow" @touchmove.stop>
			<transition enter-active-class="ani fade-in" leave-active-class="ani fade-out">
				<div
					class="mask"
					@click="$store.commit('changePlaySongListDisplayStatus',false)"
					v-show="isShow"
				></div>
			</transition>
			<transition enter-active-class="ani move-in-bottom" leave-active-class="ani move-out-bottom">
				<div class="inner" v-show="isShow">
					<div class="head" @click="switchPlayerMode">
						<i :class="switchModeStyle"></i>
						{{modeText()}}
					</div>
					<div class="song-list" @scroll.stop>
						<div
							:class="{'song-list-item':true,play:isPlaying(song.songMid)}"
							v-for="(song,sidx) in songList"
							:key="sidx"
							@click="playThis(song)"
						>
							<div class="s-info">
								<span class="name">{{song.songName}}</span>-
								<span class="singer">
									<template v-for="singer in song.singerArr">{{singer.name}}</template>
								</span>
								<i class="iconfont icon-Sound-wave" v-show="isPlaying(song.songMid)"></i>
							</div>
							<div class="s-control">
								<div class="btn-del" @click.stop="reduceSongList(sidx)">
									<i class="iconfont icon-delete"></i>
								</div>
							</div>
						</div>
					</div>
					<div class="btn-close" @click="$store.commit('changePlaySongListDisplayStatus',false)">关闭</div>
				</div>
			</transition>
		</div>
	</transition>
</template>


<script>
	import BetterScrollItem from "@/components/common/BetterScroll";

	import { mapState } from "vuex";
	export default {
		components: { BetterScrollItem },
		computed: {
			...mapState({
				songList: "playSongList",
				isShow: "isShowPlaySongList",
				nowPlayMid: "playingSongmid",
				playMode: "songPlayMode"
			}),

			switchModeStyle() {
				return {
					iconfont: true,
					"icon-single": this.playMode === 1,
					"icon-order": this.playMode === 2,
					"icon-random": this.playMode === 3,
					"icon-list": this.playMode === 4
				};
			}
		},
		watch: {
			isShow(val) {
				if (val) {
					document.querySelector("body").style.overflow = "hidden";
				} else {
					document.querySelector("body").style.overflow = "visible";
				}
			}
		},
		methods: {
			modeText() {
				let pMode = this.playMode;
				let songLen = this.songList.length;
				let text = "";
				switch (pMode) {
					case 1:
						text = `单曲循环`;
						break;
					case 2:
						text = `顺序播放(${songLen})首`;
						break;
					case 3:
						text = `随机播放(${songLen})首`;
						break;
					case 4:
						text = `循环播放(${songLen})首`;
						break;
				}
				return text;
			},
			switchPlayerMode() {
				return this.$store.commit("switchMusicPlayerPlayMode");
			},
			playThis(song) {
				this.$store.commit("updatePlayingSongmid", song.songMid);
				this.$store.commit("formatPlayingSongInfo", song);
			},

			isPlaying(songmid) {
				return songmid === this.nowPlayMid;
			},
			reduceSongList(idx) {
				return this.$store.commit("reduceSongList", idx);
			}
		}
	};
</script>

<style lang="scss">
	$borderColor: rgb(224, 224, 224);
	.play-song-list-container {
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100vh;
		width: 100%;

		color: #000;
		z-index: 1002;
		.inner {
			display: flex;
			flex-direction: column;
			position: absolute;
			height: 70%;
			width: 100%;
			bottom: 0;
			background-color: #fff;
			.head {
				padding: 1rem;
				border-bottom: 1px solid $borderColor;
			}
			.btn-close {
				border-top: 1px solid $borderColor;
				padding: 1rem;
				text-align: center;
			}
		}
		.mask {
			position: absolute;
			height: 100%;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.192);
			z-index: -1;
			top: 0;
			left: 0;
		}
		.song-list {
			position: relative;
			height: 100%;
			overflow-y: auto;
			.song-list-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 1rem;
				border-bottom: 1px solid $borderColor;
				&.play {
					color: $music-color;
					.singer {
						color: $music-color !important;
					}
				}
			}
			.s-info {
				.name {
					font-size: 0.9rem;
				}
				.singer {
					font-size: 0.8rem;
					color: rgb(148, 148, 148);
				}
				.iconfont {
					padding-left: 0.8rem;
				}
			}
		}
	}
</style>
