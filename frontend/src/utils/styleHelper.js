export const generateBlockStyles = (configStr, viewMode = 'desktop', includeGrid = false) => {
  let styles = {};
  try {
    const config = typeof configStr === 'string' ? JSON.parse(configStr || '{}') : (configStr || {});

    // Background
    const bg = config.background || {};
    const bgColor = bg.color || config.colors?.background;
    const bgType = bg.type || (bgColor ? 'solid' : undefined);

    if (bgType === 'solid' || bgType === 'color') {
      if (bgColor) styles.backgroundColor = bgColor;
    } else if (bgType === 'gradient') {
      if (bg.gradient) styles.backgroundImage = bg.gradient;
    } else if (bgType === 'image') {
      if (bg.imageUrl || bg.image) {
        styles.backgroundImage = `url(${bg.imageUrl || bg.image})`;
        styles.backgroundSize = bg.backgroundSize || bg.size || 'cover';
        styles.backgroundPosition = bg.position || 'center';
        styles.backgroundRepeat = bg.repeat || 'no-repeat';
      }
    } else if (bgType === 'glass') {
      const blur = bg.blur !== undefined ? bg.blur : 10;
      const opacity = bg.opacity !== undefined ? bg.opacity / 100 : 0.8;
      styles.backdropFilter = `blur(${blur}px)`;
      styles.WebkitBackdropFilter = `blur(${blur}px)`;
      styles.backgroundColor = bgColor ? `${bgColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : `rgba(255, 255, 255, ${opacity})`;
    } else if (bgColor) {
      styles.backgroundColor = bgColor;
    }

    // Border
    const b = config.border || {};
    const bColor = b.color || config.colors?.border;
    if (b.style && b.style !== 'none') {
      const bWidth = b.width !== undefined ? b.width : 1;
      styles.border = `${bWidth}px ${b.style} ${bColor || '#cbd5e1'}`;
    } else if (bColor) {
      styles.borderColor = bColor;
    }
    if (b.radius !== undefined) {
      styles.borderRadius = `${b.radius}px`;
    }
    const shadowBlur = parseInt(b.shadowBlur || 0, 10);
    const shadowSpread = parseInt(b.shadowSpread || 0, 10);
    if (shadowBlur > 0 || shadowSpread > 0) {
      styles.boxShadow = `0 4px ${shadowBlur}px ${shadowSpread}px ${b.shadowColor || 'rgba(0, 0, 0, 0.15)'}`;
    }

    // Typography
    const typo = (config.typography && (config.typography[viewMode] || config.typography['desktop'])) || {};
    if (typo.fontFamily) styles.fontFamily = typo.fontFamily;
    if (typo.fontSize) styles.fontSize = `${typo.fontSize}px`;
    if (typo.weight || typo.fontWeight) styles.fontWeight = typo.weight || typo.fontWeight;
    if (typo.textAlign) styles.textAlign = typo.textAlign;
    if (typo.lineHeight) styles.lineHeight = `${typo.lineHeight}em`;
    if (typo.letterSpacing) styles.letterSpacing = `${typo.letterSpacing}px`;
    if (typo.textTransform && typo.textTransform !== 'none') styles.textTransform = typo.textTransform;

    // Colors & CSS variables cascading override
    if (config.colors) {
      if (config.colors.text) {
        styles.color = config.colors.text;
        styles['--text-dark'] = config.colors.text;
        styles['--header-text'] = config.colors.text;
      }
      if (config.colors.textSecondary) {
        styles['--text-muted'] = config.colors.textSecondary;
      }
      if (config.colors.accent) {
        styles['--primary'] = config.colors.accent;
      }
      if (config.colors.border) {
        styles['--border-color'] = config.colors.border;
      }
      if (config.colors.background) {
        styles['--white'] = config.colors.background;
      }
    }

    // Spacing (Margins, Paddings, Gaps)
    const sp = (config.spacing && (config.spacing[viewMode] || config.spacing['desktop'])) || {};
    const u = config.spacing?.unit || 'px';
    if (sp.marginTop !== undefined && sp.marginTop !== 0) styles.marginTop = `${sp.marginTop}${u}`;
    if (sp.marginBottom !== undefined && sp.marginBottom !== 0) styles.marginBottom = `${sp.marginBottom}${u}`;
    if (sp.marginLeft !== undefined && sp.marginLeft !== 0) styles.marginLeft = `${sp.marginLeft}${u}`;
    if (sp.marginRight !== undefined && sp.marginRight !== 0) styles.marginRight = `${sp.marginRight}${u}`;
    if (sp.paddingTop !== undefined && sp.paddingTop !== 0) styles.paddingTop = `${sp.paddingTop}${u}`;
    if (sp.paddingBottom !== undefined && sp.paddingBottom !== 0) styles.paddingBottom = `${sp.paddingBottom}${u}`;
    if (sp.paddingLeft !== undefined && sp.paddingLeft !== 0) styles.paddingLeft = `${sp.paddingLeft}${u}`;
    if (sp.paddingRight !== undefined && sp.paddingRight !== 0) styles.paddingRight = `${sp.paddingRight}${u}`;
    if (sp.rowGap !== undefined && sp.rowGap > 0) styles.rowGap = `${sp.rowGap}${u}`;
    if (sp.columnGap !== undefined && sp.columnGap > 0) styles.columnGap = `${sp.columnGap}${u}`;

    // Layout
    const lay = (config.layout && (config.layout[viewMode] || config.layout['desktop'])) || {};
    if (lay.display) styles.display = lay.display;
    if (lay.justifyContent) styles.justifyContent = lay.justifyContent;
    if (lay.alignItems) styles.alignItems = lay.alignItems;
    if (lay.width) styles.width = `${lay.width}%`;
    if (lay.minHeight) styles.minHeight = `${lay.minHeight}px`;
    if (lay.overflowHidden) styles.overflow = 'hidden';

    // Visibility
    if (config.visibility && config.visibility[viewMode] === false) {
      styles.display = 'none'; // Completely hide if disabled for this view mode on live site
    }

    // Grid Layout
    if (includeGrid && config.gridLayout) {
      const g = config.gridLayout[viewMode] || config.gridLayout['desktop'] || {};
      const displayMode = g.displayMode || 'grid';
      const columns = g.columns || 1;
      const gap = g.gap !== undefined ? g.gap : 16;

      if (displayMode === 'carousel' || displayMode === 'horizontal-slider') {
        styles.display = 'flex';
        styles.gap = `${gap}px`;
        styles.overflowX = 'auto';
      } else if (displayMode === 'grid') {
        styles.display = 'grid';
        styles.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        styles.gap = `${gap}px`;
      }
    }
  } catch (e) {
    console.error('Error generating block styles:', e);
  }
  return styles;
};
