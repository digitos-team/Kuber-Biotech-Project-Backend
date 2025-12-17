import { translate } from 'google-translate-api-x';

/**
 * Translates text from English to Marathi
 * @param {string} text - Text to translate
 * @returns {Promise<string>} - Translated text or original text if failure
 */
export const translateToMarathi = async (text) => {
    if (!text) return "";
    
    // Category mappings (hardcoded for consistency)
    const categoryMap = {
        "Granule Products": "ग्रॅन्युल उत्पादने",
        "Liquid Products": "द्रव उत्पादने"
    };

    if (categoryMap[text]) {
        return categoryMap[text];
    }

    try {
        const res = await translate(text, { from: 'en', to: 'mr' });
        return res.text;
    } catch (error) {
        console.error("Translation failed:", error.message);
        // Fallback: return original English text so functionality doesn't break
        return text;
    }
};