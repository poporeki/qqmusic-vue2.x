<template>
	<video
		style="width:100%"
		controls
		autoplay
		:src="nowUrl.length!==0&&nowUrl[0]"
		@loadedmetadata="loadedmetadata"
	>
		<template v-for="(url,uidx) in nowUrl">
			<source :src="url" type :key="uidx">
		</template>
	</video>
</template>

<script>
	export default {
		props: {
			vid: {
				type: String,
				default: "w0025lvkrsg"
			}
		},
		data() {
			return {
				mvInfo: {},
				playUrl: []
			};
		},
		methods: {
			/**获取播放地址 */
			getMVplayUrl() {
				let url = `/api/v1/qqmusic/getMVPlayUrl`;
				let that = this;
				this.$axios
					.get(url, {
						params: {
							vid: this.vid
						}
					})
					.then(({ data }) => {
						if (data.code !== 0) return;
						that.mvInfo = data.getMvUrl.data[that.vid];
						that.formatUrl();
					});
			},
			loadedmetadata() {
				if (this.$store.state.songPlayed !== true) return;
				this.$store.commit("pausePlay");
			},
			formatUrl() {
				let mp4 = this.mvInfo.mp4;
				let arr = mp4.filter(val => {
					return val.code === 0;
				});
				this.playUrl = arr;
			}
		},
		watch: {
			vid(val, oldVal) {
				if (val === oldVal) return;
				this.getMVplayUrl(val);
			}
		},
		computed: {
			nowUrl() {
				return (
					this.playUrl.length !== 0 &&
					this.playUrl[this.playUrl.length - 1].freeflow_url
				);
			}
		},
		created() {
			this.getMVplayUrl();
		}
	};
</script>


<style lang="scss">
	video {
		max-height: 100%;
		max-width: 100%;
	}
</style>
