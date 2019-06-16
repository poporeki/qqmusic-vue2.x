<template>
	<transition enter-active-class="ani fade-in">
		<swiper
			:options="swiperOption"
			ref="mySwiper"
			@someSwiperEvent="callback"
			v-show="carouselData.length!==0"
		>
			<!-- slides -->
			<swiper-slide v-for="(item,iidx) in carouselData" :key="iidx">
				<div class="carousel-item-inner" @click="goPageAlbum(item.jump_info.url)">
					<img :src="item.pic_info.url" alt>
				</div>
			</swiper-slide>
		</swiper>
	</transition>
</template>

<script>
	export default {
		props: {
			carouselData: {
				type: Array,
				default() {
					return [];
				}
			}
		},
		name: "carrousel",
		data() {
			return {
				swiperOption: {
					// some swiper options/callbacks
					// 所有的参数同 swiper 官方 api 参数
					// ...
					spaceBetween: 15,
					watchSlidesProgress: true,
					initialSlide: 0,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				}
			};
		},
		methods: {
			callback() {},
			goPageAlbum(url) {
				if (url.indexOf("http") !== -1) return;
				this.$router.push({ path: "album/" + url });
			}
		},
		watch: {
			carouselData(val) {}
		},
		computed: {
			swiper() {
				return this.$refs.mySwiper.swiper;
			}
		},
		mounted() {
			// current swiper instance
			// 然后你就可以使用当前上下文内的swiper对象去做你想做的事了
			// console.log("this is current swiper instance object", this.swiper);
			// this.swiper.slideTo(3, 1000, false);
		}
	};
</script>


<style lang="scss">
	.swiper-container {
		position: relative;
		.swiper-slide {
			padding: 0 15px;
			box-sizing: border-box;

			.carousel-item-inner {
				box-sizing: border-box;
				> img {
					border-radius: 10px;
					max-width: 100%;
				}
			}
		}
	}
</style>
