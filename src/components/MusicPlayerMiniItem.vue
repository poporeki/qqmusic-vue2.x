<template>
	<transition enter-active-class="ani move-in-bottom">
		<div class="mini-player-container" @click="showPlayer" v-show="isShow">
			<div class="music-info-box">
				<div class="song-info-cover">
					<img
						:src="albumPic"
						onerror="this.src='//y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'"
						alt
					>
				</div>
				<div class="song-info-name">
					<p>
						{{songName}}
						-
						<template v-for="s in singer">{{s.name+' '}}</template>
					</p>
				</div>
			</div>
			<div class="tools-box">
				<div class="btn play" @click.stop="switchPlay">
					<i class="iconfont icon-play-copy" v-if="!isPlayed"></i>
					<i class="iconfont icon-pause" v-if="isPlayed"></i>
				</div>
				<div class="btn" @click.stop="$store.commit('changePlaySongListDisplayStatus',true)">
					<div class="iconfont icon-media-list"></div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			showPlayer() {
				return this.$store.commit("changeMusicPlayerDisplayStatus", true);
			},
			switchPlay() {
				return this.$store.commit("switchPlay");
			}
		},
		computed: {
			songInfo() {
				return this.$store.state.formattedSongInfo;
			},
			hasSongInfo() {
				return this.songInfo && Object.keys(this.songInfo).length !== 0;
			},
			songName() {
				return this.hasSongInfo && this.songInfo.songName;
			},
			singer() {
				return this.hasSongInfo && this.songInfo.singerArr;
			},
			albumId() {
				return this.hasSongInfo && this.songInfo.albumId;
			},
			albumPic() {
				return this.hasSongInfo && this.songInfo.albumPic;
			},
			isShow() {
				return this.$store.state.playingSongmid === "" ? false : true;
			},
			isPlayed() {
				return this.$store.state.songPlayed;
			}
		}
	};
</script>


<style lang="scss">
	.mini-player-container {
		display: flex;
		flex-direction: row;
		padding: 0.3rem 0 0.3rem 1rem;
		background-color: $bg-color;
		box-sizing: border-box;
		box-shadow: 0 -2px 100px rgba(0, 0, 0, 0.233);
		.music-info-box {
			position: relative;
			display: flex;
			flex-grow: 1;
			width: 70%;
			min-width: 0;
			flex-direction: row;
			padding-right: 20px;
			box-sizing: border-box;
			color: #000;
			.song-info-cover {
				flex-basis: 20%;
				box-shadow: 5px 0 20px #fff;
				background-color: #fff;
				z-index: 2;
				> img {
					margin-top: -0.5rem;
					width: 100%;
					border-radius: 50%;
				}
			}
			.song-info-name {
				display: flex;
				position: relative;
				justify-content: center;
				align-items: center;
				z-index: 1;
				flex-grow: 1;
				width: 70%;
				min-width: 0;
				overflow: hidden;
				> p {
					min-width: 100%;
					margin: 0;
					padding: 0;
					white-space: nowrap;
					animation: gundong 20s linear infinite;
				}
			}
		}
		.tools-box {
			display: flex;
			flex-direction: row;
			align-items: center;
			.btn {
				padding: 0 0.8rem;
				color: rgb(27, 161, 27);
				.iconfont {
					font-size: 1.6rem;
				}
			}
		}
	}
	@keyframes gundong {
		0% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-100%);
		}
		50.00000001% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>


