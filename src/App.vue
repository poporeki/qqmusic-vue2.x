<template>
	<div id="app">
		<transition enter-active-class="ani fade-in-right" leave-active-class="ani fade-out-right">
			<router-view class="container"></router-view>
		</transition>
		<music-player-item></music-player-item>
		<nav-bar-bottom-item></nav-bar-bottom-item>
		<pub-search-item></pub-search-item>
		<music-playlist-item></music-playlist-item>
	</div>
</template>

<script>
	/**底部Tab */
	import NavBarBottomItem from "@/components/BaseNavigationBarBottomItem";
	/**搜索 */
	import PubSearchItem from "@/components/SearchItem";
	/**音乐播放器 */
	import MusicPlayerItem from "@/components/MusicPlayerItem";
	/**播放列表 */
	import MusicPlaylistItem from "@/components/MusicPlaylistItem";

	export default {
		components: {
			NavBarBottomItem,
			PubSearchItem,
			MusicPlayerItem,
			MusicPlaylistItem
		},

		computed: {
			isShowPlayer() {
				this.$store.state.isShowPlayer;
			}
		},
		watch: {
			isShowPlayer(val, oldVal) {
				if (val === true) {
					let body = document.querySelector("body");
					body.style.overflow = "hidden";
				}
			}
		},
		created() {
			this.$store.dispatch("getSearchHistory");
		}
	};
</script>


<style lang="scss">
	@import "//at.alicdn.com/t/font_1173207_e30704lh3sq.css";
	html,
	body,
	#app {
		touch-action: none;
		padding: 0;
		margin: 0;
		height: 100%;
		overflow: hidden;
		-webkit-overflow-scrolling: touch;
	}
	img[lazy="loaded"] {
		animation: fadeInBottom 0.5s;
	}
	body {
		margin: 0;
		padding: 0;
		overscroll-behavior-y: contain;
	}
	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: $text-color-default;

		width: 100%;
		min-height: 100vh;
		margin: 0 auto;
		background-color: $base-bg-color;
		a {
			text-decoration: none;
			color: $text-color-default;
		}
		img {
			display: block;
			max-width: 100%;
		}
	}

	div {
		box-sizing: border-box;
	}
	.section-title {
		padding-left: 15px;
		font-size: 1.2rem;
		color: #000;
	}
	.slide-inner {
		display: flex;
		flex-direction: column;
		position: relative;
		margin-bottom: 0.5rem;
		&.disabled {
			.photo {
				&::after {
					content: "";
					position: absolute;
					height: 100%;
					width: 100%;
					top: 0;
					left: 0;
					background-color: rgba(0, 0, 0, 0.5);
				}
			}
		}
		.photo {
			position: relative;
			> img {
				border-radius: 10px;
				z-index: 1;
			}
			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				bottom: 0;
				right: 0;
				z-index: 2;
				color: #fff;
				padding: 2px 6px;
				border-radius: 10px;
				background-color: rgba(0, 0, 0, 0.5);
				> .iconfont {
					font-size: 0.6rem;
				}
			}
		}
		.desc {
			padding-top: 0.2rem;
			.name {
				flex-grow: 1;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.singer {
				flex-grow: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				color: $text-color-default-secondary;
				font-size: 0.7rem;
			}
		}
	}
</style>
