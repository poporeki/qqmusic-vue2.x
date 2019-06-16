<template>
	<transition enter-active-class="ani move-in-bottom" leave-active-class="ani move-out-bottom">
		<div class="music-player-container" v-show="isShow" key="musicPlayer">
			<div class="cover">
				<img
					:src="albumPic"
					onerror="this.src='//y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'"
					alt
				>
			</div>
			<div class="p-header">
				<div class="btn-close" @click="$store.commit('changeMusicPlayerDisplayStatus',false)">
					<i class="iconfont icon-arrowsleftline"></i>
				</div>
				<div class="title">{{songName}}</div>
				<div class="other"></div>
			</div>
			<div class="p-body">
				<div class="center-box" @click.stop="isShowLyricFn">
					<div class="center-item singer" v-show="!isShowLyric">
						<div class="album-singer">
							——&nbsp;
							<template v-for=" s in songSingers">{{ s.name+' ' }}</template>&nbsp;——
						</div>
						<div class="album-singer-other">
							<div class="album-pic">
								<div class="album-pic-inner">
									<img
										:src="albumPic"
										alt
										:class="{'ani-rotate':true,paused:!isPlayed}"
										onerror="this.src='//y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000'"
									>
								</div>
							</div>
							<transition enter-active-class="ani fade-in-up">
								<div
									class="now-lyric-text"
									v-show="lyricNowText&&lyricNowText.txt"
								>{{(lyricNowText&&lyricNowText.txt)||''}}</div>
							</transition>
						</div>
					</div>
					<!-- 滚动歌词 -->

					<lyric-scroll
						v-show="isShowLyric"
						class="center-item lyric"
						:isShow="isShowLyric"
						:playTime="songNowTime"
						:songmid="songMid||''"
					></lyric-scroll>
				</div>
				<!-- 控制 -->
				<div class="player-control-box">
					<!-- 时间 -->
					<div class="player-time-box">
						<div class="now-time">{{playingSongTimeFormated}}</div>
						<div class="player-progress-bar">
							<div class="pr-load" ref="progress_load"></div>
							<div
								class="pr-play"
								:style="{width:progressWidth+'%'}"
								@touchstart="dotTouchStart"
								@touchmove="dotTouchMove"
								@touchend="dotTouchEnd"
								@mousedown="dotMouseStart"
								ref="progress_play"
							>
								<i class="pr-dot"></i>
							</div>
						</div>
						<div class="total-ti">{{songTotalTimeFormated}}</div>
					</div>

					<div class="control">
						<div class="btn x1" @click="playModeSwitch()">
							<i :class="switchModeStyle"></i>
						</div>
						<div :class="{btn:true,disabled:songIdx===0}" @click.stop="playPrev">
							<i class="iconfont icon-media-prev"></i>
						</div>
						<!-- 播放按钮 -->
						<div class="btn play" @click="switchPlay">
							<i class="iconfont icon-play-copy" v-if="!isPlayed"></i>
							<i class="iconfont icon-pause" v-if="isPlayed"></i>
						</div>
						<div
							:class="{btn:true,disabled:[2,3,4].indexOf(playMode)===-1&&songIdx===playSongList.length-1}"
							@click.stop="playNext"
						>
							<i class="iconfont icon-media-next"></i>
						</div>
						<div class="btn x1" @click.stop="$store.commit('changePlaySongListDisplayStatus',true)">
							<i class="iconfont icon-media-list"></i>
						</div>
					</div>
				</div>
			</div>
			<audio
				:src="playUrl"
				autoplay="true"
				ref="audio"
				:loop="playMode===1"
				@loadedmetadata="loadedmetadata"
				@timeupdate="updateTime"
				@ended="playEnded"
			></audio>
		</div>
	</transition>
</template>


