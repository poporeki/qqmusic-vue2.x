<template>
	<transition enter-active-class="ani move-in-left">
		<div class="recommend-list-container" v-show="Object.keys(newSongList).length!==0">
			<div class="section-title">
				<h3>新歌</h3>
			</div>
			<swiper :options="swiperOption">
				<swiper-slide v-for="(item,ridx) in songList" :key="ridx">
					<div
						:class="{'slide-inner':true, 'song-item':true,disabled:item.pay.pay_play !== 0}"
						@click="playThis(item)"
					>
						<div class="photo">
							<img v-lazy="jointPhoto(item.album.mid)" alt>
							<div class="icon" v-show="item.pay.pay_play === 0">
								<i class="iconfont icon-play"></i>
							</div>
						</div>
						<div class="desc">
							<div class="name">{{item.name}}</div>
							<div class="singer">
								<template v-for="s in item.singer">{{s.name}}</template>
							</div>
						</div>
					</div>
				</swiper-slide>
			</swiper>
		</div>
	</transition>
</template>


<script>
	export default {
		props: {
			newSongList: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				songList: [],
				listTotal: 0,
				songsListUrl: "/api/v1/qqmusic/getsongslist",
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					slidesPerView: 3,
					spaceBetween: 5,
					watchSlidesProgress: true,
					initialSlide: 0,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				}
			};
		},
		methods: {
			goPageSongsList(id) {
				this.$router.push({
					path: "/song/" + id
				});
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

					albumPic: this.jointPhoto(info.album.mid)
				};
				this.$store.commit("updatePlayingSongmid", info.mid);
				this.$store.commit("updatePlayingSongInfo", info);
				this.$store.commit("formatPlayingSongInfo", obj);
			},
			jointPhoto(mid) {
				return `//y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`;
			}
		},
		created() {
			if (
				this.newSongList instanceof Object &&
				Object.keys(this.newSongList).length !== 0
			) {
				this.songList = this.newSongList.songlist;
				this.listTotal = this.newSongList.lanlist;
			}
		}
	};
</script>


