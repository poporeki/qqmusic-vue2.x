<template>
	<div class="footer-container">
		<music-player-mini-item></music-player-mini-item>
		<transition enter-active-class="ani move-in-bottom" leave-active-class="ani move-out-bottom">
			<div class="tab-bottom-container" v-show="!isShow||false">
				<div class="tab-item">
					<router-link class="tab-item-link" to>
						<i class="iconfont icon-My"></i>
						<span>我的</span>
					</router-link>
				</div>
				<div class="tab-item current">
					<router-link class="tab-item-link" to="/">
						<i class="iconfont icon-music"></i>
						<span>音乐馆</span>
					</router-link>
				</div>
				<div class="tab-item">
					<router-link class="tab-item-link" to>
						<i class="iconfont icon-compass"></i>
						<span>发现</span>
					</router-link>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import MusicPlayerMiniItem from "@/components/MusicPlayerMiniItem";
	export default {
		components: { MusicPlayerMiniItem },
		computed: {
			isShow() {
				return this.$store.state.isShowSearchBox;
			}
		}
	};
</script>


<style lang="scss">
	.footer-container {
		position: fixed;
		bottom: 0;
		width: 100%;

		z-index: 101;
	}
	.tab-bottom-container {
		display: flex;
		position: relative;
		width: 100%;
		bottom: 0;
		left: 0;
		justify-content: space-between;
		align-items: center;
		border-top: $bottom-item-border;
		background-color: $bg-color;
		color: $text-color-default-secondary;

		.tab-item {
			flex-grow: 1;
			padding: 10px 20px;
			&.current {
				color: $music-color;
			}
			.iconfont {
				font-size: 1.2rem;
			}
		}
		.tab-item-link {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			font-size: 0.8em;
			color: inherit !important;
		}
	}
</style>