<script>
	import { Base64 } from "js-base64";
	import Lyric from "lyric-parser";
	import { mapState, mapMutations } from "vuex";
	import LyricScroll from "@/components/music-player/LyricScroll";
	export default {
		props: {
			songInfo: {
				type: Array
			}
		},
		components: { LyricScroll },
		data() {
			return {
				$audio: "",
				requestUrl: "/api/v1/qqmusic/getSongVkey",
				audioDuration: 0,
				playUrl: "",
				songIdx: 0,
				lyric: "",
				lyricData: "",
				isShowLyric: false,
				currentLyric: null,
				lyricNowLine: {},
				songTotalTimeFormated: "",
				songTotalTime: 0,
				playingSongTimeFormated: "",
				songNowTime: 0
			};
		},
		methods: {
			isShowLyricFn() {
				return (this.isShowLyric = !this.isShowLyric);
			},
			/**
			 * 获取播放地址
			 */
			getNowPlaySongInfo(songmid) {
				let that = this;
				if (!songmid) return;
				this.$axios
					.get(this.requestUrl, {
						params: {
							song_mid: songmid
						}
					})
					.then(({ data }) => {
						that.isShowLyric = false;
						that.playUrl =
							data.req_0.data.sip[1] + data.req_0.data.midurlinfo[0].purl;
					});
			},
			/**
			 * 播放进度条鼠标事件
			 */
			dotMouseStart(e) {
				this.switchPlay(false);
				this.updateProgressWidth(e);
				window.addEventListener("mousemove", this.mouseMove);
				window.addEventListener("mouseup", this.mouseEnd);
			},
			mouseMove(e) {
				this.updateProgressWidth(e);
			},
			mouseEnd() {
				window.removeEventListener("mousemove", this.mouseMove);
				window.removeEventListener("mouseup", this.mouseEnd);
				this.switchPlay(true);
			},
			/**
			 * 播放进度条触摸事件
			 */
			dotTouchStart(e) {
				this.switchPlay(false);
				this.updateProgressWidth(e.changedTouches[0]);
			},
			dotTouchMove(e) {
				this.updateProgressWidth(e.changedTouches[0]);
			},
			dotTouchEnd(e) {
				this.switchPlay(true);
			},
			/**
			 * 更新进度条
			 */
			updateProgressWidth(e) {
				let $el = this.$refs.progress_load;
				let value =
					(e.clientX - $el.getBoundingClientRect().left) / $el.offsetWidth;
				let currentTime = this.songTotalTime * value;
				this.$refs.audio.currentTime = this.songTotalTime * value;
			},
			/**
			 * 播放结束
			 */
			playEnded() {
				this.$store.commit("songPlayNext", true);
			},
			init() {
				let audio = (this.$audio = this.$refs.audio);
			},
			/**
			 * 播放开始
			 */
			audioPlay() {
				this.$audio.play();
			},
			/**
			 * 播放暂停
			 */
			audioPause() {
				this.$audio.pause();
			},
			/**
			 * 切换播放暂停
			 */
			...mapMutations(["pausePlay", "switchPlay"]),
			/**
			 * 更新播放时间
			 */
			updateTime(e) {
				let t = e.target.currentTime;

				this.$store.commit("updatePlayingSongNowTime", t);
			},
			/**
			 * 元数据已加载
			 */
			loadedmetadata(e) {
				this.switchPlay(true);
				let dur = e.target.duration;
				this.songTotalTimeFormated = this.formatTime(dur);
				this.songTotalTime = dur;
			},
			/**
			 * 时间格式化
			 */
			formatTime(tim) {
				if (typeof tim !== "number") return;
				let time = Math.floor(tim);
				let m = Math.floor(time / 60);
				m = m < 10 ? "0" + m : m;

				let s = time - m * 60;
				s = s < 10 ? "0" + s : s;
				// console.log(`${m}:${s}`);
				return `${m}:${s}`;
			},
			/**下一曲 */
			playNext(e) {
				let target = e.currentTarget;
				let clsList = target.classList;
				for (let cls in clsList) {
					if (clsList[cls] === "disabled") {
						return;
					}
				}
				return this.$store.commit("songPlayNext");
			},
			/**上一曲 */
			playPrev() {
				return this.$store.commit("songPlayPrev");
			},
			nowIdx() {},
			playModeSwitch() {
				return this.$store.commit("switchMusicPlayerPlayMode");
			}
		},
		watch: {
			/**
			 * 监听播放地址
			 */
			playUrl(val, oldVal) {
				if (val === "") return;

				this.init();
			},
			playingNowTime(t, oldT) {
				if (oldT > t && t === 0) {
					this.$refs.audio.currentTime = t;
					this.switchPlay(true);
				}

				this.playingSongTimeFormated = this.formatTime(t);
				this.songNowTime = t;
			},
			isPlayed(val) {
				if (val === true) {
					this.audioPlay();
					// this.lay;
					this.switchPlay(true);
				} else {
					this.audioPause();
					this.switchPlay(false);
				}
			},
			playingMid(val) {
				this.getNowPlaySongInfo(val);
				let nowMid = this.playingMid;
				let slist = this.playSongList;
				for (let s in slist) {
					if (slist[s].songMid === nowMid) {
						this.songIdx = parseInt(s);
						return;
					}
				}
			},
			/**判断是否显示滚动条 */
			isShow(val) {
				if (val === true) {
					document.querySelector("body").style.overflow = "hidden";
				} else {
					document.querySelector("body").style.overflow = "visible";
				}
			}
		},
		computed: {
			...mapState({
				playingMid: "playingSongmid",
				isShow: "isShowPlayer",
				playingSongInfo: "formattedSongInfo",
				isPlayed: "songPlayed",
				playMode: "songPlayMode",
				playSongList: "playSongList",
				lyricNowText: "playingSongNowLyricLine",
				playingNowTime: "playingSongNowTime"
			}),
			hasSongInfo() {
				return (
					this.playingSongInfo && Object.keys(this.playingSongInfo).length !== 0
				);
			},
			songName() {
				return this.hasSongInfo && this.playingSongInfo.songName;
			},
			songSingers() {
				return this.hasSongInfo && this.playingSongInfo.singerArr;
			},
			albumId() {
				return this.hasSongInfo && this.playingSongInfo.albumId;
			},
			songMid() {
				return this.hasSongInfo && this.playingSongInfo.songMid;
			},
			albumPic() {
				return this.hasSongInfo && this.playingSongInfo.albumPic;
			},
			switchModeStyle() {
				return {
					iconfont: true,
					"icon-single": this.playMode === 1,
					"icon-order": this.playMode === 2,
					"icon-random": this.playMode === 3,
					"icon-list": this.playMode === 4
				};
			},
			progressWidth() {
				return (100 / this.songTotalTime) * this.songNowTime;
			}
		}
	};
