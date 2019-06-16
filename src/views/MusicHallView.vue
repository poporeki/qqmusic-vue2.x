<template>
	<my-scroll-item class="music-hall-container">
		<div class="music-hall-inner">
			<header-item></header-item>
			<request-loading v-if="!isInit"></request-loading>
			<carousel-item :carousel-data="focus.content"></carousel-item>
			<banner-item></banner-item>
			<recomm-item :recomm-list="recomPlaylist"></recomm-item>
			<new-album v-if="isInit" :new-album-list="new_album"></new-album>
			<new-song v-if="isInit" :new-song-list="new_song"></new-song>
			<recom-mv-item></recom-mv-item>
		</div>
	</my-scroll-item>
</template>


<script>
	import HeaderItem from "@/components/HomeHeader";
	import CarouselItem from "@/components/musichall/CarouselItem";
	import recommItem from "@/components/musichall/RecommendList";
	import newAlbum from "@/components/musichall/NewAlbumList";
	import newSong from "@/components/musichall/NewSongList";
	import BannerItem from "@/components/musichall/BannerItem";
	import requestLoading from "@/components/common/RequestLoading_List";
	import recomMvItem from "@/components/musichall/RecommendMV";
	import BetterScrollItem from "@/components/common/BetterScroll";
	import MyScrollItem from "@/components/common/MyScrollItem";
	export default {
		components: {
			CarouselItem,
			HeaderItem,
			BannerItem,
			recommItem,
			newAlbum,
			newSong,
			requestLoading,
			recomMvItem,
			BetterScrollItem,
			MyScrollItem
		},
		data() {
			return {
				isInit: false,
				initUrl: "/api/v1/qqmusic/gethomedata",
				new_album: [],
				new_song: [],
				focus: [],
				recomPlaylist: [],
				new_album_tag: []
			};
		},
		methods: {
			getMusicHallData() {
				return new Promise((resolve, reject) => {
					let that = this;
					this.$axios.get(this.initUrl).then(({ data }) => {
						that.isInit = true;
						that.new_album = data.new_album.data;
						that.focus = data.focus.data;
						that.new_song = data.new_song.data;
						that.new_album_tag = data.new_album_tag.data;
						that.recomPlaylist = data.recomPlaylist.data.v_hot;
						resolve();
					});
				});
			}
		},
		created() {
			this.getMusicHallData();
		},
		mounted() {}
	};
</script>

<style lang="scss">
	.music-hall-container {
		position: relative;
		height: 100%;
		padding-bottom: 6rem;
	}
	.music-hall-inner {
		position: relative;
	}
</style>

