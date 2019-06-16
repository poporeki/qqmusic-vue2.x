<template>
	<div class="category-area-container" v-if="Object.keys(areaData).length!==0">
		<common-header
			defaultBackgroundColor="0,0,0,0"
			:has-bg-shadow="false"
			:title-color="areaData.color.foreColor"
		></common-header>
		<div class="c-a-header">
			<div class="c-a-cover">
				<img :src="'//y.gtimg.cn/music/common'+areaData.cover" alt>
			</div>
			<div class="c-a-h-tit">
				<div class="inner">
					<p class="main-tit" :style="{color:areaData.color.foreColor}">{{areaData.title}}</p>
					<p class="s-m-tit">{{areaData.desc}}</p>
				</div>
			</div>
		</div>
		<div class="c-a-body">
			<div class="c-a-banner">
				<swiper :options="swiperOption">
					<swiper-slide
						class="swiper-item"
						v-for="(card,cidx)   in  areaData.v_shelf[0].v_niche[0].v_card"
						:key="cidx"
					>
						<div class="s-pic">
							<img :src="card.cover" alt>
						</div>
						<div class="s-tit">{{card.title}}</div>
					</swiper-slide>
				</swiper>
			</div>
		</div>
	</div>
</template>


<script>
	import commonHeader from "@/components/common/HeaderItem";
	export default {
		components: { commonHeader },
		data() {
			return {
				// swiper配置
				swiperOption: {
					slidesPerView: 1,
					watchSlidesProgress: true,
					initialSlide: 0,
					observer: true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents: true //修改swiper的父元素时，自动初始化swiper
				},
				requestUrl: "/api/v1/qqmusic/getcategoryarea/",
				areaData: {}
			};
		},
		methods: {
			getAreaData(aid) {
				let that = this;
				let areaid = aid || this.areaid;
				this.$axios.get(this.requestUrl + areaid).then(({ data }) => {
					if (data.PoolApiServer.code !== 0) return;
					this.areaData = data.PoolApiServer.data;
				});
			}
		},
		computed: {
			areaid() {
				return this.$route.params.areaid;
			}
		},
		created() {
			this.getAreaData();
		}
	};
</script>


<style lang="scss">
	.c-a-header {
		position: relative;
		.c-a-h-tit {
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			color: #fff;
			.inner {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				padding: 1rem;
			}
			.main-tit {
				margin: 1rem 0;
				font-size: 2rem;
			}
			.s-m-tit {
				max-width: 60%;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				color: gray;
			}
		}
	}
	.c-a-body {
		position: relative;
		.c-a-banner {
			position: absolute;
			top: -2rem;
			width: 100%;
			.swiper-item {
				position: relative;
			}
			.s-pic {
				position: relative;
				border-radius: 10px;
				overflow: hidden;
				&::after {
					content: "";
					position: absolute;
					width: 100%;
					height: 50%;
					bottom: 0;
					left: 0;
					background: linear-gradient(
						to bottom,
						rgba(0, 0, 0, 0),
						rgba(0, 0, 0, 0.425)
					);
				}
			}
			.s-tit {
				position: absolute;
				bottom: 0.5rem;
				color: #fff;
			}
		}
	}
</style>
