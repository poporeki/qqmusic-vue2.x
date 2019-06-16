<template>
	<div class="recommend-list-container">
		<div class="section-title">
			<h3>新碟</h3>
		</div>
		<swiper :options="swiperOption">
			<swiper-slide v-for="(item,ridx) in albumList" :key="ridx">
				<div class="slide-inner album-item" @click="goPageAlbum(item.mid)">
					<div class="photo">
						<img v-lazy="jointPhoto(item.mid)" alt>
						<div class="icon">
							<i class="iconfont icon-play"></i>
						</div>
					</div>
					<div class="desc">
						<div class="name">{{item.name}}</div>
						<div class="singer">
							<template v-for="s in item.singers">{{s.name}}</template>
						</div>
					</div>
				</div>
			</swiper-slide>
		</swiper>
	</div>
</template>


<script>
	export default {
		props: ["newAlbumList"],
		data() {
			return {
				albumList: [],
				listTotal: 0,
				songsListUrl: "/api/v1/qqmusic/getsongslist",
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					slidesPerView: 2,
					spaceBetween: 10,
					watchSlidesProgress: true,
					initialSlide: 0,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				}
			};
		},
		methods: {
			goPageAlbum(mid) {
				this.$router.push({
					path: "/album/" + mid
				});
			},
			jointPhoto(mid) {
				return `//y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`;
			}
		},
		created() {
			if (
				this.newAlbumList instanceof Object &&
				Object.keys(this.newAlbumList).length !== 0
			) {
				this.albumList = this.newAlbumList.albums;
				this.listTotal = this.newAlbumList.total;
			}
		}
	};
</script>