</script>


<style lang="scss">
	.ani-rotate {
		animation: ro 50s linear infinite;
		&.paused {
			animation-play-state: paused;
		}
	}
	@keyframes ro {
		0% {
			transform: rotate(0deg);
		}
		99.99999% {
			transform: rotate(360deg);
		}
		100% {
			transform: rotate(0);
		}
	}
	.music-player-container {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		color: #fff;
		overflow: hidden;
		.cover {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			background-color: #fff;
			z-index: -1;
			margin: 0 auto;
			transform: scale(1.2);
			overflow: hidden;
			> img {
				position: absolute;
				height: 500%;
				left: 50%;
				top: 50%;
				transform: translateY(-50%) translateX(-50%);
				filter: blur(20px);
				object-fit: cover;
				z-index: -1;
			}
			&::after {
				content: "";
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				background-color: rgba(0, 0, 0, 0.5);
			}
		}
		.p-header {
			display: flex;
			flex-direction: row;
			padding: 20px 15px;
			flex-shrink: 0;
			justify-content: space-between;
			font-size: 1.2rem;
			.btn-close {
				display: flex;
				align-items: center;
				transform: rotate(-90deg);
				.iconfont {
					font-size: 1em;
				}
			}
			.title {
				padding: 0 10px;
			}
		}
		.p-body {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			min-height: 0;
			flex-grow: 1;
			.center-box {
				display: flex;
				width: 100%;
				flex-grow: 1;
				min-height: 1%;
				position: relative;
			}
			.center-item {
				position: relative;
				flex-grow: 1;

				&.singer {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					flex-grow: 1;
					.album-singer-other {
						display: flex;
						flex-grow: 1;
						padding: 1rem 0;
						flex-direction: column;
						justify-content: space-between;
					}
					.now-lyric-text {
						padding: 0 1rem;
						text-align: center;
						font-size: 0.8rem;
						color: rgb(223, 223, 223);
					}
				}
				&.lyric {
					padding: 15px;
					// overflow-y: auto;
					-webkit-mask-image: linear-gradient(
						to bottom,
						rgba(255, 255, 255, 0) 0,
						rgba(255, 255, 255, 0.6) 15%,
						rgba(255, 255, 255, 1) 25%,
						rgba(255, 255, 255, 1) 75%,
						rgba(255, 255, 255, 0.6) 85%,
						rgba(255, 255, 255, 0) 100%
					);
					p {
						padding: 0.5rem 0;
						transition: transform 0.3s ease;
						font-size: 0.9rem;
						text-align: center;
						&.current {
							color: $music-color;
							transform: scale(1.1);
						}
					}
				}
			}
			.album-singer {
				font-size: 1rem;
				text-align: center;
			}
			.album-pic {
				position: relative;

				width: 100%;
				max-width: 400px;
				min-width: 200px;
				padding: 0 40px;
				margin: 0 auto;
				overflow: hidden;
				box-sizing: border-box;
				.album-pic-inner {
					position: relative;
					width: 100%;
					height: 0;
					padding-bottom: 100%;
				}
				img {
					position: absolute;
					width: 100%;
					height: 100%;
					border-radius: 50%;
					box-sizing: border-box;
					border: 10px solid rgba(0, 0, 0, 0.39);
				}
			}
			.player-control-box {
				display: flex;
				flex-shrink: 0;
				width: 100%;
				padding: 1rem 1rem 3rem 1rem;
				box-sizing: border-box;
				flex-direction: column;
				.player-time-box {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.player-progress-bar {
						position: relative;
						flex-grow: 1;
						margin: 0 10px;
						.pr-load {
							height: 2px;
							background-color: rgba(255, 255, 255, 0.2);
						}
						.pr-play {
							position: absolute;
							height: 2px;
							top: 0;
							left: 0;
							background-color: rgba(255, 255, 255, 0.7);
							.pr-dot {
								position: absolute;
								display: block;
								top: -4px;
								right: -4px;
								width: 10px;
								height: 10px;
								border-radius: 50%;
								background-color: rgba(255, 255, 255, 0.7);
								transition: transform 0.3s ease;
								&:hover,
								&:active {
									transform: scale(2);
								}
							}
						}
					}
				}
				.control {
					display: flex;
					padding: 10px 20px;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.btn {
						transition: color 0.3s ease;
						&.play {
							> .iconfont {
								font-size: 4rem;
							}
						}
						&.disabled {
							color: rgba(54, 54, 54, 0.459);
						}
						> .iconfont {
							font-size: 3rem;
						}
						&.x1 {
							> .iconfont {
								font-size: 2rem;
							}
						}
						.icon-media-list {
							font-size: 2rem;
						}
					}
				}
			}
		}
	}
	.slide-fade-enter-active {
		transition: all 1s ease;
	}
	.slide-fade-leave-active {
		transition: all 0.8s ease;
	}
	.slide-fade-enter,
	.slide-fade-leave-to {
		transform: translateY(100%);
		opacity: 0;
	}
</style>
