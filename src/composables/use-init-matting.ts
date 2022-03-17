import { UPDATE_BOARDRECT_DEBOUNCE_TIME } from '@/constants';
import { computeBoardRect } from '@/helpers/init-compute';
import { initMatting } from '@/helpers/init-matting';
import { MattingProps, UseInitMattingBoardsConfig } from '@/types/init-matting';
import { debounce } from 'lodash';
import { onMounted, watch } from 'vue';

export function useInitMattingBoards(props: MattingProps, useInitMattingBoardsConfig: UseInitMattingBoardsConfig) {
	const { picFile } = props;
	const {
		boardContexts,
		boardContexts: { inputCtx },
	} = useInitMattingBoardsConfig;
	const { initMattingResult, width, height, initialized } = useInitMattingBoardsConfig;
	const { boardRect, transformConfig, mattingSources } = useInitMattingBoardsConfig;
	const updateBoardRect = () => {
		boardRect.value = computeBoardRect((inputCtx.value as CanvasRenderingContext2D).canvas);
	};
	watch([picFile], async () => {
		if (picFile.value && width.value && height.value) {
			initialized.value = false;
			initMattingResult.value = await initMatting({
				boardContexts,
				picFile: picFile.value,
				targetSize: { width: width.value, height: height.value },
				transformConfig: {},
				imageSources: {},
			});
			const { raw, mask, orig, positionRange, scaleRatio } = initMattingResult.value;
			transformConfig.positionRange = positionRange;
			transformConfig.scaleRatio = scaleRatio;
			mattingSources.value = { raw, mask, orig };
			updateBoardRect();
			initialized.value = true;
		}
	});
	onMounted(() => {
		window.addEventListener('scroll', debounce(updateBoardRect, UPDATE_BOARDRECT_DEBOUNCE_TIME));
	});
}
