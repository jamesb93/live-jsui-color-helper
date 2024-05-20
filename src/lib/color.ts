type RGBA = [number, number, number, number];
type HEX = string;
type HSB = [number, number, number];
type RGB = [number, number, number];
type HSL = [number, number, number];
type LIVETOKEN = string;

export const rgba_to_hsla = (rgba: RGBA): HSLA => {
	const [r, g, b, a] = rgba;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return [h, s, l, a];
}

export const rgba_to_hex = (rgba: RGBA): HEX => {
    const [r, g, b, a] = rgba.map(v => Math.round(v * 255));
    const alpha = Math.round(a * 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${alpha.toString(16).padStart(2, '0')}`;
}

function rgbToHsv(r, g, b) {
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

export function rgba_to_hsb(rgba: RGBA): HSB {
    let [r, g, b, a] = rgba;
    let [h, s, v] = rgbToHsv(r, g, b);

    // Convert hue to degrees, saturation and value to percentage
    h = h * 360;
    s = s * 100;
    v = v * 100;

    return [h, s, v, a];
}

