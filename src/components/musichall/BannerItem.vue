<template>
	<div class="banner-container">
		<div class="b-inner">
			<div class="b-list">
				<div class="b-l-item" @click="goPage('singerlist')">
					<i class="iconfont icon-people3"></i>
					<span>歌手</span>
				</div>
				<div class="b-l-item" @click="goPage('toplistzone')">
					<i class="iconfont icon-paihang"></i>
					<span>排行</span>
				</div>
				<div class="b-l-item" @click="goPage('categoryzone')">
					<i class="iconfont icon-kinds"></i>
					<span>分类歌单</span>
				</div>
				<div class="b-l-item" @click="goPage('radiolist')">
					<i class="iconfont icon-xianxing_diantai"></i>
					<span>电台</span>
				</div>
				<div class="b-l-item">
					<i class="iconfont icon-headphone"></i>
					<span>一起听</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			goPage(path) {
				this.$router.push({
					path: path
				});
			}
		}
	};
</script>

<style lang="scss">
	.banner-container {
		margin: 1rem 0;
		.b-inner {
			padding: 0 1rem;
		}
		.b-list {
			display: flex;
			flex-direction: row;
			.b-l-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				flex-grow: 1;
				.iconfont {
					margin-bottom: 0.5rem;
					font-size: 1.8rem;
					color: $music-color;
				}
				> span {
					font-size: 0.9rem;
				}
			}
		}
	}
</style>
