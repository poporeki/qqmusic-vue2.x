<template>
	<div class="song-list-container">
		<common-header
			:scrollY="scrollY"
			:scrollChangeBg="true"
			:scrollHeight="200"
			title-color="255,255,255,1"
			:changeTitleColor="true"
			changedTitleColor="0,0,0,1"
		></common-header>
		<better-scroll-item
			class="song-list-body"
			:probeType="3"
			:listenScroll="true"
			@scroll="onScroll"
			:data="songsList"
		>
			<div class="song-list-body-inner">
				<request-loading-item v-show="isRequest"></request-loading-item>
				<!-- ###### TOP ###### -->
				<div class="header">
					<div class="cover">
						<div class="inner">
							<img :src="getAlbumPic(albumData.mid)" alt>
						</div>
					</div>
					<div class="info">
						<div class="song-image">
							<img :src="getAlbumPic(albumData.mid)" alt>
							<div class="listen-num"></div>
						</div>
						<div class="list-info">
							<div class="list-info-title">{{albumData.name}}</div>
							<div class="list-author-info">
								<div class="a-head">
									<img :src="getSingerPic(albumData.singermid)" alt class="avatar">
									<!-- <img :src="songsList.ifpicurl" alt class="ifpic"> -->
								</div>
								<div class="a-name">{{albumData.singername}}</div>
							</div>
							<div class="list-info-desc">
								<p>简介：{{albumData.desc}}</p>
							</div>
						</div>
					</div>
				</div>
				<!-- ###### BODY ###### -->
				<div class="list-body">
					<!-- 歌曲列表 -->
					<div class="song-list">
						<div
							:class="{'list-item':true ,playing:playingSongId===song.songmid,song:true,disabled:song.pay&&song.pay.payplay!==0}"
							v-for="(song,sidx) in songsList"
							:key="sidx"
							@click="playThis(song)"
						>
							<!-- 索引 -->
							<div class="song-index">{{sidx+1}}</div>

							<!-- 歌曲信息 -->
							<div class="song-info">
								<!-- 歌名 -->
								<div class="s-name">
									{{song.songname}}
									<span
										class="icon-mv"
										v-if="song.vid&&song.vid!==''"
										@click.stop="goMvPage(song.vid)"
									>MV</span>
								</div>
								<!-- 歌手名 -->
								<div class="s-singer-name">
									<template v-for="singer in song.singer">{{singer.name}}</template>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</better-scroll-item>
	</div>
</template>

<script>
	import commonHeader from "@/components/common/HeaderItem";
	import BetterScrollItem from "@/components/common/BetterScroll";
	import RequestLoadingItem from "@/components/common/RequestLoading_List";
	export default {
		components: { commonHeader, BetterScrollItem, RequestLoadingItem },
		props: {
			listId: {
				type: Array
			}
		},
		data() {
			return {
				requestUrl: "/api/v1/qqmusic/getAlbumInfo",
				songsList: [],
				isRequest: false,
				headerBgColor: "255,255,255,0",
				albumData: {},
				scrollY: 0
			};
		},
		methods: {
			/**跳转mv页面 */
			goMvPage(vid) {
				this.$router.push({
					path: "/mv/" + vid
				});
			},
			onScroll(pos) {
				this.scrollY = pos.y;
			},
			/**获取songList */
			getSongsList(albummid) {
				let that = this;
				this.isRequest = true;
				this.$axios(this.requestUrl, {
					params: {
						album_mid: albummid
					}
				}).then(({ data }) => {
					that.isRequest = false;
					if (data.code !== 0 && data.subcode !== 0) return;
					that.albumData = data.data;
					that.songsList = data.data.list;
				});
			},
			/**歌手图片 */
			getSingerPic(singermid) {
				return `//y.gtimg.cn/music/photo_new/T001R150x150M000${singermid}.jpg?max_age=2592000`;
			},
			/**背景图片 */
			getCoverPic(albummid) {
				return `//y.gtimg.cn/music/photo_new/T002R150x150M000${albummid}.jpg?max_age=2592000`;
			},
			/**专辑图片 */
			getAlbumPic(albummid) {
				return `//y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`;
			},
			/**正在播放歌曲的mid */
			playingMid(mid) {
				return this.$store.commit("updatePlayingSongmid", mid);
			},
			/**播放歌曲 */
			playThis(info) {
				if (info.pay && info.pay.payplay !== 0) return;
				this.playingMid(info.songmid);
				let obj = {
					songName: info.songname,
					songMid: info.songmid,
					albumName: info.albumname,
					albumMid: info.albummid,
					singerArr: info.singer,
					albumId: info.albumid,
					albumPic: `http://imgcache.qq.com/music/photo/album_300/${info.albumid %
						100}/300_albumpic_${info.albumid}_0.jpg`
				};
				this.$store.commit("updatePlayingSongInfo", info);
				this.$store.commit("formatPlayingSongInfo", obj);
			}
		},
		watch: {
			listId(val, oldVal) {
				if (oldVal === val) return;
				this.getSongsList(val);
			}
		},
		computed: {
			playingSongId() {
				return this.$store.state.playingSongmid;
			}
		},
		created() {
			this.getSongsList(this.$route.params.mid);
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
			padding-top: 2.6rem;
			color: #fff;
			box-sizing: border-box;
			.info {
				position: relative;
				display: flex;
				flex-direction: row;
				align-items: center;
				min-width: 0;
				width: 100%;
				padding: 1rem;
				box-sizing: border-box;
			}
			.cover {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				overflow: hidden;
				z-index: -1;
				> img {
					object-fit: contain;
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
				flex-basis: 40%;
				border-radius: 20px;
				overflow: hidden;
				img {
					display: block;
					max-width: 100%;
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
				width: 1%;
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
				margin-top: 10px;
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
				.list-item.song {
					display: flex;
					flex-direction: row;
					padding: 1rem 0;
					box-sizing: border-box;
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
							display: flex;
							align-items: center;
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
			vertical-align: middle;
		}
	}
</style>


