<template>
	<transition enter-active-class="ani fade-in-left">
		<div class="recommend-list-container" v-show="recommList.length!==0">
			<div class="section-title">
				<h3>为你推荐</h3>
			</div>
			<swiper :options="swiperOption">
				<swiper-slide v-for="(item,ridx) in recommList" :key="ridx">
					<div class="slide-inner" @click="goPageSongsList(item.content_id)">
						<div class="photo">
							<img :src="item.cover" alt>
						</div>
						<div class="desc">
							<div class="name">{{item.title}}</div>
						</div>
					</div>
				</swiper-slide>
			</swiper>
		</div>
	</transition>
</template>


<script>
	export default {
		props: ["recommList"],
		data() {
			return {
				songsListUrl: "/api/v1/qqmusic/getsongslist",
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					slidesPerView: 3,
					slidesPerColumn: 2,
					slidesPerColumnFill: "row",
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
					path: "songslist/" + id
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.section-title {
		padding-left: 15px;
		font-size: 1.2rem;
		color: #000;
	}
	.slide-inner {
		position: relative;
		color: #000;
		> img {
			max-width: 100%;
			border-radius: 10px;
		}
		.name {
			font-size: 0.9rem;
			text-overflow: clip;
			overflow: visible;
			white-space: unset;
		}
	}
</style>
