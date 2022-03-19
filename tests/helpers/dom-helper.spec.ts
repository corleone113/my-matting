import { createContext2D, domHelpers } from '@/helpers/dom-helper';

describe('测试DOM操作相关的函数', () => {
	afterEach(() => jest.resetAllMocks());

	describe('createContext2D, 创建隐藏的离屏绘制上下文', () => {
		it('没有传递参数时', () => {
			const canvas = document.createElement('canvas');
			const context2D = canvas.getContext('2d') as CanvasRenderingContext2D;
			// 不能同时spy createElement和getContext，会报错
			jest.spyOn(canvas, 'getContext').mockReturnValue(context2D);

			expect(createContext2D()).toEqual(context2D);
		});

		it('传入复制的canvas(cloneCanvas)时', () => {
			const canvas = {
				width: 300,
				height: 240,
				getContext() {
					return context2D;
				},
			} as unknown as HTMLCanvasElement;
			const context2D = { canvas, drawImage() {} } as unknown as CanvasRenderingContext2D;

			jest.spyOn(document, 'createElement').mockReturnValue(canvas);
			const cloneCanvas = { width: 300, height: 240 } as unknown as HTMLCanvasElement;
			const copyImageInCanvasSpy = jest.spyOn(domHelpers, 'copyImageInCanvas');

			createContext2D({ cloneCanvas });
			expect(copyImageInCanvasSpy).toHaveBeenCalledWith(context2D, cloneCanvas);
		});

		it('传入目标尺寸(targetSize)时', () => {
			const canvas = { width: 300, height: 240, getContext() {} } as unknown as HTMLCanvasElement;
			const targetSize = { width: 800, height: 500 };

			// 不能同时spy createElement和getContext，会报错
			jest.spyOn(document, 'createElement').mockReturnValue(canvas);

			createContext2D({ targetSize });
			expect(canvas.width).toBe(targetSize.width);
			expect(canvas.height).toBe(targetSize.height);
		});
	});
});
