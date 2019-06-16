<template>
	<div class="recommend-list-container">
		<div class="section-title">
			<h3>MV</h3>
		</div>
		<request-loading-item v-show="isRequest"></request-loading-item>
		<swiper :options="swiperOption">
			<swiper-slide v-for="(item,ridx) in mvList" :key="ridx">
				<div class="slide-inner album-item" @click="goPageMV(item.vid)">
					<div class="photo">
						<img v-lazy="item.picurl" alt>
						<div class="icon">
							<i class="iconfont icon-play"></i>
						</div>
					</div>
					<div class="desc">
						<div class="name">{{item.mvtitle}}</div>
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
	import RequestLoadingItem from "@/components/common/RequestLoading_List";
	export default {
		components: { RequestLoadingItem },
		data() {
			return {
				isRequest: false,
				mvList: [],
				listTotal: 0,
				songsListUrl: "/api/v1/qqmusic/getsongslist",
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					slidesPerView: 2,
					slidesPerColumn: 3,
					slidesPerColumnFill: "row",
					watchSlidesProgress: true,
					initialSlide: 0,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				}
			};
		},
		methods: {
			/**获取mv列表 */
			getMvListData() {
				let url = "/api/v1/qqmusic/getmvlist";
				this.isRequest = true;
				this.$axios
					.get(url)
					.then(({ data }) => {
						this.isRequest = false;
						if (data.code !== 0) return;
						this.mvList = data.data.mvlist;
					})
					.catch(err => {
						this.isRequest = false;
					});
			},
			/**跳转mv详情页 */
			goPageMV(vid) {
				this.$router.push({
					path: "/mv/" + vid
				});
			},
			jointPhoto(mid) {
				return `//y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`;
			}
		},
		created() {
			this.getMvListData();
		}
	};
</script>

