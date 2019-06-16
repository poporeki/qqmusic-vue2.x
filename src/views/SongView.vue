<template>
	<div class="song-list-container">
		<common-header bg-color="transparent" changedbg-color="255,255,255"></common-header>
		<request-loading v-show="isRequest"></request-loading>
		<div class="header" v-show="!isRequest">
			<div class="cover">
				<div class="inner">
					<img :src="songsList.logo" alt>
				</div>
			</div>
			<div class="info">
				<div class="song-image">
					<img :src="songsList.logo" alt>
					<div class="listen-num"></div>
				</div>
				<div class="list-info">
					<div class="list-info-title">{{songsList.dissname}}</div>
					<div class="list-author-info">
						<div class="a-head">
							<img :src="songsList.headurl" alt class="avatar">
							<img :src="songsList.ifpicurl" alt class="ifpic">
						</div>
						<div class="a-name">{{songsList.nickname}}</div>
					</div>
					<div class="list-info-desc" :title="songsList.desc" @click="infoIsShow=!infoIsShow">
						<p v-show="songsList.desc">简介：{{songsList.desc}}</p>
						<div class="info-detail" v-show="infoIsShow" v-html="songsList.desc"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="list-body" v-show="!isRequest">
			<div class="song-list">
				<transition-group enter-active-class="ani fade-in">
					<div
						:class="{'list-item':true,playing:songIsPlaying(song.mid), song:true,disabled:song.pay.pay_play!==0}"
						v-for="(song,sidx) in songsList.songlist"
						:key="sidx"
						@click="playThis(song)"
					>
						<div class="song-index">{{sidx+1}}</div>
						<div class="song-info">
							<div class="s-name">
								{{song.name}}
								<span
									class="icon-mv"
									v-if="song.mv.id!==0&&song.mv.vid!==''"
									@click.stop="goMvPage(song.mv.vid)"
								>MV</span>
							</div>
							<div class="s-singer-name">
								<template v-for="singer in song.singer">{{singer.name}}</template>
							</div>
						</div>
					</div>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
	import requestLoading from "@/components/common/RequestLoading";
	import commonHeader from "@/components/common/HeaderItem";
	export default {
		components: { commonHeader, requestLoading },
		props: {
			listId: {
				type: Array
			}
		},
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/getsongslist",
				songsList: [],
				infoIsShow: false,
				isRequest: false
			};
		},
		methods: {
			/**跳转mv页面 */
			goMvPage(vid) {
				this.$router.push({
					path: "/mv/" + vid
				});
			},
			/**获取songList */
			getSongsList(listId) {
				let that = this;
				this.isRequest = true;
				this.$axios(this.requestUrl, {
					params: {
						content_id: listId
					}
				}).then(({ data }) => {
					this.isRequest = false;
					if (data.code !== 0 && data.subcode !== 0) return;
					that.songsList = data.cdlist[0];
				});
			},
			/**播放 */
			playThis(info) {
				if (info.pay && info.pay.pay_play !== 0) return;
				let obj = {
					songName: info.name,
					songMid: info.mid,
					albumName: info.album.title,
					albumMid: info.album.mid,
					singerArr: info.singer,
					albumId: info.album.id,
					albumPic: `http://imgcache.qq.com/music/photo/album_300/${info.album
						.id % 100}/300_albumpic_${info.album.id}_0.jpg`
				};
				this.$store.commit("updatePlayingSongmid", info.mid);
				this.$store.commit("updatePlayingSongInfo", info);
				this.$store.commit("formatPlayingSongInfo", obj);
			},
			songIsPlaying(songmid) {
				return songmid === this.playingMid;
			}
		},
		watch: {
			listId(val, oldVal) {
				if (oldVal === val) return;
				this.getSongsList(val);
			}
		},
		computed: {
			playingMid() {
				return this.$store.state.playingSongmid;
			}
		},
		created() {
			this.getSongsList(this.$route.params.id);
		}
	};
</script>

<style lang="scss">
	.song-list-container {
		position: relative;
		width: 100%;
		z-index: 2;
		.header {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			padding-top: 20px;
			color: #fff;
			box-sizing: border-box;
			.info {
				position: relative;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 40px 20px;
				box-sizing: border-box;
			}
			.cover {
				position: absolute;

				top: 0;
				left: 0;
				width: 100%;
				overflow: hidden;
				z-index: -1;

				.inner {
					position: relative;
					filter: blur(20px);
					transform: scale(1.2);
					> img {
						object-fit: contain;
					}
				}

				&::after {
					content: "";
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					background-image: linear-gradient(
						to top,
						rgba(0, 0, 0, 0.322),
						rgba(255, 255, 255, 0)
					);
				}
			}
			.song-image {
				position: relative;
				width: 30%;
				border-radius: 20px;
				overflow: hidden;
				img {
					width: 100%;
				}
				&::after {
					content: "";
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					background-image: linear-gradient(
						to top,
						rgba(0, 0, 0, 0.322),
						rgba(255, 255, 255, 0)
					);
				}
			}
			.list-info {
				display: flex;
				position: relative;
				margin-left: 20px;
				flex-direction: column;
				flex-grow: 1;
			}
			.list-info-title {
				font-size: 1.2rem;
				margin: 0 0 10px 0;
				overflow: hidden; /*超出部分隐藏*/
				white-space: nowrap; /*不换行*/
				text-overflow: ellipsis;
			}
			.list-author-info {
				position: relative;
				display: flex;
				flex-direction: row;
				align-items: center;
				.a-head {
					position: relative;
					flex-basis: 10%;
					.avatar {
						width: 100%;
						border-radius: 50%;
					}
					.ifpic {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 30%;
					}
				}
				.a-name {
					margin-left: 10px;
				}
			}
			.list-info-desc {
				position: relative;
				margin-top: 10px;
				p {
					position: relative;
				}
				.info-detail {
					background-color: rgba(8, 8, 8, 0.452);
					position: absolute;
					padding: 1rem;
					left: 0;
					bottom: 0;
					font-size: 0.8em;
					transform: translateY(100%);
				}
				p {
					margin: 0;
					font-size: 0.8rem;
					overflow: hidden; /*超出部分隐藏*/
					white-space: nowrap; /*不换行*/
					text-overflow: ellipsis;
				}
			}
		}
		.list-body {
			background-color: $base-bg-color;
			.song-list {
				min-height: 30rem;
				.list-item {
					&.song {
						display: flex;
						flex-direction: row;
						padding: 1rem 0;
						box-sizing: border-box;
					}
					&.playing {
						color: $music-color !important;
						border-left: 1px solid $music-color;
						.song-info {
							color: inherit;
							.s-name,
							.s-singer-name {
								color: inherit !important;
							}
						}
					}
					&.disabled {
						color: gray;
						background-color: $disabled-color;
						border-left: 1px solid rgb(168, 168, 168);
					}
					.song-index {
						display: flex;
						align-items: center;
						flex-basis: 15%;
						justify-content: center;
					}
					.song-info {
						padding-right: 1rem;
						flex-basis: 1%;
						flex-grow: 1;
						.s-name {
							margin-bottom: 10px;
							color: #000;
							font-size: 1rem;
							transition: color 0.3s ease;
							display: flex;
							align-items: center;
						}
						.s-singer-name {
							transition: color 0.3s ease;
							color: gray;
						}
					}
				}
			}
		}
		.icon-mv {
			padding: 1px 4px;
			border: 1px solid $music-color;
			color: $music-color;
			font-size: 0.6rem;
			border-radius: 4px;
			margin: 0 4px;
		}
	}
</style>


